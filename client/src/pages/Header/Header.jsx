import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header id="header">
      <div className="header bg-red">
        <div className="logo">
          <img src="./smartphone.png" className="w-20 h-20" alt="logo" />
        </div>
        <div className="navbar">
          <ul className="menu">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/services">services</Link>
            </li>
            <li>
              <Link to="/login"> Login</Link>
            </li>
            <li>
              <Link to="/signup"> Signup</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
