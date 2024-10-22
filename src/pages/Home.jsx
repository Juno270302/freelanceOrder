import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      {/* Banner */}
      <section
        className="banner w-full h-screen flex items-center justify-center bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/images/restaurant-banner.jpg')` }}
      >
        <div className="text-center px-4 md:px-8 lg:px-16 xl:px-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-black">
            Welcome to Our Restaurant
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-black">
            Delicious food, made with love
          </p>
          <Link to={"/menu"}>
            <button className="mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg">
              Explore Menu
            </button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="about py-10 sm:py-20 px-6 md:px-10 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            About Us
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Our restaurant is known for its delicious dishes and welcoming
            atmosphere. We offer a variety of meals that are prepared with fresh
            ingredients and a lot of love.
          </p>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="featured-menu py-10 sm:py-20 px-6 md:px-10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">
            Our Signature{" "}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dish 1 */}
            <div className="dish bg-white shadow-lg rounded-lg p-6">
              <img
                src="https://brand-pcms.ggg.systems/media/catalog/product/cache/fccf9bc1c56510f6f2e84ded9c30a375/t/h/thi_t_heo.jpg"
                alt="Dish 1"
                className="w-full h-48  rounded-md mb-4"
              />
              <h3 className="text-2xl font-bold">Thịt Heo</h3>
              <p className="text-lg text-gray-700 mt-2">
                Perfectly grilled to your liking with a side of roasted
                vegetables.
              </p>
            </div>

            {/* Dish 2 */}
            <div className="dish bg-white shadow-lg rounded-lg p-6">
              <img
                src="https://brand-pcms.ggg.systems/media/catalog/product/cache/fccf9bc1c56510f6f2e84ded9c30a375/t/u/tuyet-lien-hoa.jpg"
                alt="Dish 2"
                className="w-full h-48  rounded-md mb-4"
              />
              <h3 className="text-2xl font-bold">Thịt Bòa</h3>
              <p className="text-lg text-gray-700 mt-2">
                A combination of fresh seafood served with a variety of sauces.
              </p>
            </div>

            {/* Dish 3 */}
            <div className="dish bg-white shadow-lg rounded-lg p-6">
              <img
                src="https://brand-pcms.ggg.systems/media/catalog/product/cache/fccf9bc1c56510f6f2e84ded9c30a375/s/_/s_i_p.png"
                alt="Dish 3"
                className="w-full h-48  rounded-md mb-4"
              />
              <h3 className="text-2xl font-bold">Hải Sản</h3>
              <p className="text-lg text-gray-700 mt-2">
                Fresh pasta tossed with seasonal vegetables and a light sauce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="booking py-10 sm:py-20 px-6 md:px-10 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Book a Table
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8">
            Make a reservation online and secure your spot at our restaurant.
          </p>
          <Link to={"/booking"}>
            <button className="px-4 sm:px-6 py-2 sm:py-3 bg-[#F9A746] hover:[#F9A746]/50 text-white rounded-lg">
              Make a Reservation
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
