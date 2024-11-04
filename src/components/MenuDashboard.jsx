import React from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const MenuDashboard = () => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Đăng xuất thành công");
      navigate("/login"); // Chuyển hướng đến trang đăng nhập hoặc trang bạn muốn
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
      // Hiển thị thông báo lỗi cho người dùng nếu cần
    }
  };
  return (
    <aside className="w-64 bg-indigo-600 text-white shadow-lg flex flex-col justify-between h-screen">
      <div>
        <div className="p-6">
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        </div>
        <nav className="mt-10 space-y-2">
          <a
            href="/dashboard"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-500"
          >
            Quản lý đơn hàng
          </a>
          <a
            href="/dashboard/category"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-500"
          >
            Quản lý category
          </a>
          <a
            href="/dashboard/menu"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-500"
          >
            Quản lý món ăn
          </a>
          <a
            href="/dashboard/user"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-500"
          >
            Quản lý user
          </a>
          <a
            href="/dashboard/booking"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-500"
          >
            Quản lý Booking
          </a>
        </nav>
      </div>
      <div className="p-6">
        <button
          className="w-full py-2.5 px-4 bg-red-500 rounded transition duration-200 hover:bg-red-400"
          onClick={handleSignOut}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default MenuDashboard;
