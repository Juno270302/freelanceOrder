import React, { useEffect, useState } from "react";
import { auth } from "../firebase"; // Adjust the path as necessary
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the path as necessary
import { Link, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const Staff = () => {
  const [role, setRole] = useState(null); // State to hold the user's role
  const [loading, setLoading] = useState(true); // State for loading
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRole(docSnap.data().role); // Set the user's role
        } else {
          console.log("No such document!");
        }
      } else {
        navigate("/"); // Redirect if not logged in
      }
      setLoading(false); // Stop loading
    });

    return () => unsubscribe(); // Cleanup the subscription
  }, [navigate]);

  if (loading) return <div>Đang tải...</div>; // Show loading state

  // Check if the user has admin role
  if (role !== "staff") {
    return <div>Bạn không có quyền truy cập trang này.</div>; // Access denied message
  }

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
    <div>
      <div className="fixed bottom-0 left-0 w-full bg-black/40 py-2 ">
        <ul className="flex items-center justify-center overflow-x-auto flex-nowrap space-x-4 px-2">
          <Link
            to={"/"}
            className={`cursor-pointer py-2 px-4 rounded-lg whitespace-nowrap font-mont-bold text-white`}
          >
            Đơn hàng
          </Link>
          <Link
            to={"/staff/booking"}
            className={`cursor-pointer py-2 px-4 rounded-lg whitespace-nowrap font-mont-bold text-white`}
          >
            Đặt bàn
          </Link>
          <button
            onClick={handleSignOut}
            className={`cursor-pointer py-2 px-4 rounded-lg whitespace-nowrap font-mont-bold text-red-500`}
          >
            Logout
          </button>
        </ul>
      </div>
      <Outlet />
    </div>
  );
};

export default Staff;
