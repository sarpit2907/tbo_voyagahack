import React, { useState, useEffect } from "react";
import { useDetails } from "./context.js";
import axios from "axios";
const Flight = () => {
  const [activeTab, setActiveTab] = useState("flights");
  const {
    travellers,
    source,
    destination,
    date,
    cost,
    setCost,
    prompt,
    setPrompt,
    result,
    setResult,
    setIsChatOpen,
  } = useDetails();
  console.log("result:", result);

  // const getResult = async (query) => {
  //   try {
  //     const response = await fetch("https://tbo-voyagahack-server.vercel.app/api/ai", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         prompt: query || prompt || "No Prompt",
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log("AI Response:", data.message.parts[0].text);
  //     setResult(data.message.parts[0].text);
  //     console.log(result);

  //   } catch (error) {
  //     console.error("Error fetching AI response:", error);
  //   }
  // };
  const [activeBtn, setActiveBtn] = useState("1");
  const [availableFlights, setAvailableFlights] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [flightCombinations, setFlightCombinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sightseeingOptions, setSightseeingOptions] = useState([]);
  const [HotelOptions, setHotelOptions] = useState([]);
  const airportToCityMap = {
    BOM: "Mumbai",
    DEL: "Delhi",
    CCU: "Kolkata",
    LKO: "Lucknow",
    BLR: "Bengaluru",
    MAA: "Chennai",
    HYD: "Hyderabad",
    PNQ: "Pune",
    AMD: "Ahmedabad",
    GOI: "Goa",
    PAT: "Patna",
    JAI: "Jaipur",
    COK: "Kochi",
    IXB: "Bagdogra",
    TRV: "Thiruvananthapuram",
    IXC: "Chandigarh",
    BBI: "Bhubaneswar",
    IDR: "Indore",
    NAG: "Nagpur",
    VNS: "Varanasi",
  };

  // console.log(new Date(date[0]).toISOString().split("T")[0] + "T00:00:00");
  console.log(`${date[0]}T00:00:00`);

  const increaseCost = (amount) => {
    let initialCost = cost;
    initialCost += amount;
    setCost(Math.ceil(initialCost));
  };

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
  const [legResults, setLegResults] = useState([]);
  const [combinedResults, setCombinedResults] = useState([]);

  // 1) FETCH each leg individually
  const fetchAllLegs = async () => {
    try {
      setLoading(true);
      setError(null);

      const responses = await Promise.all(
        flights.map(async (leg) => {
          const response = await fetch(
            "https://tbo-voyagahack-server.vercel.app/api/searchFlights",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                EndUserIp: "192.168.10.10",
                TokenId: "40e62f3a-8a2f-4282-8db9-f06811833be8",
                AdultCount: travellers.adults,
                ChildCount: travellers.children,
                InfantCount: travellers.infants,
                DirectFlight: "false",
                OneStopFlight: "false",
                JourneyType: "1", // single-journey search
                PreferredAirlines: null,
                Segments: [
                  {
                    Origin: leg.from,
                    Destination: leg.to,
                    FlightCabinClass: "1",
                    PreferredDepartureTime: `${leg.date}T00:00:00`,
                    PreferredArrivalTime: null,
                  },
                ],
                Sources: null,
              }),
            }
          );
          return response.json();
        })
      );

      // 'responses' is an array of 4 results, one for each leg
      // We only care about the flight array, often located at responses[i].Response.Results[0]
      // ...
      const allLegs = responses.map((res) => {
        // Get the array of flights for this particular leg
        const flightsForLeg = res?.Response?.Results?.[0] || [];

        // Limit to the first 20 flights
        return flightsForLeg.slice(0, 5);
      });
      setLegResults(allLegs);
      // ...
    } catch (err) {
      setError("Error fetching flights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // For instance, fetch all legs once you have your "activeBtn === 1"
    if (activeBtn === "1") {
      fetchAllLegs();
    }
  }, [activeBtn]);
  // 'listsOfFlights' would be something like
  // [ [flights for leg1], [flights for leg2], [flights for leg3], [flights for leg4] ]
  function cartesianProduct(listsOfFlights) {
    // If there’s no array or only 1 leg, return as-is
    if (!listsOfFlights || listsOfFlights.length === 0) return [];
    if (listsOfFlights.length === 1) {
      return listsOfFlights[0].map((flight) => [flight]);
    }

    return listsOfFlights.reduce(
      (acc, currentArray) => {
        const temp = [];
        acc.forEach((previousCombo) => {
          currentArray.forEach((flight) => {
            temp.push([...previousCombo, flight]);
          });
        });
        return temp;
      },
      [[]]
    );
  }
  useEffect(() => {
    if (
      legResults.length === flights.length &&
      legResults.every((arr) => arr.length > 0)
    ) {
      // Combine all legs
      const combos = cartesianProduct(legResults).map((combo) => {
        // combo is an array of flights, one from each leg
        const totalFare = combo.reduce((sum, flight) => {
          return sum + (flight.Fare?.PublishedFare || 0);
        }, 0);

        return {
          flights: combo, // array of flights
          totalFare,
        };
      });

      // Sort combos by totalFare ascending
      combos.sort((a, b) => a.totalFare - b.totalFare);

      setCombinedResults(combos);
    }
  }, [legResults]);

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
    flights.push({ from: source[i], to: destination[i], date: date[i] });
  }
  const [activeDstn, setActiveDstn] = useState(flights[0]?.to || "");
  const [activeSort, setActiveSort] = useState("Most Popular");

  const toggleBtn = (btn) => {
    setActiveBtn(btn);
  };

  const toggleDestination = (index) => {
    fetchFlights(index);
  };
  const toggleHotelDestination = (index) => {
    fetchHotels(destination[index],index);
  };
  const togglesightdestin = (index) => {
    fetchSights(destination[index], index);
  };
  const fetchFlightCombinations = async () => {
    setLoading(true);
    setError(null);
    try {
      // Single POST request with multiple segments
      const response = await fetch("https://tbo-voyagahack-server.vercel.app/api/searchFlights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          EndUserIp: "192.168.10.10",
          TokenId: "40e62f3a-8a2f-4282-8db9-f06811833be8",
          AdultCount: travellers.adults,
          ChildCount: travellers.children,
          InfantCount: travellers.infants,
          DirectFlight: "false",
          OneStopFlight: "false",
          // IMPORTANT: For multiple segments (multi-city), set JourneyType to "3"
          JourneyType: "3",
          PreferredAirlines: null,
          Segments: flights.map((flight) => ({
            Origin: flight.from,
            Destination: flight.to,
            FlightCabinClass: "1",
            PreferredDepartureTime: `${flight.date}T00:00:00`,
            PreferredArrivalTime: null,
          })),
          Sources: null,
        }),
      });

      const jsonData = await response.json();

      // You’ll typically get one set of "combined itineraries" for multi-city.
      // Each returned "itinerary" should contain multiple segments corresponding
      // to VNS->BLR, BLR->DEL, etc.

      // Adjust this according to how the API actually returns results
      const possibleItineraries = jsonData?.Response?.Results[0] || [];

      setFlightCombinations(possibleItineraries);
    } catch (err) {
      console.error(err);
      setError("Error fetching flight combinations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeBtn === "1") {
      fetchFlightCombinations();
    }
  }, [source, destination, date, activeBtn]);
  const fetchFlights = async (index = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://tbo-voyagahack-server.vercel.app/api/searchFlights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          EndUserIp: "192.168.10.10",
          TokenId: "40e62f3a-8a2f-4282-8db9-f06811833be8",
          AdultCount: travellers.adults,
          ChildCount: travellers.children,
          InfantCount: travellers.infants,
          DirectFlight: "false",
          OneStopFlight: "false",
          JourneyType: "1",
          PreferredAirlines: null,
          Segments: [
            {
              Origin: source[index],
              Destination: destination[index],
              FlightCabinClass: "1",
              PreferredDepartureTime: `${date[index]}T00:00:00`, // Example:  `${date[0]}T00:00:00`
              PreferredArrivalTime: null,
            },
          ],
          Sources: null,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.Response.Results && data.Response.Results.length > 0) {
        setAvailableFlights(data.Response.Results[0]);
      } else {
        setAvailableFlights([]);
        setError("No flights found for the selected criteria.");
      }
    } catch (err) {
      console.log("Error fetching flights. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchCityId = async (cityName) => {
    try {
        const response = await fetch(
            "https://tbo-voyagahack-server.vercel.app/api/citySearch",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    EndUserIp: "192.168.10.26",
                    TokenId: "40e62f3a-8a2f-4282-8db9-f06811833be8",
                    CountryCode: "IN",
                    SearchType: "1",
                    CityName: cityName,  // ✅ Added CityName to request
                }),
            }
        );

        const data = await response.json();
        if (data?.Destinations?.length > 0) {
            const foundCity = data.Destinations.find(
                (c) => c.CityName.toLowerCase() === cityName.toLowerCase()
            );
            return foundCity ? foundCity.DestinationId : null;
        }
        console.error("City search response invalid:", data);
        return null;
    } catch (error) {
        console.error("Error fetching CityId:", error);
        return null;
    }
};

// Fetch hotel codes (only first 10)
const fetchHotelCodes = async (cityID) => {
    try {
        const response = await fetch("https://tbo-voyagahack-server.vercel.app/api/hotelcodeSearch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + btoa("hackathontest:Hac@98910186")
            },
            body: JSON.stringify({
                CityCode: cityID,
                IsDetailedResponse: "true",
            }),
        });

        const data = await response.json();
        if (data?.hotelCodes?.length > 0) {
            return data.hotelCodes.slice(0, 200);  // ✅ Return only first 10 hotel codes
        }
        console.error("No hotel codes found:", data);
        return null;
    } catch (error) {
        console.error("Error fetching HotelCodes:", error);
        return null;
    }
};

// Fetch hotel details (one at a time)
const fetchHotelDetails = async (hotelCodes) => {
  try {
      if (!hotelCodes || hotelCodes.length === 0) {
          throw new Error("Hotel codes are required");
      }

      // Fetch details one by one (API only accepts one hotel at a time)
      const hotelDetailsPromises = hotelCodes.map(async (code) => {
          const response = await fetch("https://tbo-voyagahack-server.vercel.app/api/HotelDetails", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Basic " + btoa("hackathontest:Hac@98910186"),
              },
              body: JSON.stringify({
                  Hotelcodes: code,  // ✅ API requires a single hotel code at a time
                  Language: "EN",
              }),
          });

          const data = await response.json();
          if (data.hotelDetails) {
              return data.hotelDetails;
          } else {
              console.error(`Failed to fetch details for Hotel ${code}:`, data);
              return null;
          }
      });

      const hotelDetails = await Promise.all(hotelDetailsPromises);
      return hotelDetails.filter((hotel) => hotel !== null);  // ✅ Remove null values
  } catch (error) {
      console.error("Error fetching hotel details:", error);
      return [];
  }
};

const fetchHotels = async (airportCode, index = 0) => {
  setLoading(true);
  setError(null);
  console.log("Fetching CityId for:", airportCode);

  try {
      const cityName = airportToCityMap[airportCode.toUpperCase()];
      if (!cityName) {
          console.error(`No city mapped for airport code: ${airportCode}`);
          setError(`No city found for airport code: ${airportCode}`);
          setLoading(false);
          return;
      }

      const cityId = await fetchCityId(cityName);
      if (!cityId) {
          console.error(`CityId not found for ${cityName}`);
          setError(`CityId not found for ${cityName}`);
          setLoading(false);
          return;
      }
      console.log(`City ID for ${cityName}: ${cityId}`);

      const hotelCodesList = await fetchHotelCodes(cityId);
      if (!hotelCodesList || hotelCodesList.length === 0) {
          console.error(`No hotel codes found for cityId: ${cityId}`);
          setError(`No hotels found in ${cityName}`);
          setLoading(false);
          return;
      }

      console.log(`Fetching hotel details for codes: ${hotelCodesList.join(", ")}`);
      const hotelDetails = await fetchHotelDetails(hotelCodesList);
      if (!hotelDetails || hotelDetails.length === 0) {
          console.error(`Failed to fetch details for hotels in ${cityName}`);
          setError(`Failed to retrieve hotel details.`);
          setLoading(false);
          return;
      }

      console.log("Hotel Details Retrieved:", hotelDetails);

      const checkInDate = new Date(date[index]); 
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(checkOutDate.getDate() + 1);

      console.log(`Fetching availability for hotels on ${checkInDate.toISOString().split("T")[0]}`);

      const response = await fetch("https://tbo-voyagahack-server.vercel.app/api/searchHotels", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": "Basic " + btoa("hackathontest:Hac@98910186")
          },
          body: JSON.stringify({
              CheckIn: checkInDate.toISOString().split("T")[0],
              CheckOut: checkOutDate.toISOString().split("T")[0],
              HotelCodes: hotelCodesList, // ✅ Send as an array
              GuestNationality: "IN",
              PaxRooms: [
                  {
                      Adults: travellers.adults,
                      Children: travellers.children,
                      ChildrenAges: []
                  }
              ],
              ResponseTime: 23.0,
              IsDetailedResponse: false,
              Filters: {
                  Refundable: false,
                  NoOfRooms: 1,
                  MealType: "All"
              }
          })
      });

      const data = await response.json();
      console.log("Hotel Availability API Response:", data);

      if (data.Status?.Code !== 200) {
          console.error(`Hotel API Error: ${data.Status.Description}`);
          setError(`Hotel API Error: ${data.Status.Description}`);
          setHotelOptions([]);
          return;
      }

      // ✅ Merging Hotel Details with Availability
      const hotelsWithCompleteData = hotelDetails.map((hotel) => {
          const availability = data.HotelResult.find((avail) => avail.HotelCode === hotel.HotelCode);
          return {
              ...hotel,
              Rooms: availability ? availability.Rooms : [],  // ✅ Merge available rooms
              Currency: availability ? availability.Currency : "USD",
          };
      });

      console.log("Final Hotels with Details and Availability:", hotelsWithCompleteData);
      setHotelOptions([...hotelsWithCompleteData]); 
      console.log(HotelOptions);
      

  } catch (err) {
      console.error("Error fetching hotel details:", err);
      setError("An error occurred while fetching hotel data. Please try again.");
  } finally {
      setLoading(false);
  }
};

  const fetchSights = async (airportCode, index = 0) => {
    setLoading(true);
    setError(null);
    console.log("Fetching CityId for:", airportCode);

    try {
      const cityName = airportToCityMap[airportCode.toUpperCase()];
      const cityId = await fetchCityId(cityName);

      if (!cityId) {
        setError(`CityId not found for ${cityName}`);
        setLoading(false);
        return;
      }

      console.log(`Fetched CityId: ${cityId} for ${cityName}`);

      const response = await fetch(
        "https://tbo-voyagahack-server.vercel.app/api/searchSights",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CityId: cityId,
            CountryCode: "IN", // Assuming all cities are in India
            FromDate: `${date[index]}T00:00:00`,
            ToDate: `${date[index]}T00:00:00`,
            AdultCount: travellers.adults,
            ChildCount: travellers.children,
            ChildAge: null,
            PreferredLanguage: 0,
            PreferredCurrency: "INR",
            IsBaseCurrencyRequired: false,
            EndUserIp: "192.168.5.56",
            TokenId: "40e62f3a-8a2f-4282-8db9-f06811833be8",
            KeyWord: "",
          }),
        }
      );

      const data = await response.json();
      console.log("Sightseeing API Response:", data);

      if (data.Response?.SightseeingSearchResults?.length > 0) {
        setSightseeingOptions([...data.Response.SightseeingSearchResults]);
      } else {
        setSightseeingOptions([]);
        setError("No sightseeing options found for the selected criteria.");
      }
    } catch (err) {
      console.error("Error fetching sightseeing options:", err);
      setError("Error fetching sights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // console.log(availableFlights[0].Segments?.[0]?.[0]?.Origin?.Airport?.AirportCode);
  console.log(sightseeingOptions);

  useEffect(() => {
    fetchFlights();
  }, [source, destination, date]);

  const bookTickets = async () => {
    //   const response = await fetch("http://localhost:3000/api/book", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ flightId: "1234", travellers }),
    //   });
    //   const data = await response.json();
    //   console.log(data);
  };

  const fetchFlightsByDestination = async (destination) => {
    setActiveDstn(destination);
    // const response = await fetch("http://localhost:3000/api/flights", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ destination }),
    // });
    // const data = await response.json();
    // if (data) setAvailableFlights(data);
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
          <button
            onClick={() => toggleBtn("4")}
            className={`py-2 rounded-3xl ${
              activeBtn === "4"
                ? "bg-red-600 text-white"
                : "bg-[#DDDDDD] text-black"
            } px-4 flex-grow transition-colors duration-500`}
          >
            Sightseeing
          </button>
        </div>

        <div className="w-full mt-6">
          {activeBtn === "1" && (
            <div className="w-full flex flex-col items-center">
              <p>Select Your Itinerary</p>
              <p className="text-2xl">Showing Results For</p>
              <div className="flex space-x-5 my-5">
                {flights.map((flight, index) => (
                  <button
                    key={index}
                    className={`${"bg-blue-700 text-white"} rounded-md px-4 py-2 transition-colors duration-200`}
                  >
                    <p className="text-3xl">
                      {flight.from}-{flight.to}
                    </p>
                    <span className="text-s"> {flight.date}</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-col mt-4 w-full space-y-4 justify-center items-center">
                {/* Table Header */}
                <div className="flex items-center justify-center bg-white text-black font-bold text-lg p-4 w-3/4 rounded-t-md pl-60">
                  <div className="pl-20 w-1/3 text-center">Departure</div>
                  <div className="pl-12 w-1/3 text-center">Duration</div>
                  <div className="pl-4 w-1/3 text-center">Arrival</div>
                </div>

                {/* Loading & Error Handling */}
                {loading ? (
                  <p className="text-xl">Loading flights...</p>
                ) : error ? (
                  <p className="text-xl text-red-600">{error}</p>
                ) : (
                  combinedResults.map((combo, comboIndex) => {
                    const { flights, totalFare } = combo;

                    return (
                      <div
                        key={comboIndex}
                        className="flex flex-col bg-white shadow-md rounded-md p-4 w-3/4 mb-4"
                      >
                        {/* Loop through each leg of this multi-journey flight */}
                        {flights.map((flight, flightIdx) => {
                          const leg = flight.Segments[0];
                          const airline = leg[0].Airline;
                          const departureSegment = leg[0];
                          const arrivalSegment = leg[leg.length - 1];

                          // Calculate duration
                          const totalMinutes = leg.reduce(
                            (sum, seg) => sum + seg.Duration,
                            0
                          );
                          const hours = Math.floor(totalMinutes / 60);
                          const minutes = totalMinutes % 60;
                          const stopsCount = leg.length - 1;

                          // Helper function to format time
                          const formatTime = (dateString) =>
                            new Date(dateString).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            });

                          return (
                            <div
                              key={flightIdx}
                              className={`flex items-center justify-between py-4 ${
                                flightIdx < flights.length - 1 ? "border-b" : ""
                              }`}
                            >
                              {/* Airline Logo + Name */}
                              <div className="flex flex-col items-center justify-center w-1/4">
                                <div className="w-10 h-10">
                                  <img
                                    src={`https://www.gstatic.com/flights/airline_logos/70px/${
                                      airline.AirlineCode || "default"
                                    }.png`}
                                    alt={airline.AirlineName || "Airline Logo"}
                                    className="w-full h-full object-contain"
                                    onError={(e) =>
                                      (e.target.src =
                                        "/path-to-default-logo.png")
                                    }
                                  />
                                </div>
                                <p className="font-bold text-lg">
                                  {airline.AirlineName}
                                </p>
                              </div>

                              {/* Departure */}
                              <div className="w-1/4 text-center">
                                <p className="font-bold text-xl">
                                  {departureSegment.Origin.Airport.AirportCode}{" "}
                                  {formatTime(departureSegment.Origin.DepTime)}
                                </p>
                                <p className="text-gray-600">
                                  {departureSegment.Origin.Airport.CityName},
                                  India
                                </p>
                              </div>

                              {/* Duration & Stops */}
                              <div className="w-1/4 text-center">
                                <p className="font-bold text-xl">
                                  {hours}h {minutes}m
                                </p>
                                <p className="text-gray-600">
                                  {stopsCount === 0
                                    ? "Non-stop"
                                    : `${stopsCount} stop${
                                        stopsCount > 1 ? "s" : ""
                                      } 
                                               (${leg
                                                 .slice(1)
                                                 .map(
                                                   (seg) =>
                                                     seg.Origin.Airport
                                                       .AirportCode
                                                 )
                                                 .join(", ")})`}
                                </p>
                              </div>

                              {/* Arrival */}
                              <div className="w-1/4 text-center">
                                <p className="font-bold text-xl">
                                  {
                                    arrivalSegment.Destination.Airport
                                      .AirportCode
                                  }{" "}
                                  {formatTime(
                                    arrivalSegment.Destination.ArrTime
                                  )}
                                </p>
                                <p className="text-gray-600">
                                  {arrivalSegment.Destination.Airport.CityName},
                                  India
                                </p>
                              </div>
                            </div>
                          );
                        })}

                        {/* Display Price and "Add to Trip" Button Only Once */}
                        <div className="flex items-center justify-end mt-4">
                          <button className="text-blue-600 text-lg mr-44">
                            View Flight details
                          </button>
                          <span className="font-bold text-3xl text-black">
                            ₹{totalFare.toLocaleString()}
                          </span>
                          <button
                            onClick={() => {
                              increaseCost(totalFare);
                              console.log(
                                "Booking these flights together:",
                                flights
                              );
                            }}
                            className="bg-orange-500 text-white rounded-md px-4 py-2 ml-6"
                          >
                            ADD TO TRIP
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

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
                      toggleDestination(index);
                    }}
                  >
                    <p className="text-3xl">
                      {flight.from}-{flight.to}
                    </p>
                    <span className="text-s"> {flight.date}</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-col mt-4 w-full space-y-4 justify-center items-center">
                <div className="flex items-center justify-center bg-white text-black font-bold text-lg p-4 w-3/4 rounded-t-md">
                  <div className=" pl-56 w-1/4 text-center">Departure</div>
                  <div className="pl-52 w-1/4 text-center">Duration</div>
                  <div className="pl-44 w-1/4 text-center">Arrival</div>
                  <div className="pl-36 w-1/4 text-center text-blue-600">
                    Price
                  </div>
                </div>
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
                              flight.Segments[0][0].Airline.AirlineCode ||
                              "default"
                            }.png`}
                            alt={`${
                              flight.Segments[0][0].Airline.AirlineName ||
                              "Airline"
                            } Logo`}
                            className="w-full h-full object-contain"
                            onError={(e) =>
                              (e.target.src = "/path-to-default-logo.png")
                            }
                          />
                        </div>
                        <div>
                          <p className="font-bold text-lg">
                            {flight.Segments[0][0].Airline.AirlineName}
                          </p>
                        </div>
                      </div>

                      {/* Departure Details */}
                      <div className="text-center">
                        <p className="font-bold text-xl">
                          {flight.Segments[0][0].Origin.Airport.AirportCode}{" "}
                          {new Date(
                            flight.Segments[0][0].Origin.DepTime
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-gray-600">
                          {flight.Segments[0][0].Origin.Airport.CityName}, India
                        </p>
                      </div>

                      {/* Duration and Stops */}
                      <div className="text-center">
                        <p className="font-bold text-xl">
                          {Math.floor(
                            flight.Segments[0].reduce(
                              (total, seg) => total + seg.Duration,
                              0
                            ) / 60
                          )}
                          h{" "}
                          {flight.Segments[0].reduce(
                            (total, seg) => total + seg.Duration,
                            0
                          ) % 60}
                          m
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
                        <button className="text-blue-600 pt-4 ">
                          View flight details
                        </button>
                      </div>

                      {/* Arrival Details */}
                      <div className="text-center">
                        <p className="font-bold text-xl">
                          {
                            flight.Segments[0][flight.Segments[0].length - 1]
                              .Destination.Airport.AirportCode
                          }{" "}
                          {new Date(
                            flight.Segments[0][
                              flight.Segments[0].length - 1
                            ].Destination.ArrTime
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-gray-600">
                          {
                            flight.Segments[0][flight.Segments[0].length - 1]
                              .Destination.Airport.CityName
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
                          onClick={() => {
                            increaseCost(flight.Fare.PublishedFare);
                            bookTickets(flight.ResultIndex);
                          }}
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
          {activeBtn === "3" && (
  <div className="w-full flex flex-col items-center">
    <p>Select Your Itinerary</p>
    <p className="text-2xl">Showing Results For</p>

    {/* Flight Buttons */}
    <div className="flex space-x-5 my-5">
      {flights.map((flight, index) => (
        <button
          key={index}
          className={`${
            activeDstn === flight.to ? "bg-blue-700 text-white" : "bg-white text-black"
          } rounded-md px-4 py-2 transition-colors duration-200`}
          onClick={() => {
            fetchFlightsByDestination(flight.to);
            toggleHotelDestination(index);
          }}
        >
          <p className="text-3xl">{flight.from}-{flight.to}</p>
          <span className="text-sm">{flight.date}</span>
        </button>
      ))}
    </div>

    {/* Sort Options */}
    <div className="flex w-full bg-white mt-5 h-10 items-center justify-center space-x-4">
      <div className="text-lg font-bold">Sort By :</div>
      {["Most Popular", "Price: Low to High", "Price: High to Low", "Reviews: Highest First"].map((sortOption) => (
        <button
          key={sortOption}
          className={`${
            activeSort === sortOption ? "bg-red-600 text-white" : "bg-white text-black"
          } rounded-md px-4 py-2 transition-colors duration-200`}
          onClick={() => setActiveSort(sortOption)}
        >
          {sortOption}
        </button>
      ))}
    </div>

    {/* Filter Section */}
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
                            {expandedSections[section.title] ? "▼" : "▶️"}
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

      {/* Hotel List */}
      <div className="flex flex-col space-y-4 w-4/5 pb-8">
  {loading ? (
    <p>Loading hotels...</p>
  ) : error ? (
    <p className="text-red-500">{error}</p>
  ) : (
    HotelOptions
      .filter((hotel) => hotel.Images?.length > 0 && hotel.Rooms?.length > 0) // ✅ Filters hotels with images & rooms
      .map((hotel, index) => (
        <div key={index} className="flex flex-row w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 p-4">
          {/* Left: Hotel Image */}
          <div className="w-2/5 relative">
            <img
              className="object-cover w-full h-full rounded-md"
              src={hotel.Images?.[3] || "https://plus.unsplash.com/premium_photo-1661923725782-f73c990fbddf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bHV4dXJ5JTIwaG90ZWx8ZW58MHx8MHx8fDA%3D"}
              alt={hotel.HotelName || "Hotel Image"}
            />
            <button className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-1 rounded-md text-sm">
              View All Photos
            </button>
          </div>

          {/* Right: Hotel Details */}
          <div className="w-3/5 p-4 flex flex-col justify-between">
            {/* Top: Hotel Rating & Name */}
            <div className="flex justify-between items-center">
              <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-md flex items-center">
                {hotel.HotelRating || "N/A"} ★ Hotel
              </span>
              <div className="text-sm text-gray-500 flex items-center">
                <span>{hotel.Reviews || "N/A"} Ratings | </span>
                <span className="ml-1 bg-green-600 text-white px-2 py-0.5 rounded-md text-xs font-bold">
                  {hotel.Rating || "N/A"}/5
                </span>
              </div>
            </div>

            {/* Hotel Name & Address */}
            <h2 className="mt-2 text-xl font-semibold text-gray-800">
              {hotel.HotelName}
            </h2>
            <p className="text-sm text-blue-600 cursor-pointer">{hotel.Address || "Location not available"}</p>

            {/* Features & Hotel Amenities */}
            <ul className="mt-2 text-sm text-gray-600 space-y-1">
              {/* Hotel Facilities (Dynamic Amenities) */}
              {hotel.HotelFacilities?.slice(0, 3).map((facility, idx) => (
                <li key={idx} className="flex items-center">✔ {facility}</li>
              )) || <li className="flex items-center text-gray-400">No amenities available</li>}
            </ul>

            {/* Price & Buttons */}
            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  ₹{hotel.Rooms?.[0]?.TotalFare || "N/A"}
                </p>
                <p className="text-xs text-gray-500">
                  + ₹{hotel.Rooms?.[0]?.TotalTax || "N/A"} taxes & fees per night
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <button className="border border-blue-600 text-blue-600 px-3 py-1 rounded-md text-sm font-medium">
                  View Plans
                </button>
                <button className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm font-medium" onClick={() => {
                                    increaseCost(hotel.Rooms?.[0]?.TotalFare + hotel.Rooms?.[0]?.TotalTax);
                                  }}>
                  ADD TO TRIP
                </button>
              </div>
            </div>
          </div>
        </div>
      ))
  )}
</div>

    </div>
  </div>
)}

          {activeBtn === "4" && (
            <div className="w-full flex flex-col items-center">
              {/* Header */}
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
                      togglesightdestin(index);
                      fetchFlightsByDestination(flight.to);
                    }}
                  >
                    <p className="text-3xl">
                      {flight.from}-{flight.to}
                    </p>
                    <span className="text-sm">{flight.date}</span>
                  </button>
                ))}
              </div>

              {/* Sorting Options */}
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

              {/* Main Layout */}
              <div className="flex w-3/4 h-auto mt-5 space-x-5 mb-5">
                {/* Sidebar Filters */}
                <div className="w-1/5 h-[138vh] bg-white rounded-lg pl-3 pr-4 font-semibold text-gray-700">
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
                            {expandedSections[section.title] ? "▼" : "▶️"}
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

                {/* Sightseeing Cards */}
                <div className="flex flex-wrap justify-center gap-6 w-4/5 pb-8">
  {loading ? (
    <p>Loading sightseeing options...</p>
  ) : error ? (
    <p className="text-red-500">{error}</p>
  ) : sightseeingOptions && Array.isArray(sightseeingOptions) && sightseeingOptions.length > 0 ? (
    sightseeingOptions.map((place, index) => (
      <div
        key={index}
        className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 w-[380px] p-4"
      >
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900">
          {place.SightseeingName || "Unnamed Place"}
        </h2>

        {/* Image Section */}
        <div className="relative w-full h-48 rounded-md overflow-hidden mt-2">
          <img
            src={place.ImageList?.[0] || "/default-image.jpg"}
            alt={place.SightseeingName || "Sightseeing Image"}
            className="w-full h-full object-cover"
          />
          {/* Price Tag */}
          <span className="absolute top-2 right-2 bg-white text-black font-bold px-3 py-1 rounded-md shadow-md">
            ₹{place.Price?.OfferedPriceRoundedOff || "N/A"} onwards
          </span>
        </div>

        <div className="text-center text-sm text-blue-500 mt-1 cursor-pointer">
          <span>View All Photos</span>
          <span
            className="ml-2 text-orange-500 font-bold cursor-pointer"
            onClick={() => {
              const query = `${place.SightseeingName || "Unknown Place"}, ${place.CityName || "Unknown City"}`;
              setPrompt(query);
              setIsChatOpen(true);
              console.log("Prompt:", query);
            }}
          >
            Ask A.I.
          </span>
        </div>

        {/* Location and Distance */}
        <div className="flex justify-between items-center text-sm mt-2">
          <p>
            Located in:{" "}
            <span className="text-blue-600 font-medium">
              {place.CityName || "Unknown City"}
            </span>
          </p>
          <p className="text-gray-500">{place.DurationDescription[0].TotalDuration}</p>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm mt-2 line-clamp-3">
          {place.TourDescription
            ? place.TourDescription.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 180) + "..."
            : "No description available."}
        </p>

        {/* Buttons Section */}
        <div className="flex justify-between mt-4">
          <button className="border border-blue-600 text-blue-600 text-sm font-medium px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition">
            Know More
          </button>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-600 transition"
            onClick={() =>
              increaseCost(place.Price?.OfferedPriceRoundedOff || 0)
            }
          >
            ADD TO TRIP
          </button>
        </div>
      </div>
    ))
  ) : (
    <p className="text-xl text-gray-600 text-center">
      No sightseeing options available.
    </p>
  )}
</div>

              </div>
            </div>
          )}
        </div>
      </div>

      <div className="sticky flex justify-between items-center bottom-2 w-auto mx-auto bg-[#267CE2] h-20 rounded-lg text-white ">
        <div className="font-bold text-xl mx-auto px-5">
          {`${source[0]}`}
          {destination.map((dest, index) => ` - ${dest}`)}
          {` Trip | ${date[0]}`}
        </div>
        <button className="bg-orange-500 px-5 py-2 w-auto mr-4 text-white rounded-lg">
          <span className="text-3xl">₹{cost}</span>
          <span className="text-xs">Total</span>
        </button>
      </div>
    </div>
  );
};
export default Flight;
