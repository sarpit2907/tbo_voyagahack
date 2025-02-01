import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// If you're using the Google Generative AI client:
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Variables for TBO API
const TBO_API_BASE_URL = "http://api.tbotechnology.in/TBOHolidays_HotelAPI";
const API_USERNAME = "hackathontest";
const API_PASSWORD = "Hac@98910186";

// Create Express app
const app = express();

// Fix: Use cors() with explicit allowed origins
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://tbo-voyagahack-client-topaz.vercel.app"
    ],
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// Helper function to get Basic Auth header
const getBasicAuthHeader = () => {
  return (
    "Basic " + Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString("base64")
  );
};

// ===================== SEARCH FLIGHTS =====================
app.post("/api/searchFlights", async (req, res) => {
  try {
    const requestBody = req.body;

    const response = await fetch(
      "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      console.error(
        "Error from TekTravels:",
        response.status,
        response.statusText
      );
      return res
        .status(response.status)
        .json({ error: "Error from TekTravels API." });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error while fetching flights" });
  }
});

// ===================== SEARCH SIGHTSEEING =====================
app.post("/api/searchSights", async (req, res) => {
  try {
    const requestBody = JSON.stringify(req.body);

    const response = await fetch(
      "https://SightseeingBE.tektravels.com/SightseeingService.svc/rest/Search",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      }
    );

    console.log(
      "TekTravels Response Status:",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      console.error("Error from TekTravels API:", await response.text());
      return res
        .status(response.status)
        .json({ error: "Error from TekTravels API." });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error while fetching Sights" });
  }
});

// ===================== CITY SEARCH =====================
app.post("/api/citySearch", async (req, res) => {
  try {
    const requestBody = req.body;

    const response = await fetch(
      "http://api.tektravels.com/SharedServices/StaticData.svc/rest/GetDestinationSearchStaticData",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      console.error(
        "Error from TekTravels:",
        response.status,
        response.statusText
      );
      return res
        .status(response.status)
        .json({ error: "Error from TekTravels API." });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error while fetching Sights" });
  }
});

// ===================== HOTEL DETAILS =====================
app.post("/api/hotelDetails", async (req, res) => {
  try {
    const { Hotelcodes } = req.body;
    if (!Hotelcodes) {
      return res
        .status(400)
        .json({ error: "Invalid request: HotelCode is required" });
    }

    console.log("Fetching hotel details for:", Hotelcodes);

    const response = await fetch(
      "http://api.tbotechnology.in/TBOHolidays_HotelAPI/HotelDetails",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getBasicAuthHeader(),
        },
        body: JSON.stringify({
          Hotelcodes: Hotelcodes, // Correct field name from API docs
          Language: "EN",
        }),
      }
    );

    const data = await response.json();

    if (data.Status?.Code === 200 && data.HotelDetails) {
      return res.json({ hotelDetails: data.HotelDetails[0] }); // Send first hotel detail
    } else {
      console.error(`Failed to fetch details for HotelCode: ${Hotelcodes}`, data);
      return res
        .status(404)
        .json({ error: "Hotel details not found", response: data });
    }
  } catch (error) {
    console.error("Error fetching hotel details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===================== HOTEL CODE SEARCH =====================
app.post("/api/hotelcodeSearch", async (req, res) => {
  try {
    const { CityCode } = req.body;
    if (!CityCode) {
      return res.status(400).json({ error: "CityCode is required" });
    }

    const response = await fetch(
      "http://api.tbotechnology.in/TBOHolidays_HotelAPI/TBOHotelCodeList",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getBasicAuthHeader(),
        },
        body: JSON.stringify({
          CityCode,
          IsDetailedResponse: "true",
        }),
      }
    );

    const data = await response.json();

    if (!data || !data.Hotels) {
      return res.status(404).json({ error: "No hotels found for the given city." });
    }

    const hotelCodes = data.Hotels.map((hotel) => hotel.HotelCode);
    res.json({ hotelCodes });
  } catch (error) {
    console.error("Error fetching hotel codes:", error);
    res.status(500).json({ error: "Failed to fetch hotel codes" });
  }
});

// ===================== SEARCH HOTELS =====================
app.post("/api/searchHotels", async (req, res) => {
  try {
    const {
      CheckIn,
      CheckOut,
      HotelCodes,
      GuestNationality,
      PaxRooms,
      ResponseTime,
      IsDetailedResponse,
      Filters,
    } = req.body;

    if (!HotelCodes || HotelCodes.length === 0) {
      return res.status(400).json({ error: "HotelCodes cannot be empty" });
    }

    // Convert array to comma-separated string if needed
    const hotelCodesString = Array.isArray(HotelCodes)
      ? HotelCodes.join(",")
      : HotelCodes;

    const response = await fetch(`${TBO_API_BASE_URL}/Search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getBasicAuthHeader(),
      },
      body: JSON.stringify({
        CheckIn,
        CheckOut,
        HotelCodes: hotelCodesString,
        GuestNationality,
        PaxRooms,
        ResponseTime,
        IsDetailedResponse,
        Filters,
      }),
    });

    const data = await response.json();

    if (!data || data.Status.Code !== 200) {
      return res.status(400).json({ error: data.Status.Description || "API error" });
    }

    res.json(data);
  } catch (error) {
    console.error("Error searching hotels:", error);
    res.status(500).json({ error: "Failed to fetch hotel data" });
  }
});

// ===================== GOOGLE GENERATIVE AI ENDPOINT (Optional) =====================
app.post("/api/ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    console.log("Received prompt:", prompt);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response?.candidates?.[0]?.content || "No response";

    res.json({ message: responseText });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

// Test route
app.use("/", (req, res) => {
  res.send("Server is running");
});

// Start server on port 3001 (or your choice)
app.listen(3001, () => console.log("Server started on port 3001"));
