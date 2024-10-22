import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

// Import các component tương ứng
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Booking from "./pages/Booking";
import Login from "./pages/Account/Login"; // Thêm import cho component Login
import Navbar from "./components/Navbar";
import Order from "./pages/Order";
import Register from "./pages/Account/Register";
import Dashboard from "./pages/Dashboard";
import ThankYou from "./pages/ThankYou";

const App = () => {
  const location = useLocation();

  // Kiểm tra xem đường dẫn hiện tại có phải là '/order/:table' không
  const shouldShowNavbar =
    !location.pathname.startsWith("/order") &&
    !location.pathname.startsWith("/dashboard") &&
    !location.pathname.startsWith("/thankyou");

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/order/:tableNumber" element={<Order />} />
        <Route path="/thankyou" element={<ThankYou />} />
      </Routes>
    </>
  );
};

const Main = () => (
  <Router>
    <App />
  </Router>
);

export default Main;
