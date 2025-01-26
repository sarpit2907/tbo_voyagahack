import React, { useState } from "react";

const Flight = () => {
  const [activeBtn, setActiveBtn] = useState("1");
  const [flights, setFlights] = useState(["arin", "1232"]);
  const [destinations, setDestinations] = useState(["VNS", "BLR"]);
  const [activeDstn, setActiveDstn] = useState("VNS");

  const toggleBtn = (btn) => {
    setActiveBtn(btn);
  };

  const bookTickets = async () => {
    const response = await fetch("http://localhost:3000/api/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ flightId: "1234" }),
    });
    const data = await response.json();
    console.log(data);
  };

  const fetchDestinations = async () => {
    const response = await fetch("http://localhost:3000/api/destinations");
    const data = await response.json();
    setDestinations(data);
  };

  const fetchFlightsByDestination = async (destination) => {
    setActiveDstn(destination);
    setFlights([1, 2]);
  };

  return (
    <div className="min-h-screen min-w-screen bg-[#DDDDDD] flex-col realtive">
      <div className="z-20 absolute w-full mt-32">
        <div className="flex shadow-lg rounded-3xl bg-[#DDDDDD] w-3/5 mx-auto font-bold justify-center">
          <button
            onClick={() => toggleBtn("1")}
            className={`py-2 rounded-3xl ${
              activeBtn === "1"
                ? "bg-red-600 text-white"
                : "bg-[#DDDDDD] text-black"
            } px-4 flex-grow`}
          >
            Flight Combinations
          </button>
          <button
            onClick={() => toggleBtn("2")}
            className={`py-2 rounded-3xl ${
              activeBtn === "2"
                ? "bg-red-600 text-white"
                : "bg-[#DDDDDD] text-black"
            } px-4 flex-grow`}
          >
            Select Manually
          </button>
          <button
            onClick={() => toggleBtn("3")}
            className={`py-2 rounded-3xl ${
              activeBtn === "3"
                ? "bg-red-600 text-white"
                : "bg-[#DDDDDD] text-black"
            } px-4 flex-grow`}
          >
            Nearby Hotels
          </button>
        </div>

        <div className="w-full mt-6">
          {/* Conditionally rendered content based on activeBtn */}
          {activeBtn === "2" && (
            <div className=" w-full flex flex-col items-center">
              <p>Select Your Itinerary</p>
              <p className="text-2xl">Showing Results For</p>

              <div className="flex space-x-5 my-5">
                {destinations.map((destination, index) => (
                  <button
                    key={index}
                    className={`${
                      activeDstn === destination
                        ? "bg-blue-700 text-white"
                        : "bg-white text-black"
                    } rounded-md px-4 py-2 transition-colors duration-200`}
                    onClick={() => fetchFlightsByDestination(destination)}
                  >
                    <p className="text-3xl">
                      {destination}-{destination}
                    </p>
                    <span className="text-s">Tuesday,8/11/2002</span>
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

                {flights.map((flight, index) => (
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
                        onClick={bookTickets()}
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
            <div className=" w-full flex flex-col items-center">
              <p>Select Your Itinerary</p>
              <p className="text-2xl">Showing Results For</p>
            </div>
          )}
          {activeBtn === "3" && (
            <div className=" w-full flex flex-col items-center">
              <p>Select Your Itinerary</p>
              <p className="text-2xl">Showing Results For</p>
            </div>
          )}
        </div>
      </div>
      <img
        className="absolute bottom-[26.8rem] left-0 w-full -z-0"
        src="/hero.svg"
        alt="Hero Curve"
      />
    </div>
  );
};

export default Flight;
