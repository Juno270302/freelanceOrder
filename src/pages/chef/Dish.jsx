import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase"; // Import cấu hình firebase của bạn
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const Dish = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const billsCollection = collection(db, "bills");

    // Sử dụng onSnapshot để lắng nghe thay đổi trong collection
    const unsubscribe = onSnapshot(billsCollection, (billsSnapshot) => {
      const billsList = billsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sắp xếp theo thời gian tạo, hóa đơn cũ nhất lên đầu
      const sortedBills = billsList.sort((a, b) => a.createdAt - b.createdAt);

      setBills(sortedBills);
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const markAsCooked = async (billId) => {
    const billRef = doc(db, "bills", billId);
    await updateDoc(billRef, { isCooked: true });
  };

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
    <div className="container mx-auto p-4 py-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-4">
          Danh sách cần giao cho khách
        </h2>
        <button
          onClick={handleSignOut}
          className="bg-[#EF4444] text-white px-5 py-1.5 rounded-lg"
        >
          Logout
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
              <th className="py-3 px-4 border-b">Số bàn</th>
              <th className="py-3 px-4 border-b">Món Ăn</th>
              <th className="py-3 px-4 border-b">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {bills
              .filter((bill) => !bill.isCooked) // Lọc chỉ những hóa đơn chưa nấu
              .map((bill) => (
                <tr key={bill.id} className="text-gray-700 text-center">
                  <td className="py-3 px-4 border-b">{bill.tableNumber}</td>
                  <td className="py-3 px-4 border-b flex flex-col items-center">
                    {bill.items?.map((dish, index) => (
                      <div key={index} className="flex justify-between py-1">
                        <li>
                          ({dish.category}) - {dish.name} - x{dish.quantity}
                        </li>
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4 border-b">
                    <button
                      onClick={() => markAsCooked(bill.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Đã nấu xong
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dish;
