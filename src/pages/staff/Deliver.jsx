import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase"; // Import cấu hình firebase của bạn
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const Staff = () => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null); // State to manage the selected bill for payment
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

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

  // Function to update the bill status in Firestore
  const updateBillStatus = async (billId, updateData) => {
    const billRef = doc(db, "bills", billId);

    try {
      await updateDoc(billRef, updateData);
      console.log("Bill status updated successfully");
    } catch (error) {
      console.error("Error updating bill status:", error);
    }
  };

  // Function to open the modal with the selected bill's information
  const handlePaymentClick = (bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBill(null);
  };

  // Function to handle payment confirmation
  const handlePaymentConfirmed = () => {
    if (selectedBill) {
      updateBillStatus(selectedBill.id, { isPaid: true }); // Update the bill to mark as paid
      closeModal(); // Close the modal
    }
  };


  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center py-2">
        <h2 className="text-xl font-semibold mb-4">Danh sách cần giao</h2>
        
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
              <th className="py-3 px-4 border-b">Số bàn</th>
              <th className="py-3 px-4 border-b">Món Ăn</th>
              <th className="py-3 px-4 border-b">Giao</th>
              <th className="py-3 px-4 border-b">Thanh Toán</th>
            </tr>
          </thead>
          <tbody>
            {bills
              .filter((bill) => bill.isCooked)
              .filter((bill) => !bill.isPaid)
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
                    {!bill.isDeliver ? (
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={() => {
                          updateBillStatus(bill.id, { isDeliver: true });
                          bill.isDeliver = true; // Update local state
                        }}
                      >
                        Giao
                      </button>
                    ) : (
                      <span className="text-green-600">Đã giao</span>
                    )}
                  </td>
                  {!bill.isDeliver ? (
                    "Chờ giao"
                  ) : (
                    <td className="py-3 px-4 border-b">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => handlePaymentClick(bill)} // Open the modal with the bill details
                      >
                        Thanh Toán
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal for payment details */}
      {isModalOpen && selectedBill && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ">
          {" "}
          {/* Dark background */}
          <div className="bg-white p-8 rounded-lg shadow-lg w- max-w-2xl border">
            {" "}
            {/* Increased width and padding */}
            <h2 className="text-xl font-semibold mb-4">Thông tin hóa đơn</h2>
            <div className="flex justify-between ">
              <div className="w-[50%]">
                <p>
                  <strong>Số bàn:</strong> {selectedBill.tableNumber}
                </p>
                <p>
                  <strong>Món ăn:</strong>
                </p>
                <ul>
                  {selectedBill.items?.map((dish, index) => (
                    <li key={index}>
                      + ({dish.category}) - {dish.name} - x{dish.quantity}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Tổng tiền:</strong> {selectedBill.totalAmount} VND
                </p>
              </div>
              <div className="w-[40%] flex flex-col justify-center ">
                <p className="text-center">Quét mã Momo</p>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/order-f3045.appspot.com/o/q%E1%BA%BB.png?alt=media&token=a774c878-fbf4-4f13-bdd5-14ec96388c02"
                  alt="qr"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Đóng
              </button>
              <button
                onClick={handlePaymentConfirmed}
                className="bg-green-500 text-white px-4 py-2 rounded ml-2"
              >
                Đã Thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
