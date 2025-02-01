// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_API_KEY,
);
// const express = require("express");
// const fetch = require("node-fetch");
// const cors = require("cors");

const app = express();
const TBO_API_BASE_URL = "http://api.tbotechnology.in/TBOHolidays_HotelAPI";
const API_USERNAME = "hackathontest";
const API_PASSWORD = "Hac@98910186";

// Function to get Base64 encoded Auth
const getBasicAuthHeader = () => {
    return "Basic " + Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString("base64");
};
// 1. Allow CORS from your frontend
app.use(cors());
app.use(express.json());
// 2. Parse JSON bodies
app.post("/api/searchFlights", async (req, res) => {
  try {
    // 3. Make sure your request body is as the API expects
    //    For TekTravels, you likely need the same body you tested in Postman
    const requestBody = req.body;

    // 4. Make the request to TekTravels
    const response = await fetch(
      "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    // 5. Check if TekTravels responded with an error or not
    if (!response.ok) {
      // If TekTravels returns 4xx/5xx, log it:
      console.error(
        "Error from TekTravels:",
        response.status,
        response.statusText
      );
      return res
        .status(response.status)
        .json({ error: "Error from TekTravels API." });
    }

    // 6. Parse the JSON response
    const data = await response.json();

    // 7. Send that data back to your React app
    res.json(data);
  } catch (error) {
    // 8. Catch any other errors (like network issues)
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error while fetching flights" });
  }
});
app.post("/api/searchSights", async (req, res) => {
  try {
    const requestBody = JSON.stringify(req.body); // Force clean JSON format

    const response = await fetch(
      "https://SightseeingBE.tektravels.com/SightseeingService.svc/rest/Search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
app.post("/api/citySearch", async (req, res) => {
  try {
    const requestBody = req.body;

    // 4. Make the request to TekTravels
    const response = await fetch(
      "http://api.tektravels.com/SharedServices/StaticData.svc/rest/GetDestinationSearchStaticData",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    // 5. Check if TekTravels responded with an error or not
    if (!response.ok) {
      // If TekTravels returns 4xx/5xx, log it:
      console.error(
        "Error from TekTravels:",
        response.status,
        response.statusText
      );
      return res
        .status(response.status)
        .json({ error: "Error from TekTravels API." });
    }

    // 6. Parse the JSON response
    const data = await response.json();

    // 7. Send that data back to your React app
    res.json(data);
  } catch (error) {
    // 8. Catch any other errors (like network issues)
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error while fetching Sights" });
  }
});
app.post("/api/hotelDetails", async (req, res) => {
  try {
      const { Hotelcodes } = req.body;
       console.log(Hotelcodes);
       
      if (!Hotelcodes) {
          return res.status(400).json({ error: "Invalid request: HotelCode is required" });
      }

      console.log("Fetching hotel details for:", Hotelcodes);

      const response = await fetch("http://api.tbotechnology.in/TBOHolidays_HotelAPI/HotelDetails", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: getBasicAuthHeader(),
          },
          body: JSON.stringify({
              Hotelcodes: Hotelcodes, // Correct field name from API docs
              Language: "EN",
          }),
      });

      const data = await response.json();

      if (data.Status?.Code === 200 && data.HotelDetails) {
          return res.json({ hotelDetails: data.HotelDetails[0] }); // Send first hotel detail
      } else {
          console.error(`Failed to fetch details for HotelCode: ${HotelCode}`, data);
          return res.status(404).json({ error: "Hotel details not found", response: data });
      }

  } catch (error) {
      console.error("Error fetching hotel details:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/api/hotelcodeSearch", async (req, res) => {
  try {
      const { CityCode } = req.body;
      if (!CityCode) {
          return res.status(400).json({ error: "CityCode is required" });
      }

      const response = await fetch("http://api.tbotechnology.in/TBOHolidays_HotelAPI/TBOHotelCodeList", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": getBasicAuthHeader()
          },
          body: JSON.stringify({
              CityCode,
              IsDetailedResponse: "true"
          })
      });

      const data = await response.json();

      if (!data || !data.Hotels) {
          return res.status(404).json({ error: "No hotels found for the given city." });
      }

      const hotelCodes = data.Hotels.map(hotel => hotel.HotelCode);
      res.json({ hotelCodes });

  } catch (error) {
      console.error("Error fetching hotel codes:", error);
      res.status(500).json({ error: "Failed to fetch hotel codes" });
  }
});
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
          Filters
      } = req.body;

      if (!HotelCodes || HotelCodes.length === 0) {
          return res.status(400).json({ error: "HotelCodes cannot be empty" });
      }

      // Convert array to comma-separated string if needed
      const hotelCodesString = Array.isArray(HotelCodes) ? HotelCodes.join(",") : HotelCodes;

      const response = await fetch(`${TBO_API_BASE_URL}/Search`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": getBasicAuthHeader()
          },
          body: JSON.stringify({
              CheckIn,
              CheckOut,
              HotelCodes: hotelCodesString,
              GuestNationality,
              PaxRooms,
              ResponseTime,
              IsDetailedResponse,
              Filters
          })
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


app.post("/api/ai", async (req, res) => {
  try {
    const { prompt } = req.body; // Extract the prompt directly from the request body
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" }); // Handle case where prompt is missing
    }
    console.log("Received prompt:", prompt);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt); // Ensure proper input structure
    const responseText = result.response?.candidates?.[0]?.content || "No response";

    // console.log("Generated Response:", responseText);
    res.json({ message: responseText }); // Send JSON response with AI-generated content
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});


app.use(express.json());
app.use("/", (req, res) => {
  res.send("Server is running");
});

// 9. Run your server on port 5000 (or any port you prefer)
app.listen(3001, () => console.log("Server started on port 3001"));
