import React from "react";

const MenuChef = () => {
  return (
    <aside className="w-64 bg-indigo-600 text-white shadow-lg">
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
    </aside>
  );
};

export default MenuChef;
