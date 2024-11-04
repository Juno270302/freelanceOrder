import React, { useEffect, useState } from "react";
import MenuDashboard from "../../components/MenuDashboard";
import { db, storage } from "../../firebase.js"; // Đường dẫn đến file cấu hình Firebase
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const MgMenu = () => {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [formData, setFormData] = useState({
    image: "",
    name: "",
    category: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState(null); // State để lưu trữ tệp hình ảnh
  const [addPopupVisible, setAddPopupVisible] = useState(false);
  const [addFormData, setAddFormData] = useState({
    image: "",
    name: "",
    category: "",
    price: "",
  });

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const dishesCollection = collection(db, "dishes");
        const dishSnapshot = await getDocs(dishesCollection);
        const dishList = dishSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDishes(dishList);
      } catch (error) {
        console.error("Error fetching dishes: ", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, "categories");
        const categorySnapshot = await getDocs(categoriesCollection);
        const categoryList = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchDishes();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      const dishDoc = doc(db, "dishes", id);
      await deleteDoc(dishDoc);
      setDishes((prevDishes) => prevDishes.filter((dish) => dish.id !== id));
      alert("Dish deleted successfully!");
    } catch (error) {
      console.error("Error deleting dish: ", error);
    }
  };

  const handleEdit = (dish) => {
    setSelectedDish(dish);
    setFormData({
      image: dish.image,
      name: dish.name,
      category: dish.category,
      price: dish.price,
    });
    setPopupVisible(true);
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
    setSelectedDish(null);
    setImageFile(null); // Reset file image khi đóng popup
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = formData.image; // Mặc định sử dụng URL cũ nếu không có tệp mới

    // Nếu có tệp hình ảnh mới, tải lên Firebase Storage
    if (imageFile) {
      const storageRef = ref(storage, `dishes/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef); // Lấy URL của hình ảnh đã tải lên
    }

    try {
      const dishDoc = doc(db, "dishes", selectedDish.id);
      await updateDoc(dishDoc, { ...formData, image: imageUrl });
      setDishes((prevDishes) =>
        prevDishes.map((dish) =>
          dish.id === selectedDish.id
            ? { ...dish, ...formData, image: imageUrl }
            : dish
        )
      );
      alert("Dish updated successfully!");
      handlePopupClose();
    } catch (error) {
      console.error("Error updating dish: ", error);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = addFormData.image; // Default to old URL if no new file

    // If there's a new image file, upload it to Firebase Storage
    if (imageFile) {
      const storageRef = ref(storage, `dishes/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef); // Get the URL of the uploaded image
    }

    try {
      const dishesCollection = collection(db, "dishes");
      await addDoc(dishesCollection, { ...addFormData, image: imageUrl });
      setDishes((prevDishes) => [
        ...prevDishes,
        { ...addFormData, image: imageUrl },
      ]);
      alert("Dish added successfully!");
      handleAddPopupClose();
    } catch (error) {
      console.error("Error adding dish: ", error);
    }
  };

  const handleAddPopupClose = () => {
    setAddPopupVisible(false);
    setAddFormData({ image: "", name: "", category: "", price: "" });
    setImageFile(null); // Reset image file when closing popup
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <MenuDashboard />

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8">Dashboard</h1>
        <button
          onClick={() => setAddPopupVisible(true)}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Add New Dish
        </button>

        {/* Hiển thị dữ liệu dishes */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-indigo-600 text-white">
              <tr className="text-center">
                <th className="py-2 px-4 border-b">Image</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dishes.map((dish) => (
                <tr key={dish.id} className="hover:bg-gray-100 text-center">
                  <td className="py-2 px-4 border-b flex justify-center">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-16 h-16 object-cover"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">{dish.name}</td>
                  <td className="py-2 px-4 border-b">{dish.category}</td>
                  <td className="py-2 px-4 border-b">{dish.price}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(dish)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dish.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Popup chỉnh sửa */}
        {popupVisible && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-2xl mb-4">Edit Dish</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border rounded w-full py-2 px-3"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border rounded w-full py-2 px-3"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="border rounded w-full py-2 px-3"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Price</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="border rounded w-full py-2 px-3"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handlePopupClose}
                    className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {addPopupVisible && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-2xl mb-4">Add Dish</h2>
              <form onSubmit={handleAddSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAddFileChange}
                    className="border rounded w-full py-2 px-3"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={addFormData.name}
                    onChange={handleAddChange}
                    className="border rounded w-full py-2 px-3"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Category</label>
                  <select
                    name="category"
                    value={addFormData.category}
                    onChange={handleAddChange}
                    className="border rounded w-full py-2 px-3"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Price</label>
                  <input
                    type="text"
                    name="price"
                    value={addFormData.price}
                    onChange={handleAddChange}
                    className="border rounded w-full py-2 px-3"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddPopupClose}
                    className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MgMenu;
