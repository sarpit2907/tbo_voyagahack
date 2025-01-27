import React, { useState, useEffect } from "react";
import { useDetails } from "./context";
import axios from "axios";
const Flight = () => {
  const [activeTab, setActiveTab] = useState("flights");
  const { travellers, source, destination, date } = useDetails();
  const [activeBtn, setActiveBtn] = useState("1");
  const [availableFlights, setAvailableFlights] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(new Date(date[0]).toISOString().split("T")[0] + "T00:00:00");
  
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
  
  const fetchFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/api/searchFlights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
          body: JSON.stringify({
            EndUserIp: "192.168.10.10",
            TokenId: "22fbe3ce-177e-47f3-bcd4-7ff047ef1cf9",
            AdultCount: travellers.adults,
            ChildCount: travellers.children,
            InfantCount: travellers.infants,
            DirectFlight: "false",
            OneStopFlight: "false",
            JourneyType: "1",
            PreferredAirlines: null,
            Segments: [
              {
                Origin: source[0], // Example: BOM
                Destination: destination[0], // Example: VNS
                FlightCabinClass: "1",
                PreferredDepartureTime: new Date(date[0]).toISOString().split("T")[0] + "T00:00:00", // Example:  `${date[0]}T00:00:00`
                PreferredArrivalTime: null,
              },
            ],
            Sources: null,
          }),
        }
      );
     
      const data = await response.json();
      // console.log(data);
      
      if (data.Response.Results && data.Response.Results.length > 0) {
        setAvailableFlights(data.Response.Results[0]);
      } else {
        setAvailableFlights([]);
        setError("No flights found for the selected criteria.");
      }
    } catch (err) {
      setError("Error fetching flights. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // console.log(availableFlights[0].Segments?.[0]?.[0]?.Origin?.Airport?.AirportCode);
  console.log(availableFlights);
  
  useEffect(() => {
    fetchFlights(); // Fetch flights on component mount or when source/destination changes
  }, [source, destination, date]);


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
  
  return (
    <div className="min-h-screen min-w-screen bg-[#DDDDDD] flex flex-col relative pb-4">
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
  {loading ? (
    <p className="text-xl">Loading flights...</p>
  ) : error ? (
    <p className="text-xl text-red-600">{error}</p>
  ) : (
    availableFlights.map((flight, index) => (
      <div
        key={index}
        className="flex items-center justify-between bg-white shadow-md rounded-md p-4 w-3/4"
      >
        {/* Airline Logo and Name */}
        <div className="flex flex-col items-center justify-center max-w-25 min-w-20">
          <div className="w-10 h-10">
            <img
              src={`https://www.gstatic.com/flights/airline_logos/70px/${
                flight.Segments[0][0].Airline.AirlineCode || "default"
              }.png`}
              alt={`${
                flight.Segments[0][0].Airline.AirlineName || "Airline"
              } Logo`}
              className="w-full h-full object-contain"
              onError={(e) => (e.target.src = "/path-to-default-logo.png")}
            />
          </div>
          <div>
            <p className="font-bold text-lg">{flight.Segments[0][0].Airline.AirlineName}</p>
          </div>
        </div>

        {/* Departure Details */}
        <div className="text-center">
          <p className="font-bold text-xl">
            {flight.Segments[0][0].Origin.Airport.AirportCode}{" "}
            {new Date(flight.Segments[0][0].Origin.DepTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-gray-600">{flight.Segments[0][0].Origin.Airport.CityName}, India</p>
        </div>

        {/* Duration and Stops */}
        <div className="text-center">
          <p className="font-bold text-xl">
            {Math.floor(
              flight.Segments[0].reduce((total, seg) => total + seg.Duration, 0) / 60
            )}h{" "}
            {flight.Segments[0].reduce((total, seg) => total + seg.Duration, 0) % 60}m
          </p>
          <p className="text-gray-600">
            {flight.Segments[0].length === 1
              ? "Non-stop"
              : `${flight.Segments[0].length - 1} stop${
                  flight.Segments[0].length > 2 ? "s" : ""
                } (${flight.Segments[0]
                  .slice(1)
                  .map((seg) => seg.Origin.Airport.AirportCode)
                  .join(", ")})`}
          </p>
          <button className="text-blue-500 underline">View flight details</button>
        </div>

        {/* Arrival Details */}
        <div className="text-center">
          <p className="font-bold text-xl">
            {flight.Segments[0][flight.Segments[0].length - 1].Destination.Airport.AirportCode}{" "}
            {new Date(
              flight.Segments[0][flight.Segments[0].length - 1].Destination.ArrTime
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-gray-600">
            {
              flight.Segments[0][flight.Segments[0].length - 1].Destination.Airport.CityName
            }
            , India
          </p>
        </div>

        {/* Price and Add to Trip */}
        <div className="text-center">
          <p className="font-bold text-2xl text-black">
            ₹{flight.Fare.PublishedFare.toLocaleString()}
          </p>
          <button
            onClick={() => bookTickets(flight.ResultIndex)}
            className="bg-orange-500 text-white rounded-md px-4 py-2 mt-2"
          >
            ADD TO TRIP
          </button>
        </div>
      </div>
    ))
  )}
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
