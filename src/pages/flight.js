import React, { useState } from "react";
import { useDetails } from "./context";

const Flight = () => {
  const [activeTab, setActiveTab] = useState("flights");
  const { travellers, source, destination, date } = useDetails();
  const [activeBtn, setActiveBtn] = useState("1");
  const [availableFlights, setAvailableFlights] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const filterSections = [
    {
      title: "Popular Filters",
      items: [
        { label: "Daily Steal Deal", value: "dailyStealDeal" },
        { label: "Early Bird Deal", value: "earlyBirdDeal" },
        { label: "Last Minute Deal", value: "lastMinuteDeal" },
        { label: "Couple Friendly", value: "coupleFriendly" },
        { label: "Free Cancellation", value: "freeCancellation" },
        { label: "Free Breakfast", value: "freeBreakfast" },
        { label: "Pay at Hotel", value: "payAtHotel" },
      ],
    },
    {
      title: "Price",
      items: [
        { label: "₹0 - ₹1500", value: "0-1500" },
        { label: "₹1500 - ₹3500", value: "1500-3500" },
        { label: "₹3500 - ₹7500", value: "3500-7500" },
        { label: "₹7500 - ₹11500", value: "7500-11500" },
        { label: "₹11500 - ₹15000", value: "11500-15000" },
        { label: "₹15000+", value: "15000plus" },
      ],
    },
    {
      title: "Star Rating",
      items: [
        { label: "3 Star", value: "3star" },
        { label: "4 Star", value: "4star" },
        { label: "5 Star", value: "5star" },
      ],
    },
    {
      title: "User Rating",
      items: [
        { label: "3+", value: "rating3" },
        { label: "3.5+", value: "rating3_5" },
        { label: "4+", value: "rating4" },
        { label: "4.5+", value: "rating4_5" },
      ],
    },
    {
      title: "Room Views",
      items: [
        { label: "Garden View", value: "gardenView" },
        { label: "City View", value: "cityView" },
      ],
    },
    {
      title: "House Rules",
      items: [
        { label: "Smoking Allowed", value: "smokingAllowed" },
        { label: "Unmarried Couples Allowed", value: "unmarriedCouples" },
        { label: "Alcohol Allowed", value: "alcoholAllowed" },
        { label: "Pets Allowed", value: "petsAllowed" },
      ],
    },
    {
      title: "Food & Dining",
      items: [
        { label: "Breakfast Included", value: "breakfastIncluded" },
        { label: "Dinner Included", value: "dinnerIncluded" },
        { label: "All meals available", value: "allMealsAvailable" },
      ],
    },
  ];
  const [expandedSections, setExpandedSections] = useState(() => {
    const expanded = {};
    filterSections.forEach((sec) => {
      expanded[sec.title] = true;
    });
    return expanded;
  });

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const toggleFilter = (value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
  };

  const flights = [];
  for (let i = 0; i < source.length; i++) {
    flights.push({ from: source[i], to: destination[i], date:date[i] });
  }
  const [activeDstn, setActiveDstn] = useState(flights[0]?.to || "");
  const [activeSort, setActiveSort] = useState("Most Popular");

  const toggleBtn = (btn) => {
    setActiveBtn(btn);
  };

  const bookTickets = async () => {
    const response = await fetch("http://localhost:3000/api/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ flightId: "1234", travellers }),
    });
    const data = await response.json();
    console.log(data);
  };

  const fetchFlightsByDestination = async (destination) => {
    setActiveDstn(destination);
    const response = await fetch("http://localhost:3000/api/flights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ destination }),
    });
    const data = await response.json();
    if (data) setAvailableFlights(data);
  };
  console.log(flights);
  
  return (
    <div className="min-h-screen min-w-screen bg-[#DDDDDD] flex flex-col relative">
      <div className="relative w-full">
        <div className="relative bg-[#267CE2] w-full h-32 mb-8">
          <div className="absolute left-3/4 top-16 bg-orange-500 w-32 h-16 rounded-t-full"></div>
          <div className="flex justify-center items-center  text-white py-6 w-full z-10">
            {["flights", "trains", "buses"].map((tab) => (
              <div
                key={tab}
                className={`flex flex-col items-center mx-20 cursor-pointer ${
                  activeTab === tab ? "border-b-4 border-orange-500" : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <img
                  src={`/${tab}.svg`}
                  alt={tab}
                  className="w-12 h-auto mb-2"
                />
                <span className="capitalize font-bold">{tab}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex shadow-lg rounded-3xl bg-[#DDDDDD] w-3/5 mx-auto font-bold justify-center">
          <button
            onClick={() => toggleBtn("1")}
            className={`py-2 rounded-3xl ${
              activeBtn === "1"
                ? "bg-red-600 text-white"
                : "bg-[#DDDDDD] text-black"
            } px-4 flex-grow transition-colors duration-500`}
          >
            Flight Combinations
          </button>
          <button
            onClick={() => toggleBtn("2")}
            className={`py-2 rounded-3xl ${
              activeBtn === "2"
                ? "bg-red-600 text-white"
                : "bg-[#DDDDDD] text-black"
            } px-4 flex-grow transition-colors duration-500`}
          >
            Select Manually
          </button>
          <button
            onClick={() => toggleBtn("3")}
            className={`py-2 rounded-3xl ${
              activeBtn === "3"
                ? "bg-red-600 text-white"
                : "bg-[#DDDDDD] text-black"
            } px-4 flex-grow transition-colors duration-500`}
          >
            Nearby Hotels
          </button>
        </div>

        <div className="w-full mt-6">
          {activeBtn === "2" && (
            <div className="w-full flex flex-col items-center">
              <p>Select Your Itinerary</p>
              <p className="text-2xl">Showing Results For</p>

              <div className="flex space-x-5 my-5">
                {flights.map((flight, index) => (
                  <button
                    key={index}
                    className={`${
                      activeDstn === flight.to
                        ? "bg-blue-700 text-white"
                        : "bg-white text-black"
                    } rounded-md px-4 py-2 transition-colors duration-200`}
                    onClick={() => {
                      fetchFlightsByDestination(flight.to);
                    }}
                  >
                    <p className="text-3xl">
                      {flight.from}-{flight.to}
                    </p>
                    <span className="text-s"> {flight.date ? flight.date.toLocaleDateString() : ""}</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-col mt-4 w-full space-y-4 justify-center items-center">
                <div className="w-3/4 bg-white flex items-center justify-between pr-10 font-bold rounded-md py-1">
                  <p></p>
                  <p>Destination</p>
                  <p>Duration</p>
                  <p>Arrival</p>
                  <p>Price</p>
                </div>
                {availableFlights.map((flight, index) => (
                  <div
                    key={index}
                    className="w-3/4 bg-white flex items-center justify-between font-bold rounded-md pr-10"
                  >
                    <div className="w-12 h-12 mr-4">
                      <img
                        src="https://www.airindia.in/img/AirIndia-Logo.svg"
                        alt="Air India Logo"
                        className="w-full h-full object-contain"
                      ></img>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="font-bold text-lg mr-2">VNS</span>
                        <span className="text-gray-600 text-sm">13:35</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Varanasi,India
                      </div>
                    </div>
                    <div className="mx-4">
                      <span className="font-medium">2h 35m</span>
                      <span className="text-gray-600 text-xs">Nonstop</span>
                    </div>
                    <div>
                      <div className="flex items-center justify-end">
                        <span className="font-bold text-lg mr-2">BLR</span>
                        <span className="text-gray-600 text-sm">16:10</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Bengaluru,India
                      </div>
                    </div>
                    <div className="flex flex-col ml-6">
                      <span className="text-xl font-bold">₹22,224</span>
                      <button
                        className="bg-red-600 text-white rounded-md h-8 px-2 py-1"
                        onClick={bookTickets}
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeBtn === "1" && (
            <div className="w-full flex flex-col items-center">
              <p>Select Your Itinerary</p>
              <p className="text-2xl">Showing Results For</p>
            </div>
          )}
          {activeBtn === "3" && (
            <div className="w-full flex flex-col items-center">
              <p>Select Your Itinerary</p>
              <p className="text-2xl">Showing Results For</p>

              <div className="flex space-x-5 my-5">
                {flights.map((flight, index) => (
                  <button
                    key={index}
                    className={`${
                      activeDstn === flight.to
                        ? "bg-blue-700 text-white"
                        : "bg-white text-black"
                    } rounded-md px-4 py-2 transition-colors duration-200`}
                    onClick={() => {
                      fetchFlightsByDestination(flight.to);
                    }}
                  >
                    <p className="text-3xl">
                      {flight.from}-{flight.to}
                    </p>
                    <span className="text-s">{flight.date ? flight.date.toLocaleDateString() : ""}</span>
                  </button>
                ))}
              </div>

              <div className="flex w-3/5 items-center justify-evenly space-x-2">
                <div>
                  <label htmlFor="city" className="block">
                    CITY
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={activeDstn}
                    disabled={true}
                    className="bg-white rounded-md mt-1 px-2 text-lg"
                  />
                </div>
                <div>
                  <label htmlFor="fromDate" className="block">
                    CHECKIN
                  </label>
                  <input
                    type="date"
                    id="fromDate"
                    className="bg-white rounded-md mt-1 px-2 text-lg"
                  />
                </div>
                <div>
                  <label htmlFor="toDate" className="block">
                    CHECKOUT
                  </label>
                  <input
                    type="date"
                    id="toDate"
                    className="bg-white rounded-md mt-1 px-2 text-lg"
                  />
                </div>
                <div>
                  <label htmlFor="fromInput" className="block">
                    Guests and Rooms
                  </label>
                  <input
                    type="text"
                    id="fromInput"
                    value={activeDstn}
                    disabled={true}
                    className="bg-white rounded-md mt-1 px-2 text-lg"
                  />
                </div>
              </div>

              <div className="flex w-full bg-white mt-5 h-10 items-center justify-center space-x-4">
                <div className="text-lg font-bold">Sort By :</div>
                <button
                  className={`${
                    activeSort === "Most Popular"
                      ? "bg-red-600 text-white"
                      : "bg-white text-black"
                  } rounded-md px-4 py-2 transition-colors duration-200`}
                  onClick={() => setActiveSort("Most Popular")}
                >
                  Most Popular
                </button>
                <button
                  className={`${
                    activeSort === "Price: Low to High"
                      ? "bg-red-600 text-white"
                      : "bg-white text-black"
                  } rounded-md px-4 py-2 transition-colors duration-200`}
                  onClick={() => setActiveSort("Price: Low to High")}
                >
                  Price: Low to High
                </button>
                <button
                  className={`${
                    activeSort === "Price: High to Low"
                      ? "bg-red-600 text-white"
                      : "bg-white text-black"
                  } rounded-md px-4 py-2 transition-colors duration-200`}
                  onClick={() => setActiveSort("Price: High to Low")}
                >
                  Price: High to Low
                </button>
                <button
                  className={`${
                    activeSort === "Reviews: Highest First"
                      ? "bg-red-600 text-white"
                      : "bg-white text-black"
                  } rounded-md px-4 py-2 transition-colors duration-200`}
                  onClick={() => setActiveSort("Reviews: Highest First")}
                >
                  Reviews: Highest First
                </button>
              </div>

              <div className="flex w-3/4 h-auto mt-5 space-x-5 mb-5">
                <div className="w-1/5 bg-white rounded-lg pl-3 font-semibold text-gray-700">
                  <div className="flex justify-between items-center p-3 border-b border-gray-200">
                    <span className="text-lg">FILTERS</span>
                    <button
                      className="bg-red-600 text-white text-sm rounded-md px-2 py-1"
                      onClick={clearAllFilters}
                    >
                      CLEAR
                    </button>
                  </div>
                  <div className="p-2 space-y-3 text-sm font-normal">
                    {filterSections.map((section) => (
                      <div key={section.title}>
                        <div
                          onClick={() => toggleSection(section.title)}
                          className="flex justify-between items-center cursor-pointer font-semibold"
                        >
                          <span>{section.title}</span>
                          <span className="text-xl">
                            {expandedSections[section.title] ? "▼" : "▶"}
                          </span>
                        </div>

                        {expandedSections[section.title] && (
                          <div className="mt-2 ml-2 space-y-1">
                            {section.items.map((item) => (
                              <label
                                key={item.value}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedFilters[item.value] || false}
                                  onChange={() => toggleFilter(item.value)}
                                />
                                <span>{item.label}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col space-y-4 w-4/5 pb-8">
                  {/* Hotel Card #1 */}
                  <div className="flex flex-row w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                    <img
                      className="w-2/5 object-cover px-3 py-3 rounded-sm"
                      src="https://images.pexels.com/photos/5650026/pexels-photo-5650026.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                      alt="Hotel"
                    />
                    <div className="p-4">
                      <div className="flex flex-row justify-between items-center">
                        <span className="bg-yellow-400 text-white text-xs px-2 py-1 rounded">
                          5 ★ Hotel
                        </span>
                        <span className="text-gray-600 text-sm">
                          80 Ratings |{" "}
                          <span className="text-green-500 font-bold">
                            4.6/5
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-row justify-between space-x-4">
                        <div className="w-4/5">
                          <h2 className="mt-2 text-xl font-semibold text-gray-800">
                            The Leela Bhartiya City Bengaluru
                          </h2>
                          <p className="text-sm text-gray-500">Tirumanahalli</p>
                          <ul className="mt-2 text-sm text-gray-600 space-y-1">
                            <li className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Free cancellation
                            </li>
                            <li className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Breakfast Included
                            </li>
                            <li className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              10% off on spa session
                            </li>
                          </ul>
                        </div>
                        <div className="flex flex-col justify-between items-center mt-2">
                          <div>
                            <span className="text-2xl font-bold text-gray-800">
                              ₹9,995
                            </span>
                            <p className="text-xs text-gray-500">
                              + ₹3,040 taxes & fees per night
                            </p>
                          </div>
                          <div className="w-full flex flex-col space-y-2 mt-9 justify-start">
                            <button className="text-blue-600 text-sm font-medium border-2 border-blue-600 px-2 py-1 rounded">
                              View Plans
                            </button>
                            <button className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-medium">
                              Add to Trip
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                    <img
                      className="w-2/5 object-cover px-3 py-3 rounded-sm"
                      src="https://images.pexels.com/photos/5650026/pexels-photo-5650026.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                      alt="Hotel"
                    />
                    <div className="p-4">
                      <div className="flex flex-row justify-between items-center">
                        <span className="bg-yellow-400 text-white text-xs px-2 py-1 rounded">
                          5 ★ Hotel
                        </span>
                        <span className="text-gray-600 text-sm">
                          80 Ratings |{" "}
                          <span className="text-green-500 font-bold">
                            4.6/5
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-row justify-between space-x-4">
                        <div className="w-4/5">
                          <h2 className="mt-2 text-xl font-semibold text-gray-800">
                            The Leela Bhartiya City Bengaluru
                          </h2>
                          <p className="text-sm text-gray-500">Tirumanahalli</p>
                          <ul className="mt-2 text-sm text-gray-600 space-y-1">
                            <li className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Free cancellation
                            </li>
                            <li className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Breakfast Included
                            </li>
                            <li className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              10% off on spa session
                            </li>
                          </ul>
                        </div>
                        <div className="flex flex-col justify-between items-center mt-2">
                          <div>
                            <span className="text-2xl font-bold text-gray-800">
                              ₹10,000
                            </span>
                            <p className="text-xs text-gray-500">
                              + ₹3,040 taxes & fees per night
                            </p>
                          </div>
                          <div className="w-full flex flex-col space-y-2 mt-9 justify-start">
                            <button className="text-blue-600 text-sm font-medium border-2 border-blue-600 px-2 py-1 rounded">
                              View Plans
                            </button>
                            <button className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-medium">
                              Add to Trip
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                    <img
                      className="w-2/5 object-cover px-3 py-3 rounded-sm"
                      src="https://images.pexels.com/photos/5650026/pexels-photo-5650026.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                      alt="Hotel"
                    />
                    <div className="p-4">
                      <div className="flex flex-row justify-between items-center">
                        <span className="bg-yellow-400 text-white text-xs px-2 py-1 rounded">
                          5 ★ Hotel
                        </span>
                        <span className="text-gray-600 text-sm">
                          80 Ratings |{" "}
                          <span className="text-green-500 font-bold">
                            4.6/5
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-row justify-between space-x-4">
                        <div className="w-4/5">
                          <h2 className="mt-2 text-xl font-semibold text-gray-800">
                            The Leela Bhartiya City Bengaluru
                          </h2>
                          <p className="text-sm text-gray-500">Tirumanahalli</p>
                          <ul className="mt-2 text-sm text-gray-600 space-y-1">
                            <li className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Free cancellation
                            </li>
                            <li className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Breakfast Included
                            </li>
                            <li className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              10% off on spa session
                            </li>
                          </ul>
                        </div>
                        <div className="flex flex-col justify-between items-center mt-2">
                          <div>
                            <span className="text-2xl font-bold text-gray-800">
                              ₹9,995
                            </span>
                            <p className="text-xs text-gray-500">
                              + ₹3,040 taxes & fees per night
                            </p>
                          </div>
                          <div className="w-full flex flex-col space-y-2 mt-9 justify-start">
                            <button className="text-blue-600 text-sm font-medium border-2 border-blue-600 px-2 py-1 rounded">
                              View Plans
                            </button>
                            <button className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-medium">
                              Add to Trip
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3) Position this absolutely at bottom, behind everything (z-0). */}
      {/* <img
        className="absolute top-0 left-0 w-full z-0"
        src="/hero.svg"
        alt="Hero Curve"
      /> */}
    </div>
  );
};
export default Flight;
