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
import MgOrder from "./pages/dashboard/MgOrder";
import MgCategory from "./pages/dashboard/MgCategory";
import MgMenu from "./pages/dashboard/MgMenu";
import MgUser from "./pages/dashboard/MgUser";
import MgBooking from "./pages/dashboard/MgBooking";
import Chef from "./pages/Chef";
import Dish from "./pages/chef/Dish";
import Deliver from "./pages/staff/Deliver";
import Staff from "./pages/Staff";
import StaffBooking from "./pages/staff/StaffBooking";

const App = () => {
  const location = useLocation();

  // Kiểm tra xem đường dẫn hiện tại có phải là '/order/:table' không
  const shouldShowNavbar =
    !location.pathname.startsWith("/order") &&
    !location.pathname.startsWith("/dashboard") &&
    !location.pathname.startsWith("/chef") &&
    !location.pathname.startsWith("/staff") &&
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

        <Route path="/order/:tableNumber" element={<Order />} />
        <Route path="/thankyou" element={<ThankYou />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<MgOrder />} />
          <Route path="category" element={<MgCategory />} />
          <Route path="menu" element={<MgMenu />} />
          <Route path="user" element={<MgUser />} />
          <Route path="booking" element={<MgBooking />} />
        </Route>

        <Route path="/chef" element={<Chef />}>
          <Route index element={<Dish />} />
        </Route>

        <Route path="/staff" element={<Staff />}>
          <Route index element={<Deliver />} />
          <Route path="booking" element={<StaffBooking />} />
        </Route>
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
