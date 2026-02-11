import "./App.css";
import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

//import Header from "./pages/Header/Header";
import FrontPage from "./pages/FrontPage/frontpage";
import Signup from "./pages/Register/Signup";
import Login from "./pages/Register/Login";
// import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
// import CreateProducts from "./pages/AdminDashboard/CreateProducts";
// import UpdateProducts from "./pages/AdminDashboard/UpdateProducts ";
import CustomerDashboard from "./pages/CustomerDashboard/CustomerDashboard";
import CartPage from "./pages/Cart/Cart";
import Success from "./pages/Cart/Success";
import Cancel from "./pages/Cart/Cancel";
import Services from "./pages/Services";
import About from "./pages/About";

const ProtectedRoute = () => {
  const user = true;
  return user ? <Outlet /> : <Navigate to="/" />;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FrontPage />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/services" element={<Services />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />

          <Route element={<ProtectedRoute />}>
            {/* <Route path="/admin" element={<AdminDashboard />}></Route>
            <Route path="/create" element={<CreateProducts />}></Route>
            <Route path="/update/:id" element={<UpdateProducts />}></Route> */}
            <Route path="/customer" element={<CustomerDashboard />}></Route>
            <Route path="/cart" element={<CartPage />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
