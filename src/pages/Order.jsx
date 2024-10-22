import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Import your firebase config
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Bill from "../components/Bill";
import { FaPlus, FaMinus } from "react-icons/fa"; // Import các icon từ react-icons
import { useParams } from "react-router-dom"; // Import useParams
import { onAuthStateChanged } from "firebase/auth";

const Order = () => {
  const { tableNumber } = useParams(); // Lấy số bàn từ URL
  const [selectedCategory, setSelectedCategory] = useState("Lẩu");
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State để mở/đóng modal
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState({});
  const [userName, setUserName] = useState(""); // State to store user name
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid); // Use user's uid to fetch their document

        getDoc(docRef)
          .then((doc) => {
            if (doc.exists()) {
              setUserName(doc.data()); // Set user name from Firestore
            } else {
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.error("Error getting document:", error);
          })
          .finally(() => {
            setLoading(false); // Stop loading after data fetch
          });
      } else {
        setUserName(""); // Reset if no user is logged in
        setLoading(false); // Stop loading if no user
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const categoriesList = categoriesSnapshot.docs.map(
          (doc) => doc.data().name
        );
        setCategories(categoriesList);

        // Fetch dishes
        const dishesSnapshot = await getDocs(collection(db, "dishes"));
        const dishesData = {};
        dishesSnapshot.docs.forEach((doc) => {
          const dish = doc.data();
          if (!dishesData[dish.category]) {
            dishesData[dish.category] = [];
          }
          dishesData[dish.category].push(dish);
        });
        setDishes(dishesData);
      } catch (error) {
        console.error("Error fetching data from Firestore: ", error);
      }
    };

    fetchData();
  }, []);

  const addToCart = (dish) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === dish.name);
      if (existingItem) {
        return prevCart.map((item) =>
          item.name === dish.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...dish, quantity: 1 }];
    });
  };

  const updateQuantity = (item, change) => {
    setCart(
      (prevCart) =>
        prevCart
          .map((cartItem) =>
            cartItem.name === item.name
              ? { ...cartItem, quantity: cartItem.quantity + change }
              : cartItem
          )
          .filter((cartItem) => cartItem.quantity > 0) // Loại bỏ món ăn nếu số lượng là 0
    );
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="border-2">
      <div className="menu-container flex">
        {/* Cột bên trái: Danh sách các category */}
        <div className="w-1/4 bg-gray-100 h-screen p-5 hidden md:block">
          <h2 className="text-2xl font-bold mb-6">Danh mục</h2>
          <ul>
            {categories.map((category) => (
              <li
                key={category}
                className={`cursor-pointer py-2 px-4 mb-3 rounded-lg ${
                  selectedCategory === category
                    ? "bg-red-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Cột bên phải: Danh sách các món theo category đã chọn */}
        <div className="w-full lg:w-3/4 p-5 h-screen">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold ">Món {selectedCategory}</h2>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={toggleModal} // Mở modal khi nhấn vào giỏ hàng
            >
              Giỏ hàng ({cart.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {dishes[selectedCategory]?.map((dish, index) => (
              <div
                key={index}
                className="dish-item bg-white p-5 shadow-lg rounded-lg"
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-40 rounded-md mb-3"
                />
                <h3 className="text-xl font-mont-bold">{dish.name}</h3>
                <p className="mt-2 text-gray-700">{dish.price}</p>

                {/* Nút + và - thay vì nút Thêm vào giỏ hàng */}
                <div className="flex items-center mt-2">
                  <button
                    className="bg-gray-300 text-gray-700 rounded p-1"
                    onClick={() => updateQuantity(dish, -1)}
                  >
                    <FaMinus />
                  </button>
                  <span className="mx-2">
                    {cart.find((item) => item.name === dish.name)?.quantity ||
                      0}
                  </span>
                  <button
                    className="bg-gray-300 text-gray-700 rounded p-1"
                    onClick={() => addToCart(dish)}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 w-full max-md:block bg-black/40 py-2 hidden">
          <ul className="flex overflow-x-auto flex-nowrap space-x-4 px-2">
            {categories.map((category) => (
              <li
                key={category}
                className={`cursor-pointer py-2 px-4 rounded-lg whitespace-nowrap font-mont-bold ${
                  selectedCategory === category
                    ? "text-[#F9A746]"
                    : "text-gray-100"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal giỏ hàng */}
      <Bill
        isOpen={isModalOpen}
        onClose={toggleModal}
        cartItems={cart}
        updateQuantity={updateQuantity}
        tableNumber={tableNumber}
        infoGuess={userName}
      />
    </div>
  );
};

export default Order;
