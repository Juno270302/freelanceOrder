// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBENACN4NGAZzYSDf7iPUUw8s1f56nKtgU",
  authDomain: "order-f3045.firebaseapp.com",
  projectId: "order-f3045",
  storageBucket: "order-f3045.appspot.com",
  messagingSenderId: "939292118850",
  appId: "1:939292118850:web:727f936fc11a360bbbc2db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)

export { auth, db };