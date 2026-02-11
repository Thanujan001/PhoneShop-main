import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import "./App.css";
// import FrontPage from "./pages/FrontPage/frontpage";
// import Signup from "./pages/Register/Signup";
// import Login from "./pages/Register/Login";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import CreateProducts from "./pages/AdminDashboard/CreateProducts";
import UpdateProducts from "./pages/AdminDashboard/UpdateProducts ";
// import CustomerDashboard from "./pages/CustomerDashboard/CustomerDashboard";
// import CartPage from "./pages/Cart/Cart";
// import Success from "./pages/Cart/Success";
// import Cancel from "./pages/Cart/Cancel";

function App() {
  const ProtectedRoute = () => {
    const user = true;
    return user ? <Outlet /> : <Navigate to="/" />;
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<FrontPage />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} /> */}

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AdminDashboard />}></Route>
            <Route path="/create" element={<CreateProducts />}></Route>
            <Route path="/update/:id" element={<UpdateProducts />}></Route>
            {/* <Route path="/customer" element={<CustomerDashboard />}></Route> */}
            {/* <Route path="/cart" element={<CartPage />}></Route> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
