import React from "react";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div className="bg-[#DDDDDD] w-[100vw]">
      {/* Hero Section */}
      <section className="relative text-white py-20">
        <div className="relative">
          <div className="absolute top-[-40px] right-[13.7rem] bg-[#F16B24] w-[100px] h-[100px] rounded-full z-10"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Book Your Next Adventure</h2>
          <p className="text-lg mb-8">
            Find and book Hotels, Flights, Trains, and more all in one place!
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/book"
              className="bg-[#FFFFFF] text-black text-lg font-bold px-6 py-3 rounded-lg shadow-2xl hover:bg-gray-200"
            >
              Get Started
            </Link>

            <button className="bg-[#175094] px-6 py-3 text-lg font-bold rounded-lg shadow-2xl hover:bg-blue-700">
              Learn More
            </button>
          </div>
        </div>
        <img
          className="absolute -top-[0rem] left-0 w-full -z-0"
          src="/hero.svg"
          alt="Hero Curve"
        />
      </section>

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-semibold text-black mb-8">
            Our Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-3xl font-semibold mb-2">Hotels</h4>
              <p className="text-gray-600">
                Find the best deals on hotels worldwide.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-3xl font-semibold mb-2">Flights</h4>
              <p className="text-gray-600">
                Book flights to your favorite destinations.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-3xl font-semibold mb-2">Trains</h4>
              <p className="text-gray-600">
                Plan your train journeys with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16">
        <div className="container mx-auto px-6 text-center mt-4">
          <p className="font-bold text-4xl text-gray-800 mb-6">About Us</p>
          <p className="text-black text-xl max-w-[70rem] mx-auto text-justify leading-10">
            We are a leading global travel distribution platform, dedicated to
            simplifying the travel business for suppliers and buyers alike. Our
            diverse range of suppliers includes hotels, airlines, cruises, car
            rentals, transfers, and rail services. On the buyer side, we cater
            to retail and API buyers, such as travel agencies, independent
            travel advisors, and enterprise clients, including tour operators,
            travel management companies, online travel platforms, super-apps,
            and loyalty programs. As a publicly listed company on the NSE
            (National Stock Exchange of India) and BSE (Bombay Stock Exchange),
            we are committed to a strategic vision and sustainable business
            practices.
          </p>
          <p className="text-black text-xl max-w-[70rem] mx-auto text-justify leading-10">
            Our platform seamlessly connects over 159,000 buyers with more than
            1 million suppliers across 100+ countries, enabling smooth
            transactions and fostering collaboration in the travel ecosystem.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-semibold text-black mb-6">
            Get in Touch
          </h3>
          <form className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 mb-4 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 mb-4 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full p-3 mb-4 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-[#267CE2] text-white text-3xl p-3 rounded-lg hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
      <div className="absolute top-[54rem] -left-24 w-40 h-40 bg-[#267CE2] rounded-full z-10"></div>
      <div className="absolute top-[80rem] -right-24 w-40 h-40 bg-[#F16B24] rounded-full z-10"></div>
    </div>
  );
};

export default Home;
