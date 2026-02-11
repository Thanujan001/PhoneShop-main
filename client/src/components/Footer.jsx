import React from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

function Footer() {
  return (
    <footer className="bg-gray-900 ">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-center text-teal-600 ">
          <img src="./smartphone.png" className="w-20 h-20" alt="logo" />
        </div>

        <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500 ">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt
          consequuntur amet culpa cum itaque neque.
        </p>

        <ul className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12 no-underline">
          {[
            { name: "About", to: "/" },
            { name: "Careers", to: "/" },
            { name: "History", to: "/" },
            { name: "Services", to: "/" },
            { name: "Projects", to: "/" },
            { name: "Blog", to: "/" },
          ].map((item, i) => (
            <li key={i}>
              <Link
                to={item.to}
                className="!text-gray-200 hover:!text-red-400 transition-colors duration-300  !no-underline "
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="flex justify-center gap-6 md:gap-8">
          {/* Facebook */}
          <li>
            <Link to="/" className="group">
              <span className="sr-only">Facebook</span>
              <i className="fab fa-facebook-f text-2xl text-gray-100 transition-colors duration-300 group-hover:text-teal-600"></i>
            </Link>
          </li>

          {/* Twitter */}
          <li>
            <Link to="/" className="group">
              <span className="sr-only">Twitter</span>
              <i className="fab fa-twitter text-2xl text-gray-100 transition-colors duration-300 group-hover:text-teal-600"></i>
            </Link>
          </li>

          {/* Instagram */}
          <li>
            <Link to="/" className="group">
              <span className="sr-only ">Instagram</span>
              <i className="fab fa-instagram text-2xl text-gray-100 transition-colors duration-300 group-hover:text-teal-600"></i>
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
