import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function UpdateProducts() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/products/${id}`)
      .then((res) => {
        const { name, price, image } = res.data.data;
        setProduct({ name, price, image });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("Error", "Failed to fetch product details", "error");
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`${BACKEND_URL}/api/products/${id}`, { ...product })
      .then(() => {
        Swal.fire("Updated!", "Your product has been updated.", "success");
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Error", "Failed to update the product", "error");
      });
  };

  return (
    <div className="max-w-md mx-auto mt-50 bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Update
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name:</label>
          <input
            name="name"
            type="text"
            required
            value={product.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Price:</label>
          <input
            name="price"
            type="text"
            required
            value={product.price}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Image URL:
          </label>
          <input
            name="image"
            type="text"
            required
            value={product.image}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200  hover:cursor-pointer"
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateProducts;
