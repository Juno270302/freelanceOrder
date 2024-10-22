import { getFirestore, doc, getDoc } from "firebase/firestore";

export const getUser = async (userId) => {
  const db = getFirestore();
  const docRef = doc(db, "users", userId); // Thay 'users' bằng tên collection của bạn
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data(); // Trả về dữ liệu người dùng
  } else {
    console.log("No such document!");
    return null; // Hoặc có thể trả về một đối tượng người dùng mặc định
  }
};

