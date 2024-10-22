import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // Đảm bảo đường dẫn đúng đến file firebase của bạn
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore"; // Thêm hàm setDoc từ firestore
import { db } from "../../firebase"; // Đảm bảo bạn đã cấu hình đúng firestore

function Register() {
  const [name, setName] = useState(""); // State cho tên người dùng
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Nếu đã đăng nhập, chuyển hướng đến trang chính
        navigate("/");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe(); // Dọn dẹp khi component unmount
  }, [navigate]);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Thêm thông tin người dùng vào Firestore sau khi đăng ký thành công
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        phone: phone,
        email: email,
        role:"user",
        createdAt: new Date(),
      });

      console.log("Đăng ký thành công:", user);
      navigate("/"); // Chuyển hướng người dùng đến trang chính
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      // Hiển thị thông báo lỗi cho người dùng nếu cần
    }
  };

  if (loading) return <div>Đang tải...</div>; // Hiển thị loading trong khi kiểm tra trạng thái đăng nhập

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Đăng Ký</h2>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Tên:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập tên của bạn"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Số điện thoại:
          </label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập số điện thoại của bạn"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập email"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Mật khẩu:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập mật khẩu"
          />
        </div>
        <button
          onClick={handleSignUp}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
}

export default Register;
