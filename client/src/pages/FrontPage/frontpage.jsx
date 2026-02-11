import React from "react";
import "./frontpage.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";
import Header from "../Header/Header.jsx";
import Services from "../Services.jsx";

function FrontPage() {
  return (
    <>
      <>
        <Header />
        <section id="banner">
          <div className="banner">
            <div className="banner-info">
              <h1>
                Rio Mobiles
                <i className="bi bi-phone" style={{ color: "blue" }}></i>
              </h1>
              <div className="rating">
                <p>Master Show Room</p>
                <div className="stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p>50 Ratings</p>
              </div>

              <p>
                At Rio Mobiles, we bring you the latest smartphones with
                cutting-edge technology, exceptional quality, and unbeatable
                prices. As a trusted master showroom, we ensure a seamless
                shopping experience with expert guidance and customer
                satisfaction at the heart of everything we do. Whether you`re
                looking for flagship models, budget-friendly options, or premium
                accessories, our wide range of products caters to every need.
                Visit us today and experience innovation like never before!
              </p>
            </div>
            <div className="course">
              <div className="course-block">
                <h4>Kalmunai</h4>
                <p>opens at 8.00 am</p>
              </div>
              <div className="course-block">
                <h4>Galle</h4>
                <p>opens at 8.00 am</p>
              </div>
              <div className="course-block">
                <h4>Colombo</h4>
                <p>opens at 9.00 am</p>
              </div>
            </div>
            {/* <div className="GetStart">Get Start</div> */}
          </div>
        </section>

        <footer id="footer">
          <div className="footer">
            <div className="footer-content">
              <div className="footer-logo">
                <img src="./smartphone.png" alt="Company Logo" />
              </div>
              <div className="footer-links">
                <a href="#">About Us</a> | <a href="#">Contact</a> |
                <a href="#">Privacy Policy</a>
              </div>
              <div className="footer-social">
                <a href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            <p>&copy; Tharshihan 2024 . All rights reserved.</p>
          </div>
          <br />
          <br />
        </footer>
      </>
    </>
  );
}

export default FrontPage;
