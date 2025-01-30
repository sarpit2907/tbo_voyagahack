// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
// const express = require("express");
// const fetch = require("node-fetch");
// const cors = require("cors");

const app = express();

// 1. Allow CORS from your frontend
app.use(cors());
// 2. Parse JSON bodies
app.use(express.json());

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
      console.error("Error from TekTravels:", response.status, response.statusText);
      return res.status(response.status).json({ error: "Error from TekTravels API." });
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
    const requestBody = req.body;

    // 4. Make the request to TekTravels
    const response = await fetch(
      "https://SightseeingBE.tektravels.com/SightseeingService.svc/rest/Search",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    // 5. Check if TekTravels responded with an error or not
    if (!response.ok) {
      // If TekTravels returns 4xx/5xx, log it:
      console.error("Error from TekTravels:", response.status, response.statusText);
      return res.status(response.status).json({ error: "Error from TekTravels API." });
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
      console.error("Error from TekTravels:", response.status, response.statusText);
      return res.status(response.status).json({ error: "Error from TekTravels API." });
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

// 9. Run your server on port 5000 (or any port you prefer)
app.listen(3001, () => console.log("Server started on port 3001"));
