import React, { useEffect, useState } from "react";
import { db } from "../../firebase"; // Ensure this path is correct
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import MenuDashboard from "../../components/MenuDashboard";

const MgBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedDay, setSelectedDay] = useState("today"); // Default selection is "today"

  // Helper function to format date to "YYYY-MM-DD"
  const formatDate = (date) => date.toISOString().split("T")[0];

  // Get today's, tomorrow's, and the next day's dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 2);

  // Precompute the formatted dates
  const todayStr = formatDate(today);
  const tomorrowStr = formatDate(tomorrow);
  const nextDayStr = formatDate(nextDay);

  // Function to fetch bookings based on the selected day
  const fetchBookings = async (day) => {
    let selectedDate;
    if (day === "today") {
      selectedDate = todayStr;
    } else if (day === "tomorrow") {
      selectedDate = tomorrowStr;
    } else if (day === "nextDay") {
      selectedDate = nextDayStr;
    }

    const bookingsCollection = collection(db, "bookings");
    const bookingsQuery = query(
      bookingsCollection,
      where("date", "==", selectedDate)
    );

    const bookingSnapshot = await getDocs(bookingsQuery);
    const bookingList = bookingSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBookings(bookingList);
  };

  useEffect(() => {
    fetchBookings(selectedDay); // Fetch bookings on component mount based on the default selected day
  }, [selectedDay]);

  // Handle the selection change for the dropdown
  const handleDayChange = (e) => {
    setSelectedDay(e.target.value); // Update the selected day state
  };

  const handleContacted = async (id) => {
    const bookingDoc = doc(db, "bookings", id);
    await updateDoc(bookingDoc, {
      isContacted: true, // Update this field in Firestore
    });
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === id ? { ...booking, isContacted: true } : booking
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <MenuDashboard />

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8">Booking</h1>

        {/* Dropdown for selecting the day */}
        <div className="mb-4">
          <label htmlFor="day-select" className="mr-2">Chọn ngày:</label>
          <select
            id="day-select"
            value={selectedDay}
            onChange={handleDayChange}
            className="px-4 py-2 border rounded"
          >
            <option value="today">Hôm nay</option>
            <option value="tomorrow">Ngày mai</option>
            <option value="nextDay">Ngày kế tiếp</option>
          </select>
        </div>

        {/* Booking Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-2 px-4 border-b">Customer Name</th>
                <th className="py-2 px-4 border-b">Số người</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Time</th>
                <th className="py-2 px-4 border-b">Đã Liên Hệ</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="text-center hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{booking.customerName}</td>
                  <td className="py-2 px-4 border-b">{booking.numberOfPeople}</td>
                  <td className="py-2 px-4 border-b">{booking.phone}</td>
                  <td className="py-2 px-4 border-b">{booking.date}</td>
                  <td className="py-2 px-4 border-b">{booking.time}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleContacted(booking.id)}
                      className={`${
                        booking.isContacted ? "" : "bg-blue-500"
                      } text-white px-2 py-1 rounded`}
                      disabled={booking.isContacted}
                    >
                      {booking.isContacted ? "✅" : "Liên Hệ"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default MgBooking;
