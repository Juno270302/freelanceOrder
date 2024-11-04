import React, { useEffect, useState } from "react";
import { db } from "../../firebase"; // Adjust the path as needed
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import MenuDashboard from "../../components/MenuDashboard";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Set the app element for accessibility

const MgCategory = () => {
  const [categories, setCategories] = useState([]);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [currentCategory, setCurrentCategory] = useState({ id: "", name: "" });

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(db, "categories");
      const categorySnapshot = await getDocs(categoriesCollection);
      const categoryList = categorySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoryList);
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "categories", id));
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Error deleting category: ", error);
    }
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setEditModalIsOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "categories", currentCategory.id), {
        name: currentCategory.name,
      });
      setCategories(
        categories.map((category) =>
          category.id === currentCategory.id ? currentCategory : category
        )
      );
      setEditModalIsOpen(false);
    } catch (error) {
      console.error("Error updating category: ", error);
    }
  };

  const handleAdd = async () => {
    if (newCategory.trim() === "") return; // Không thêm nếu tên rỗng
    try {
      const docRef = await addDoc(collection(db, "categories"), {
        name: newCategory,
      });
      setCategories([...categories, { id: docRef.id, name: newCategory }]);
      setNewCategory(""); // Đặt lại giá trị input
      setAddModalIsOpen(false);
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <MenuDashboard />

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8">Category</h1>

        <button
          onClick={() => setAddModalIsOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4 text-right "
        >
          Thêm danh mục
        </button>

        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-2 px-4 border-b">STT</th>
              <th className="py-2 px-4 border-b">Tên Danh Mục</th>
              <th className="py-2 px-4 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id} className="text-center hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{category.name}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Popup Add Category */}
        <Modal
          isOpen={addModalIsOpen}
          onRequestClose={() => setAddModalIsOpen(false)}
          className="modal"
          overlayClassName="overlay"
        >
          <h2 className="text-2xl mb-4">Add Category</h2>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="Category Name"
          />
          <div className="flex justify-between mt-4">
            <button
              onClick={handleAdd}
              className="bg-indigo-600 text-white p-2 rounded"
            >
              Add
            </button>
            <button
              onClick={() => setAddModalIsOpen(false)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </Modal>

        {/* Popup Edit Category */}
        <Modal
          isOpen={editModalIsOpen}
          onRequestClose={() => setEditModalIsOpen(false)}
          className="modal"
          overlayClassName="overlay"
        >
          <h2 className="text-2xl mb-4">Edit Category</h2>
          <input
            type="text"
            value={currentCategory.name}
            onChange={(e) =>
              setCurrentCategory({ ...currentCategory, name: e.target.value })
            }
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="Category Name"
          />
          <div className="flex justify-between mt-4">
            <button
              onClick={handleUpdate}
              className="bg-indigo-600 text-white p-2 rounded"
            >
              Update
            </button>
            <button
              onClick={() => setEditModalIsOpen(false)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default MgCategory;
