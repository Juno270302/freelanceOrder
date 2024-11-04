import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore"; // Import necessary Firebase modules

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("Thịt heo");
  const [dishes, setDishes] = useState({}); // State to hold dishes data
  const [categories, setCategories] = useState([]); // State to hold categories data

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore(); // Initialize Firestore
      const categoriesSnapshot = await getDocs(collection(db, "categories")); // Replace with your categories collection
      const dishesSnapshot = await getDocs(collection(db, "dishes")); // Replace with your dishes collection

      const fetchedCategories = categoriesSnapshot.docs.map(
        (doc) => doc.data().name
      ); // Adjust based on your data structure
      const fetchedDishes = {};

      dishesSnapshot.forEach((doc) => {
        const dishData = doc.data();
        const category = dishData.category; // Adjust based on your data structure
        if (!fetchedDishes[category]) {
          fetchedDishes[category] = [];
        }
        fetchedDishes[category].push(dishData);
      });

      setCategories(fetchedCategories);
      setDishes(fetchedDishes);
    };

    fetchData();
  }, []);

  return (
    <div className="border-2">
      <div className="menu-container flex">
        {/* Left Column: Category List */}
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

        {/* Right Column: Dishes based on selected category */}
        <div className="w-full lg:w-3/4 p-5 h-screen">
          <h2 className="text-2xl font-bold mb-6">Món {selectedCategory}</h2>
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
                <h3 className="text-xl font-mont-bold text-center">
                  {dish.name}
                </h3>
                <p className="mt-2 text-gray-700 text-center">
                  {dish.price} VND
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="fixed bottom-0 left-0 w-full max-md:block bg-black/40 py-2 hidden">
        <ul className="flex overflow-x-auto flex-nowrap space-x-4 px-2">
          {categories.map((category) => (
            <li
              key={category}
              className={`cursor-pointer py-2 px-4 rounded-lg whitespace-nowrap font-mont-bold text-white${
                selectedCategory === category ? " text-[#F9A746]" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Menu;
