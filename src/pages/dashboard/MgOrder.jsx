import React, { useEffect, useState } from "react";
import MenuDashboard from "../../components/MenuDashboard";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust path as necessary
import moment from "moment"; // For formatting date and time
import Modal from "react-modal"; // Ensure to install react-modal using `npm install react-modal`

const MgOrder = () => {
  const [bills, setBills] = useState([]); // State to store bills data
  const [loading, setLoading] = useState(true); // State for loading
  const [totalRevenue, setTotalRevenue] = useState(0); // State for today's total revenue
  const [weeklyRevenue, setWeeklyRevenue] = useState(0); // State for weekly revenue
  const [monthlyRevenue, setMonthlyRevenue] = useState(0); // State for monthly revenue
  const [yearlyRevenue, setYearlyRevenue] = useState(0); // State for yearly revenue
  const [selectedBill, setSelectedBill] = useState(null); // State for selected bill
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal

  useEffect(() => {
    const fetchBills = async () => {
      try {
        // Query to order bills by createdAt in descending order
        const billsCollection = collection(db, "bills");
        const billsQuery = query(billsCollection, orderBy("createdAt", "desc"));
        const billsSnapshot = await getDocs(billsQuery);
        const billsList = billsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBills(billsList);

        const today = moment().startOf("day");
        const startOfWeek = moment().startOf("week");
        const startOfMonth = moment().startOf("month");
        const startOfYear = moment().startOf("year");

        // Calculate total revenue for today where isPaid is true
        const totalToday = billsList
          .filter(
            (bill) =>
              bill.isPaid &&
              moment(bill.createdAt.toDate()).isSameOrAfter(today)
          )
          .reduce((sum, bill) => sum + bill.totalAmount, 0);

        // Calculate total revenue for the week where isPaid is true
        const totalWeek = billsList
          .filter(
            (bill) =>
              bill.isPaid &&
              moment(bill.createdAt.toDate()).isSameOrAfter(startOfWeek)
          )
          .reduce((sum, bill) => sum + bill.totalAmount, 0);

        // Calculate total revenue for the month where isPaid is true
        const totalMonth = billsList
          .filter(
            (bill) =>
              bill.isPaid &&
              moment(bill.createdAt.toDate()).isSameOrAfter(startOfMonth)
          )
          .reduce((sum, bill) => sum + bill.totalAmount, 0);

        // Calculate total revenue for the year where isPaid is true
        const totalYear = billsList
          .filter(
            (bill) =>
              bill.isPaid &&
              moment(bill.createdAt.toDate()).isSameOrAfter(startOfYear)
          )
          .reduce((sum, bill) => sum + bill.totalAmount, 0);

        setTotalRevenue(totalToday);
        setWeeklyRevenue(totalWeek);
        setMonthlyRevenue(totalMonth);
        setYearlyRevenue(totalYear);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bills:", error);
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  // Function to format amount as VND currency (e.g., 2.000.000 VND)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Open modal and set the selected bill
  const handleViewDetails = (bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBill(null);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <MenuDashboard />

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8">Order</h1>

        {/* Total Revenue */}
        <div className="flex justify-between">
          <div className="bg-white p-4 shadow-md rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Lợi Nhận Trong Ngày: {formatCurrency(totalRevenue)}
            </h2>
          </div>
          <div className="bg-white p-4 shadow-md rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Lợi Nhận Trong Tuần: {formatCurrency(weeklyRevenue)}
            </h2>
          </div>
          <div className="bg-white p-4 shadow-md rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Lợi Nhận Trong Tháng: {formatCurrency(monthlyRevenue)}
            </h2>
          </div>
          <div className="bg-white p-4 shadow-md rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Lợi Nhận Trong Năm: {formatCurrency(yearlyRevenue)}
            </h2>
          </div>
        </div>

        {/* Display bills data */}
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-3 px-4">Table Number</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Thanh Toán</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr
                key={bill.id}
                className="border-b text-center hover:bg-gray-100"
              >
                <td className="py-3 px-4">{bill.tableNumber}</td>
                <td className="py-3 px-4">
                  {formatCurrency(bill.totalAmount)}
                </td>
                <td className="py-3 px-4">
                  {bill.isPaid ? (
                    <div className="text-green-500">Đã Thanh Toán</div>
                  ) : (
                    <div className="text-red-500">Chưa Thanh Toán</div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <button onClick={() => handleViewDetails(bill)}>
                    Xem Chi Tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {/* Modal for showing bill details */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Bill Details"
        className="bg-white p-6 shadow-md rounded-lg w-1/2 mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        {selectedBill && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Tổng Hóa Đơn
            </h2>

            <p>
              <strong>Ngày Đặt:</strong>{" "}
              {moment(selectedBill.createdAt.toDate()).format(
                "DD/MM/YYYY HH:mm"
              )}
            </p>
            <p>
              <strong>Số Bàn:</strong> {selectedBill.tableNumber}
            </p>

            <p>
              <strong>Tên Khách Hàng:</strong> {selectedBill.guess.name}
            </p>
            <p>
              <strong>Món Ăn Đã Đặt:</strong>
            </p>
            <ul className="list-disc ml-5">
              {selectedBill.items.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.price} x {item.quantity}
                </li>
              ))}
            </ul>
            <p>
              <strong>Tổng Hóa Đơn:</strong>{" "}
              {formatCurrency(selectedBill.totalAmount)}
            </p>
            <button
              onClick={closeModal}
              className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MgOrder;
