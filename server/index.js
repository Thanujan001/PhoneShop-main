require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const userModel = require("./models/users");
const productModel = require("./models/products");
require("./db"); // ensure DB connection loads

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Middleware
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:4000", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

/////////////////////////////////////////////////
// SIGNUP
/////////////////////////////////////////////////

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const hash = await bcrypt.hash(password, 10);

    await userModel.create({
      name,
      email,
      password: hash,
    });

    res.json({ status: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});

/////////////////////////////////////////////////
// LOGIN
/////////////////////////////////////////////////

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ status: "error", message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({ status: "error", message: "Wrong password" });
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      "jwt-secret-key",
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
    });

    res.json({
      status: "success",
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

/////////////////////////////////////////////////
// CREATE PRODUCT
/////////////////////////////////////////////////

app.post("/api/products", async (req, res) => {
  try {
    const { name, price, image } = req.body;

    if (!name || !price || !image) {
      return res.status(400).json({
        success: false,
        message: "Fill all fields",
      });
    }

    const newProduct = await productModel.create(req.body);

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/////////////////////////////////////////////////
// GET ALL PRODUCTS
/////////////////////////////////////////////////

app.get("/api/products", async (req, res) => {
  try {
    const products = await productModel.find();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/////////////////////////////////////////////////
// GET SINGLE PRODUCT
/////////////////////////////////////////////////

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/////////////////////////////////////////////////
// UPDATE PRODUCT
/////////////////////////////////////////////////

app.put("/api/products/:id", async (req, res) => {
  try {
    const updated = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
});

/////////////////////////////////////////////////
// DELETE PRODUCT
/////////////////////////////////////////////////

app.delete("/api/products/:id", async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
});

/////////////////////////////////////////////////
// STRIPE CHECKOUT
/////////////////////////////////////////////////

app.post("/api/checkout", async (req, res) => {
  try {
    const { totalAmount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Phone Shop Order",
            },
            unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:4000/success",
      cancel_url: "http://localhost:4000/cart",
    });

    res.json({
      id: session.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});

/////////////////////////////////////////////////
// SERVER START
/////////////////////////////////////////////////

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
