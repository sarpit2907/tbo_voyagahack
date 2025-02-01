import React, { useState, forwardRef } from "react";
import { useDetails } from "./context.js";
import { Link } from "react-router-dom";

import { FaCalendarAlt } from "react-icons/fa";

const Book = () => {
  const {
    source,
    setSource,
    destination,
    setDestination,
    travellers,
    setTravellers,
    date,
    setDate,
  } = useDetails();
  const airportSuggestions = [
    { code: "DEL", city: "New Delhi" },
    { code: "VNS", city: "Varanasi" },
    { code: "BOM", city: "Mumbai" },
    { code: "CCU", city: "Kolkata" },
    { code: "LKO", city: "Lucknow" },
    { code: "BLR", city: "Bengaluru" },
    { code: "MAA", city: "Chennai" },
    { code: "HYD", city: "Hyderabad" },
    { code: "PNQ", city: "Pune" },
    { code: "AMD", city: "Ahmedabad" },
    { code: "GOI", city: "Goa" },
    { code: "PAT", city: "Patna" },
    { code: "JAI", city: "Jaipur" },
    { code: "COK", city: "Kochi" },
    { code: "IXB", city: "Bagdogra" },
    { code: "TRV", city: "Thiruvananthapuram" },
    { code: "IXC", city: "Chandigarh" },
    { code: "BBI", city: "Bhubaneswar" },
    { code: "IDR", city: "Indore" },
    { code: "NAG", city: "Nagpur" },
  ];
  const [activeTab, setActiveTab] = useState("flights");
  const [showTravellerDropdown, setShowTravellerDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  // Each flight object now has: { from: "", to: "", date: null, fromText: "", toText: "" }
  const [flights, setFlights] = useState([{ from: "", to: "", date: null, fromText: "", toText: "" }]);

  // Unused local states from your original code (kept here so we don't remove anything):
  const [city, setCity] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  // Helper to filter suggestions:
  const getFilteredSuggestions = (typed) => {
    if (!typed) return [];
    const lower = typed.toLowerCase();
    return airportSuggestions.filter(
      (item) =>
        item.city.toLowerCase().includes(lower) ||
        item.code.toLowerCase().includes(lower)
    );
  };

  // This function updates flights[] & source/destination in context:
  const handleFlightChange = (index, field, value) => {
    const updatedFlights = [...flights];
    updatedFlights[index][field] = value;
    setFlights(updatedFlights);

    // If the user changed the "from" field, update source array:
    if (field === "from") {
      const updatedSource = [...source];
      updatedSource[index] = value;
      setSource(updatedSource);
    }

    // If the user changed the "to" field, update destination array:
    if (field === "to") {
      const updatedDestination = [...destination];
      updatedDestination[index] = value;
      setDestination(updatedDestination);
    }

    // If the user changed the "date" field, update the date array in context:
    if (field === "date") {
      const updatedDate = [...date];
      updatedDate[index] = value;
      setDate(updatedDate);
    }
  };
  // Add flight row:
  const addFlight = () => {
    // Grab 'to' from the last flight so the next flight's "from" can default to that
    const lastTo = flights[flights.length - 1]?.to || "";
    const lastToText = flights[flights.length - 1]?.toText || "";

    setFlights([
      ...flights,
      {
        from: lastTo,
        fromText: lastToText,
        to: "",
        toText: "",
        date: null,
      },
    ]);

    // Keep source/destination arrays in sync
    setSource([...source, lastTo]);
    setDestination([...destination, ""]);
  };
  // New: Remove flight row
  const removeFlight = (index) => {
    const updatedFlights = flights.filter((_, i) => i !== index);
    setFlights(updatedFlights);

    // Also remove corresponding entries in source and destination
    const updatedSource = source.filter((_, i) => i !== index);
    const updatedDestination = destination.filter((_, i) => i !== index);
    setSource(updatedSource);
    setDestination(updatedDestination);

    // Also remove corresponding entry in date array
    const updatedDate = date.filter((_, i) => i !== index);
    setDate(updatedDate);
  };

  // Increment travellers:
  const incrementTraveller = (type) => {
    setTravellers({ ...travellers, [type]: travellers[type] + 1 });
  };

  // Decrement travellers:
  const decrementTraveller = (type) => {
    if (travellers[type] > 0) {
      setTravellers({ ...travellers, [type]: travellers[type] - 1 });
    }
  };

  // Travel class selection:
  const selectClass = (selectedClass) => {
    setTravellers({
      ...travellers,
      Class: selectedClass,
    });
    setShowClassDropdown(false);
  };

  const CustomCalendarIcon = forwardRef(({ onClick }, ref) => (
    <FaCalendarAlt
      onClick={onClick}
      ref={ref}
      style={{ fontSize: "1.2rem" }}
      className="text-gray-500 cursor-pointer hover:text-gray-700"
    />
  ));

  return (
    <div className="h-[100vh] bg-[#DDDDDD] flex flex-col items-center justify-between">
      {/* Header, Tabs, etc. */}
      <div className="flex justify-center items-center bg-[#267CE2] text-white py-6 w-full z-10">
        {["flights", "trains", "buses"].map((tab) => (
          <div
            key={tab}
            className={`flex flex-col items-center mx-20 cursor-pointer ${
              activeTab === tab ? "border-b-4 border-orange-500" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            <img src={`/${tab}.svg`} alt={tab} className="w-12 h-auto mb-2" />
            <span className="capitalize font-bold">{tab}</span>
          </div>
        ))}
      </div>

      {/* Main white container */}
      <div className="bg-white shadow-lg absolute top-[12rem] rounded-custom-40 px-8 pt-8 w-3/4 pl-20 pr-20 z-50 mb-20">
        {flights.map((flight, index) => {
          const { fromText, toText } = flight;

          // Filter suggestions for "from"
          const fromFiltered = getFilteredSuggestions(fromText);
          // Filter suggestions for "to"
          const toFiltered = getFilteredSuggestions(toText);

          return (
            <div key={index} className="flex flex-col mb-4 border-b pb-4">
              {/* FROM */}
              <div className="relative w-full mb-2">
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-black font-bold">
                  From
                </label>
                <input
                  type="text"
                  placeholder="Type city or code"
                  // FIX: show typed text from "fromText" 
                  value={flight.fromText || ""}
                  onChange={(e) =>
                    handleFlightChange(index, "fromText", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Calendar Icon (for date) on the right */}
                <div className="absolute right-3 top-3 cursor-pointer">
                  <input
                    type="date"
                    value={flight.date || ""}
                    onChange={(e) =>
                      handleFlightChange(index, "date", e.target.value)
                    }
                  />
                </div>

                {/* FROM suggestions dropdown */}
                {fromFiltered.length > 0 && fromText && (
                  <div className="absolute bg-white border border-gray-300 mt-1 rounded-md shadow-lg w-full z-10">
                    {fromFiltered.map((item) => (
                      <div
                        key={item.code}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          // Store the code in flight.from
                          handleFlightChange(index, "from", item.code);
                          // Show "City (CODE)" in fromText
                          handleFlightChange(
                            index,
                            "fromText",
                            `${item.city} (${item.code})`
                          );
                        }}
                      >
                        {item.city} ({item.code})
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* TO */}
              <div className="relative w-full mt-2">
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-black font-bold">
                  To
                </label>
                <input
                  type="text"
                  placeholder="Type city or code"
                  // FIX: show typed text from "toText"
                  value={flight.toText || ""}
                  onChange={(e) =>
                    handleFlightChange(index, "toText", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* TO suggestions dropdown */}
                {toFiltered.length > 0 && toText && (
                  <div className="absolute bg-white border border-gray-300 mt-1 rounded-md shadow-lg w-full z-10">
                    {toFiltered.map((item) => (
                      <div
                        key={item.code}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          // Store code in flight.to
                          handleFlightChange(index, "to", item.code);
                          // Show "City (CODE)" in toText
                          handleFlightChange(
                            index,
                            "toText",
                            `${item.city} (${item.code})`
                          );
                        }}
                      >
                        {item.city} ({item.code})
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Remove Flight Button */}
              <div className="mt-4 flex justify-end">
                {/* You asked NOT to remove any other button, only to ADD this. */}
                <button
                  className="text-red-500 hover:text-red-700 font-bold"
                  onClick={() => removeFlight(index)}
                >
                  Remove Flight
                </button>
              </div>
            </div>
          );
        })}

        {/* Button to add another flight */}
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

        {/* Travellers Dropdown */}
        <div className="flex justify-between mb-4">
          <div className="relative flex-1 mr-2">
            <label className="absolute -top-2 left-2 bg-white px-1 text-sm font-semibold text-gray-700">
              Travellers
            </label>
            <button
              className="w-full flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setShowTravellerDropdown(!showTravellerDropdown)}
            >
              <span className="font-bold">
                {travellers.adults} Adult{travellers.adults > 1 ? "s" : ""}
                {travellers.children > 0
                  ? `, ${travellers.children} Child${
                      travellers.children > 1 ? "ren" : ""
                    }`
                  : ""}
                {travellers.infants > 0
                  ? `, ${travellers.infants} Infant${
                      travellers.infants > 1 ? "s" : ""
                    }`
                  : ""}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.707a1 1 0 011.414 0L10 11.414l3.293-3.707a1 1 0 
                    111.414 1.414l-4 4a1 1 0 
                    01-1.414 0l-4-4a1 1 0 010-1.414z"
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
                      <span className="px-4 text-sm font-bold">
                        {travellers.adults}
                      </span>
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
                      <span className="px-4 text-lg font-bold">
                        {travellers.children}
                      </span>
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
                      <span className="px-4 text-lg font-bold">
                        {travellers.infants}
                      </span>
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

          {/* Travel Class Dropdown */}
          <div className="relative flex-1 ml-2">
            <label className="absolute -top-2 left-2 bg-white px-1 text-sm font-semibold text-gray-700">
              Travel Class
            </label>
            <button
              className="w-full flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setShowClassDropdown(!showClassDropdown)}
            >
              <span className="font-bold">{travellers.Class}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.707a1 1 0 011.414 0L10 11.414l3.293-3.707a1 1 0 
                    111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {showClassDropdown && (
              <div className="absolute bg-white border border-gray-300 rounded-md mt-2 shadow-lg w-full z-10">
                {["Economy", "Premium Economy", "Business", "First Class"].map(
                  (cls) => (
                    <div
                      key={cls}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectClass(cls)}
                    >
                      {cls}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center items-center">
          <Link
            to="/flight"
            className="w-1/4 bg-blue-600 text-white py-3 shadow-md hover:bg-blue-700 focus:outline-none rounded-3xl relative -bottom-6 flex justify-center items-center"
          >
            Search Flights
          </Link>
        </div>

        <div className="absolute top-[28rem] -left-[17rem] w-40 h-40 bg-blue-500 rounded-full z-10"></div>
      </div>

      {/* Floating orange circle */}
      <div className="absolute top-[128px] right-[13.7rem] bg-[#F16B24] w-[100px] h-[100px] rounded-full z-10"></div>

      {/* Hero Curve */}
      <img
        className="absolute bottom-[26.8rem] left-0 w-full -z-0"
        src="/hero.svg"
        alt="Hero Curve"
      />
    </div>
  );
};

export default Book;