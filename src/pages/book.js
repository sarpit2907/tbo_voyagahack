import React, { useState } from "react";

const Book = () => {
const [travellers, setTravellers] = useState({ adults: 1, children: 0, infants: 0 });
  const [travelClass, setTravelClass] = useState("Economy");
  const [showTravellerDropdown, setShowTravellerDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [flights, setFlights] = useState([{ from: "", to: "" }]);
  const incrementTraveller = (type) => {
    setTravellers({ ...travellers, [type]: travellers[type] + 1 });
  };

  const decrementTraveller = (type) => {
    if (travellers[type] > 0) {
      setTravellers({ ...travellers, [type]: travellers[type] - 1 });
    }
  };

  const selectClass = (selectedClass) => {
    setTravelClass(selectedClass);
    setShowClassDropdown(false);
  };

  const addFlight = () => {
    setFlights([...flights, { from: "", to: "" }]);
  };

  const updateTravelerCount = (type, operation) => {
    setTravellers((prev) => ({
      ...prev,
      [type]:
        operation === "increment"
          ? prev[type] + 1
          : Math.max(0, prev[type] - 1),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center ">
      {/* Header */}
      <header className="w-full text-white py-6 flex items-center justify-between px-6">
        <img src="/logo.svg" alt="Logo" className="h-10 w-auto pl-10" />
        <img src="/account.svg" alt="Account" className="h-10 w-auto pr-10" />
      </header>

      {/* Search Form */}
      <div className="bg-white shadow-2xl rounded-custom-40 p-8 mt-8 w-3/4 pl-20 pr-20">
        {flights.map((flight, index) => (
          <div key={index} className="flex flex-col justify-between mb-4">
            <div className="relative w-full">
              <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-black text-bold">
                From
              </label>
              <input
                type="text"
                placeholder="Enter origin city"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative w-full mt-2">
              <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-black text-bold">
                To
              </label>
              <input
                type="text"
                placeholder="Enter destination city"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}

        <div className="flex justify-center w-full mt-4 mb-4">
          <button
            className="flex items-center justify-center space-x-2 border border-gray-400 rounded-full py-2 px-4 text-gray-600 hover:bg-gray-100"
            onClick={addFlight}
          >
            <span className="flex items-center justify-center py-2 w-6 h-6 border border-gray-400 rounded-full">
              +
            </span>
            <span>Add another Flight</span>
          </button>
        </div>

        <div className="flex justify-between mb-4">
          <div className="relative flex-1 mr-2">
            <label className="block text-sm font-semibold text-gray-700">Travellers</label>
            <button
              className="w-full flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setShowTravellerDropdown(!showTravellerDropdown)}
            >
              <span className="font-bold">{travellers.adults > 0 ? `${travellers.adults} Adult${travellers.adults > 1 ? "s" : ""}` : ""}
              {travellers.children > 0 ? `, ${travellers.children} Child${travellers.children > 1 ? "ren" : ""}` : ""}
              {travellers.infants > 0 ? `, ${travellers.infants} Infant${travellers.infants > 1 ? "s" : ""}` : ""}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.707a1 1 0 011.414 0L10 11.414l3.293-3.707a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {showTravellerDropdown && (
              <div className="absolute bg-white border border-gray-300 rounded-md mt-2 shadow-lg w-full z-10 p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="font-bold text-sm">Adults</span>
                    <p className="text-sm text-gray-500">(12+ years)</p>
                    <div className="flex items-center justify-center mt-2">
                      <button
                        className="border border-gray-300 px-1 py-1 ml-1"
                        onClick={() => decrementTraveller("adults")}
                      >
                        -
                      </button>
                      <span className="px-4 text-sm font-bold">{travellers.adults}</span>
                      <button
                        className="border border-gray-300 px-1 py-1 mr-1"
                        onClick={() => incrementTraveller("adults")}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-sm">Children</span>
                    <p className="text-sm text-gray-500">(2-12 years)</p>
                    <div className="flex items-center justify-center mt-2 ">
                      <button
                        className="border border-gray-300 px-1 py-1 ml-1"
                        onClick={() => decrementTraveller("children")}
                      >
                        -
                      </button>
                      <span className="px-4 text-lg font-bold">{travellers.children}</span>
                      <button
                        className="border border-gray-300 px-1 py-1 mr-1"
                        onClick={() => incrementTraveller("children")}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-sm">Infants</span>
                    <p className="text-sm text-gray-500">(Below 2 years)</p>
                    <div className="flex items-center justify-center mt-2">
                      <button
                        className="border border-gray-300 px-1 py-1 ml-1"
                        onClick={() => decrementTraveller("infants")}
                      >
                        -
                      </button>
                      <span className="px-4 text-lg font-bold">{travellers.infants}</span>
                      <button
                        className="border border-gray-300 px-1 py-1 mr-1"
                        onClick={() => incrementTraveller("infants")}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative flex-1 ml-2">
            <label className="block text-sm font-semibold text-gray-700">Travel Class</label>
            <button
              className="w-full flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setShowClassDropdown(!showClassDropdown)}
            >
              <span className="font-bold">{travelClass}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.707a1 1 0 011.414 0L10 11.414l3.293-3.707a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {showClassDropdown && (
              <div className="absolute bg-white border border-gray-300 rounded-md mt-2 shadow-lg w-full z-10">
                {["Economy", "Premium Economy", "Business", "First Class"].map((cls) => (
                  <div
                    key={cls}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectClass(cls)}
                  >
                    {cls}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none"
        >
          Search Flights
        </button>
      </div>
    </div>
  );
};

export default Book;
