import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/products`)
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleEdit = (productId) => {
    navigate(`/update/${productId}`);
  };

  const handledelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${BACKEND_URL}/api/products/${id}`)
          .then(() => {
            setProducts(products.filter((product) => product._id !== id));
            Swal.fire("Deleted!", "Your product has been deleted.", "success");
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("Error!", "Failed to delete the product.", "error");
          });
      } else {
        Swal.fire("Cancelled", "Your product is safe :)", "info");
      }
    });
  };

  return (
    <>
      <div className="bg-[#d9d9d9] min-h-screen py-20">
        <h1 className="text-center text-3xl font-semibold text-red-800 mb-12">
          Thanujan
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-14 gap-y-10 px-6 max-w-6xl mx-auto">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-[#96acc0] border border-[#000000] rounded-xl shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-full h-100 overflow-hidden rounded-t-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300  hover:cursor-pointer"
                />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-900  mb-4">Price: ${product.price}</p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition hover:cursor-pointer"
                  >
                    <i className="bi bi-pen-fill mr-2"></i>Edit
                  </button>
                  <button
                    onClick={() => handledelete(product._id)}
                    className="bg-red-600 text-white font-medium py-2 rounded-md hover:bg-red-700 transition  hover:cursor-pointer"
                  >
                    <i className="bi bi-trash3-fill mr-2"></i>Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            to="/create"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold py-2 px-6 rounded-full transition"
          >
            + Add New Product
          </Link>
        </div>
      </div>
      <footer className="bg-[#02141f] text-white w-full mt-[250px]">
        <div className="flex flex-col items-center text-center px-4 py-8">
          {/* Logo */}
          <div className="mb-4">
            <img
              src="./smartphone.png"
              alt="Company Logo"
              className="w-[100px]"
            />
          </div>

          {/* Links */}
          <div className="mb-4 space-x-4">
            <a href="#" className="hover:text-[#50c1e9] transition-colors">
              About Us
            </a>
            <span>|</span>
            <a href="#" className="hover:text-[#50c1e9] transition-colors">
              Contact
            </a>
            <span>|</span>
            <a href="#" className="hover:text-[#50c1e9] transition-colors">
              Privacy Policy
            </a>
          </div>

          {/* Social Icons */}
          <div className="mb-4 flex gap-4 justify-center">
            <a
              href="#"
              className="text-white hover:text-[#50c1e9] transition-colors text-xl"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="#"
              className="text-white hover:text-[#50c1e9] transition-colors text-xl"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="#"
              className="text-white hover:text-[#50c1e9] transition-colors text-xl"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>

          {/* Footer Text */}
          <p className="text-sm mt-2">
            &copy; Tharshihan 2024. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

export default AdminDashboard;
