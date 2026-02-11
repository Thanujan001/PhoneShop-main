const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, require },
  price: { type: String, require },
  image: { type: String, require },
});

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
