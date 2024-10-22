import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
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

  const handleSignIn = async () => {
    try {
      setLoading(true); // Bắt đầu loading
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        console.log("Đăng nhập thành công:", user);
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      // Hiển thị thông báo lỗi cho người dùng (có thể thêm state để hiển thị thông báo)
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  if (loading) return <div>Đang tải...</div>; // Hiển thị loading trong khi kiểm tra trạng thái đăng nhập

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Đăng Nhập</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu:</label>
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
          onClick={handleSignIn} 
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Đăng nhập
        </button>

        {/* Register Button */}
        <button
          onClick={() => navigate("/register")} // Redirect to register page
          className="w-full mt-4 bg-gray-600 text-white font-semibold py-2 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
};

export default Login;
