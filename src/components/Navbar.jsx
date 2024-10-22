import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/manwah.svg";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore
import { auth } from "../firebase"; // Import Firebase auth
import { onAuthStateChanged, signOut } from "firebase/auth"; // Import listener for auth changes

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ismenuPcOpen, setIsmenuPcOpen] = useState(false);
  const [userName, setUserName] = useState(""); // State to store user name
  const [loading, setLoading] = useState(true); // State to manage loading

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMenuPc = () => {
    setIsmenuPcOpen(!ismenuPcOpen);
  };

  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Đăng xuất thành công");
      setIsMenuOpen(false);
      setIsmenuPcOpen(false);
      navigate("/login"); // Chuyển hướng đến trang đăng nhập hoặc trang bạn muốn
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
      // Hiển thị thông báo lỗi cho người dùng nếu cần
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const db = getFirestore();
        const docRef = doc(db, "users", user.uid); // Use user's uid to fetch their document

        getDoc(docRef)
          .then((doc) => {
            if (doc.exists()) {
              setUserName(doc.data().name); // Set user name from Firestore
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

  return (
    <>
      <div className="w-full flex items-center justify-between py-3 px-10 shadow-xl border rounded-b-xl sticky top-0 bg-white z-50">
        <div className="w-[33%]">
          <img src={logo} alt="logo" className="w-[150px]" />
        </div>
        <div className="w-[33%] flex justify-center font-mont-bold text-[20px] space-x-10 max-md:hidden">
          <Link to={"/"}>
            <p className="hover:text-[#F9A746] hover:cursor-pointer">Home</p>
          </Link>
          <Link to={"/menu"}>
            <p className="hover:text-[#F9A746] hover:cursor-pointer">Menu</p>
          </Link>
          <Link to={"/booking"}>
            <p className="hover:text-[#F9A746] hover:cursor-pointer">Booking</p>
          </Link>
        </div>
        <div className="max-md:hidden w-[33%] text-right relative">
          {loading ? (
            <p className="text-[#F9A746] text-[22px] font-mont-bold">
              Loading...
            </p>
          ) : userName ? (
            <button
              onClick={toggleMenuPc}
              className="text-[#F9A746] text-[22px] font-mont-bold"
            >
              Hello, {userName}
            </button>
          ) : (
            <Link to={"/login"}>
              <button className="text-[#F9A746] hover:text-[#F9A746] text-[22px] font-mont-bold hover:cursor-pointer">
                Login
              </button>
            </Link>
          )}
          {ismenuPcOpen ? (
            <div className="absolute right-0 top-16 border px-10 bg-white shadow-xl rounded-xl flex flex-col space-y-3">
              <button
                onClick={handleSignOut}
                className=" text-[22px] hover:text-[#F9A746] font-mont-bold hover:cursor-pointer "
              >
                Logouts
              </button>
              <button
                onClick={handleSignOut}
                className=" text-[22px] hover:text-[#F9A746] font-mont-bold hover:cursor-pointer "
              >
                Logouts
              </button>
              <button
                onClick={handleSignOut}
                className=" text-[22px] hover:text-[#F9A746] font-mont-bold hover:cursor-pointer "
              >
                Logouts
              </button>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="md:hidden">
          {isMenuOpen ? (
            <IoMdClose className="text-[30px]" onClick={toggleMenu} />
          ) : (
            <GiHamburgerMenu className="text-[30px]" onClick={toggleMenu} />
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden w-full flex flex-col items-center py-5 bg-white shadow-md absolute top-16 left-0 z-40">
          {loading ? (
            <p className="text-xl text-[#F9A746] py-2">Loading...</p>
          ) : userName ? (
            <p className="text-xl text-[#F9A746] py-2">Hello, {userName}</p>
          ) : (
            ""
          )}
          <Link
            to={"/"}
            className="text-xl text-gray-700 py-2 hover:text-[#F9A746]"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to={"/menu"}
            className="text-xl text-gray-700 py-2 hover:text-[#F9A746]"
            onClick={toggleMenu}
          >
            Menu
          </Link>
          <Link
            to={"/booking"}
            className="text-xl text-gray-700 py-2 hover:text-[#F9A746]"
            onClick={toggleMenu}
          >
            Booking
          </Link>
          {loading ? (
            <p className="text-xl text-[#F9A746] py-2">Loading...</p>
          ) : userName ? (
            <button
              className="text-xl text-gray-700 py-2 hover:text-[#F9A746] hover:cursor-pointer"
              onClick={handleSignOut}
            >
              Logout
            </button>
          ) : (
            <Link
              to={"/login"}
              className="text-xl text-[#F9A746] py-2"
              onClick={toggleMenu}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
