import React, { useState, useRef, useEffect } from "react";
import { useDetails } from "../pages/context.js";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
const Trip = () => {
  const { prompt, setPrompt, result, setResult,isChatOpen, setIsChatOpen } = useDetails();
  const [footerHeight, setFooterHeight] = useState(0);
  const textareaRef = useRef(null);
  const tripRef = useRef(null);
  const footerRef = useRef(null);
  useEffect(() => {
    console.log("Prompt in Trip.js Updated:", prompt);
  }, [prompt]);
  useEffect(() => {
    console.log("Updated Result:", result);
  }, [result]);
  useEffect(() => {
    if (prompt) {
      console.log("Fetching AI response for:", prompt);
      getResult(prompt);
    }
  }, [prompt]);
  console.log(prompt);
  
  useEffect(() => {
    const handleResize = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    const updateFooterHeight = () => {
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
    };

    if (textareaRef.current) {
      textareaRef.current.addEventListener("input", handleResize);
    }

    window.addEventListener("resize", updateFooterHeight);
    updateFooterHeight();

    return () => {
      if (textareaRef.current) {
        textareaRef.current.removeEventListener("input", handleResize);
      }
      window.removeEventListener("resize", updateFooterHeight);
    };
  }, [result]);

  const getResult = async (query) => {
    try {
      const response = await fetch("http://localhost:3001/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: query || prompt || "No Prompt",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("AI Response:", data.message.parts[0].text);
      setResult(data.message.parts[0].text);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <IoChatbubbleEllipsesOutline size={28} />
      </button>
  
      {/* Chatbox Window */}
      {isChatOpen && ( 
        <div
          ref={tripRef}
          className="fixed bottom-20 right-8 w-80 bg-white shadow-xl rounded-lg border border-gray-300 flex flex-col items-center transition-all duration-300 z-50"
          style={{ bottom: `${footerHeight + 20}px` }}
        >
          {/* Chat Header */}
          <div className="w-full bg-blue-600 text-white p-3 text-lg font-semibold flex justify-between items-center rounded-t-lg">
            Chatbot
            <button
              className="text-white hover:text-gray-300"
              onClick={() => setIsChatOpen(false)} // ✅ Close Chat
            >
              ✖
            </button>
          </div>
  
          {/* Chat Input Field */}
          <textarea
            className="w-full p-2 border-b border-gray-300 focus:outline-none resize-none text-gray-800"
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            placeholder="Ask something..."
            rows="1"
            ref={textareaRef}
          />
  
          {/* Chat Response Box */}
          <div className="overflow-y-auto max-h-60 w-full p-3 text-gray-700">
            {result &&
              result.split("\n").map((section, index) => {
                const isHeading = section.startsWith("**") && section.endsWith(":");
                const cleanText = section.replace(/\*\*/g, "").trim();
  
                return isHeading ? (
                  <h2 key={index} className="text-lg font-bold text-blue-600 mt-4">
                    {cleanText}
                  </h2>
                ) : (
                  <p key={index} className="text-base text-gray-700 mt-2">
                    {cleanText}
                  </p>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default Trip;
