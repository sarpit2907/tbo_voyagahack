// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const genAI = new GoogleGenerativeAI(
  "AIzaSyBF65h3qw9tynSZUVb99_E9vNIbqK_uQRY"
);
// const express = require("express");
// const fetch = require("node-fetch");
// const cors = require("cors");

const app = express();

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
