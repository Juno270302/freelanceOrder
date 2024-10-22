import React, { useEffect, useState } from 'react';
import { auth } from '../firebase'; // Adjust the path as necessary
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [role, setRole] = useState(null); // State to hold the user's role
  const [loading, setLoading] = useState(true); // State for loading
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setRole(docSnap.data().role); // Set the user's role
        } else {
          console.log("No such document!");
        }
      } else {
        navigate('/'); // Redirect if not logged in
      }
      setLoading(false); // Stop loading
    });

    return () => unsubscribe(); // Cleanup the subscription
  }, [navigate]);

  if (loading) return <div>Đang tải...</div>; // Show loading state

  // Check if the user has admin role
  if (role !== 'admin') {
    return <div>Bạn không có quyền truy cập trang này.</div>; // Access denied message
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Your dashboard content goes here */}
    </div>
  );
};

export default Dashboard;
