import {
  collection,
  addDoc,
  updateDoc,
  arrayUnion,
  increment,
  doc,
} from "firebase/firestore"; // Import Firestore methods
import React from "react";
import { db } from "../firebase"; // Import your firebase configuration
import { useNavigate } from "react-router-dom";

const Bill = ({
  isOpen,
  onClose,
  cartItems,
  updateQuantity,
  tableNumber,
  infoGuess,
  idUser,
}) => {
  if (!isOpen) return null; // Không hiển thị nếu modal không mở
  const formattedTableNumber = tableNumber.replace(/-/g, " ");
  const navigate = useNavigate();
  // Tính tổng hóa đơn
  const totalAmount = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.-]+/g, "")); // Chuyển đổi giá từ chuỗi sang số
    return total + price * item.quantity; // Tính tổng
  }, 0);
  console.log(cartItems);

  // Hàm để ngăn chặn sự kiện đóng khi bấm vào nội dung bên trong modal
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  // Hàm xử lý submit form "Tính tiền"
  const handleCheckout = async (e) => {
    e.preventDefault();

    // Prepare bill data
    const billData = {
      items: cartItems,
      totalAmount: totalAmount,
      tableNumber: formattedTableNumber,
      guess: infoGuess || "none",
      createdAt: new Date(),
      isDeliver: false,
    };

    try {
      // Save the bill to Firestore
      const billDocRef = await addDoc(collection(db, "bills"), billData);
      console.log("Bill saved successfully!", billDocRef.id);

      // Prepare order data to add to the user's document
      const orderData = {
        orderId: billDocRef.id,
        ...billData,
      };

      if (idUser) {
        // Update the user's document with the new order
        const userId = idUser; // Replace with actual user ID
        const userDocRef = doc(db, "users", userId);

        // Update user document to include the new order and increment totalOrders
        await updateDoc(userDocRef, {
          totalOrders: increment(1), // Increment the totalOrders by 1
        });

        console.log("Order added to user successfully!");
      }

      // Close the modal or perform other actions
      onClose();
      navigate("/thankyou");
    } catch (error) {
      console.error("Error saving bill or updating user:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // Đóng modal khi bấm ra ngoài
    >
      <div
        className="bg-white p-5 rounded shadow-lg w-11/12 md:w-1/2"
        onClick={handleContentClick} // Ngăn đóng modal khi bấm vào nội dung bên trong
      >
        <h2 className="text-xl font-bold mb-4">Giỏ Hàng</h2>
        {cartItems.length === 0 ? (
          <p>Giỏ hàng trống.</p>
        ) : (
          // Giới hạn chiều cao danh sách món ăn và thêm thanh cuộn
          <div className="max-h-60 overflow-y-auto">
            <ul>
              {cartItems.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-2"
                >
                  <span>{item.name}</span>
                  <span>{item.price}</span>
                  <div className="flex items-center">
                    <button
                      className="mx-2 bg-gray-300 rounded px-2"
                      onClick={() => updateQuantity(item, -1)} // Giảm số lượng
                    >
                      -
                    </button>
                    <span>{item.quantity}</span> {/* Hiển thị số lượng */}
                    <button
                      className="mx-2 bg-gray-300 rounded px-2"
                      onClick={() => updateQuantity(item, 1)} // Tăng số lượng
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <h3 className="font-bold mt-4 text-right">
          Tổng hóa đơn: {totalAmount.toLocaleString()} VND
        </h3>
        {/* Hiển thị tổng hóa đơn */}
        {/* Form tính tiền */}
        <div className="flex justify-between items-center">
          <button
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            onClick={onClose}
          >
            Đóng
          </button>
          <form onSubmit={handleCheckout}>
            <button
              type="submit"
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Đặt Món
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Bill;
