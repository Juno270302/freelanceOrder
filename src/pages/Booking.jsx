import React, { useState, useEffect } from "react";
import { auth } from "../firebase"; // Firebase Auth import
import { getDoc, doc, setDoc, collection } from "firebase/firestore"; // Firestore import
import { db } from "../firebase";

const Booking = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    date: "",
    time: "00:00",
    phone: "",
    email: "",
    numberOfPeople: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch user contact info from Firestore
  useEffect(() => {
    const fetchUserData = async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setFormData((prevFormData) => ({
            ...prevFormData,
            customerName: userData.name || "",
            phone: userData.phone || "",
            email: user.email || "",
          }));
        } else {
          console.log("No such document!");
        }
      }
      setLoading(false);
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save the form data to Firestore
      const bookingsCollection = collection(db, "bookings"); // Your Firestore collection for bookings
      await setDoc(doc(bookingsCollection), { // Use addDoc(bookingsCollection, formData) to auto-generate ID
        ...formData,
        createdAt: new Date(), // Optionally, add a timestamp
      });
      console.log("Booking submitted:", formData);
      // Reset form after submission
      setFormData({
        customerName: "",
        date: "",
        time: "",
        phone: "",
        email: "",
        numberOfPeople: "",
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
    }
  };

  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];

  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 3);
  const formattedMaxDate = maxDate.toISOString().split("T")[0];

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Booking Page</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="customerName">
            Tên khách hàng
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="date">
            Ngày
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            min={formattedToday}
            max={formattedMaxDate}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="time">
            Giờ
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="numberOfPeople">
            Số người
          </label>
          <input
            type="number"
            id="numberOfPeople"
            name="numberOfPeople"
            value={formData.numberOfPeople}
            onChange={handleChange}
            required
            min="1"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="phone">
            Số điện thoại
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Đặt chỗ
        </button>
      </form>
    </div>
  );
};

export default Booking;
