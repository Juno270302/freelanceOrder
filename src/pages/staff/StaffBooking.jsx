import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Đường dẫn tệp firebase của bạn

const StaffBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filteredBookings, setFilteredBookings] = useState([]); // State for filtered bookings

  useEffect(() => {
    const fetchBookings = async () => {
      const bookingsCollection = collection(db, "bookings");
      const bookingsSnapshot = await getDocs(bookingsCollection);
      const bookingsList = bookingsSnapshot.docs.map((doc) => doc.data());

      // Lọc đặt chỗ để chỉ lấy những đặt chỗ trong hôm nay
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const todaysBookings = bookingsList.filter((booking) => {
        const bookingDate = new Date(booking.date); // Giả sử thời gian đặt là dạng string có thể chuyển đổi được
        return bookingDate >= startOfDay && bookingDate < endOfDay;
      });

      // Sắp xếp đặt chỗ theo thời gian
      todaysBookings.sort((a, b) => {
        const [hoursA, minutesA] = a.time.split(":").map(Number);
        const [hoursB, minutesB] = b.time.split(":").map(Number);
        return hoursA * 60 + minutesA - (hoursB * 60 + minutesB);
      });

      setBookings(todaysBookings);
      setFilteredBookings(todaysBookings); // Set filtered bookings initially
    };

    fetchBookings();
  }, []);

  // Update filtered bookings based on search term
  useEffect(() => {
    const filtered = bookings.filter((booking) =>
      booking.phone.includes(searchTerm) // Filter by phone number
    );
    setFilteredBookings(filtered);
  }, [searchTerm, bookings]); // Run whenever searchTerm or bookings change

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center py-2">
        <h2 className="text-xl font-semibold mb-4">Đặt Bàn Trong Ngày</h2>
        <input
          type="text"
          className="border border-black py-1 px-1 rounded"
          placeholder="Tìm theo số điện thoại"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
              <th className="py-3 px-4 border-b">Giờ đặt</th>
              <th className="py-3 px-4 border-b">Tên</th>
              <th className="py-3 px-4 border-b">Số Khách</th>
              <th className="py-3 px-4 border-b">SDT</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking, index) => (
              <tr key={index}>
                <td className="py-3 px-4 border-b text-center">{booking.time}</td>
                <td className="py-3 px-4 border-b text-center">{booking.customerName}</td>
                <td className="py-3 px-4 border-b text-center">{booking.numberOfPeople}</td>
                <td className="py-3 px-4 border-b text-center">{booking.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffBooking;
