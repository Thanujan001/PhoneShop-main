import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import Nav from "./Nav";
import { addCart } from "../../redux/slice";
import Footer from "../../components/Footer";

function CustomerDashboard() {
  const [products, setProducts] = useState([]);
  const selected = useState("true");
  const dispatch = useDispatch();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/products`)
      .then((res) => {
        const updatedProducts = res.data.data.map((product) => ({
          ...product,
          quantity: 0, // Initialize quantity for all products
        }));
        setProducts(updatedProducts);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Nav />

      <div className="flex justify-center bg-[#d9d9d9]">
        <div className="grid grid-cols-3 gap-x-14 gap-y-10 p-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="w-[300px] h-[450px] overflow-hidden rounded-lg bg-[#feda87] shadow"
            >
              <img
                src={product.image}
                className="aspect-video w-full h-[300px] object-cover transition-transform transform hover:scale-105 duration-500 ease-in-out"
                alt={product.title}
                onError={(e) => {
                  e.target.src = "/fallback-image.jpg";
                }}
              />
              <div className="p-4">
                <h3 className="text-xl font-medium text-gray-900">
                  {product.name}
                </h3>
                <p className="mt-1 text-gray-500">{product.description}</p>
                <div className="mt-2 flex gap-1">
                  {selected ? (
                    <button
                      onClick={() => {
                        dispatch(
                          addCart({
                            _id: product._id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            quantity: 1,
                          })
                        );
                      }}
                      className="py-1 px-3 inline-flex items-center gap-x-2 text-xs font-medium  !rounded-lg border-transparent bg-cyan-600 text-white hover:bg-cyan-950 focus:outline-none focus:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      ADD
                    </button>
                  ) : (
                    <button>remove</button>
                  )}

                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-xl font-semibold text-neutral-950">
                    ${product.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default CustomerDashboard;
