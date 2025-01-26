import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">TravelNow</h1>
          <nav>
            <ul className="flex space-x-6 text-gray-600">
              <li><a href="#services" className="hover:text-blue-600">Services</a></li>
              <li><a href="#about" className="hover:text-blue-600">About</a></li>
              <li><a href="#contact" className="hover:text-blue-600">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Book Your Next Adventure</h2>
          <p className="text-lg mb-8">Find and book hotels, flights, trains, and more all in one place!</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow hover:bg-gray-200">Get Started</button>
            <button className="bg-blue-800 px-6 py-3 rounded-lg shadow hover:bg-blue-700">Learn More</button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Our Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">Hotels</h4>
              <p className="text-gray-600">Find the best deals on hotels worldwide.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">Flights</h4>
              <p className="text-gray-600">Book flights to your favorite destinations.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">Trains</h4>
              <p className="text-gray-600">Plan your train journeys with ease.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">About Us</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            At TravelNow, we aim to make your travel planning seamless and hassle-free. With a wide range of services, we bring you the best deals and ensure a smooth booking experience.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Get in Touch</h3>
          <form className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2025 TravelNow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
