# TBO VoyagaHack2.0

Ctrl+Z Warriors have built this prototype for the TBO VoyagaHack2.0 competetion. This is an AI-powered travel planning assistant that simplifies trip organization by integrating all essential bookings— transport, hotels, and sightseeing—into a single platform. Designed for both solo and group travelers, it streamlines trip planning with intelligent recommendations and easy booking interface.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)


## Introduction

Planning a trip can be overwhelming, requiring multiple platforms for bookings, endless research, and constant coordination with co-travelers. VoyagaHack addresses these challenges by offering an all-in-one solution with AI-generated itineraries, real-time group collaboration, and expenses monitoring feature.

## Features

### ✅ Unified Travel Booking
Users can book flights, trains, buses, hotels as well as sightseeing options from a single dashboard, eliminating the need to navigate multiple websites.

### ✅ AI-Powered Itinerary Planning
The AI system can give personalized suggestions for different sightseeing options as well as any additional queries provided by the user directly with the help of our AI chatbox.

### ✅ Sightseeing Recommendations
It suggests must-visit attractions, tours, and local experiences to enhance the travel experience.

### ✅ Budget Optimization & Expense Tracking
Users can monitor their travel expenses, receive cost-saving recommendations, and stay within budget effortlessly.

## Technology Stack

VoyagaHack is built on a robust technology stack to ensure scalability and smooth performance.

- **Frontend:** React.js (UI/UX), React Router (client-side routing), Context API (state management), Tailwind CSS (styling).
- **Backend:** Node.js (server-side), Express.js (REST APIs), CORS (frontend-backend integration), Dotenv (environment variables), Google GenAI (AI recommendations).
- **APIs:** TBO tektravels API (flights, sightseeing, city search), TBO Holidays API (hotel services), Google Generative API (AI-based recommendations).
- **Deployment:** Vercel (frontend and backend hosting).

## Prerequisites

Ensure you have the following installed before running the project:

- Node.js (latest version)
- npm or yarn
- Git

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sarpit2907/tbo_voyagahack.git
   cd tbo_voyagahack
   ```

2. **Install dependencies:**

   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and configure the necessary API keys and settings:

   ```env
   GOOGLE_API_KEY=your_api_key
   ```

4. **Run the project:**

   ```bash
   cd client
   npm run dev
   cd server
   npm run start
   ```

Navigate to `http://localhost:3000` to access the application or you can access the deployed app at `https://tbo-voyagahack-client-topaz.vercel.app/`

Thank You
---

