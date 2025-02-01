import React, { useState, useRef, useEffect, use } from "react";
import { useDetails } from "../pages/context.js";

const Trip = () => {
  const [result, setResult] = useState("");
  const { prompt, setPrompt } = useDetails();
  const [footerHeight, setFooterHeight] = useState(0);

  const textareaRef = useRef(null);
  const tripRef = useRef(null);
  const footerRef = useRef(null);


  useEffect(() => {
    const handleResize = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto"; // Reset the height to auto
        textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content
      }
    };

    const updateFooterHeight = () => {
      const footer = footerRef.current;
      if (footer) {
        setFooterHeight(footer.offsetHeight);
      }
    };

    const textareaElement = textareaRef.current;
    if (textareaElement) {
      textareaElement.addEventListener("input", handleResize);
    }

    window.addEventListener("resize", updateFooterHeight); // Update footer height on window resize
    updateFooterHeight(); // Initial check on mount

    // Cleanup event listeners on unmount
    return () => {
      if (textareaElement) {
        textareaElement.removeEventListener("input", handleResize);
      }
      window.removeEventListener("resize", updateFooterHeight);
    };
  }, []);

  const getResult = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt || "No Prompt", // Fallback to "No Prompt" if prompt is empty
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
    <div
      ref={tripRef}
      className="fixed right-0 w-1/3 bg-slate-400 rounded-xl max-h-60 flex flex-col border-gray-900 border-2 items-center justify-between overflow-y-auto ml-2 mr-2 z-50"
      style={{ bottom: `${footerHeight + 20}px` }} // Set bottom offset dynamically above the footer
    >
      <textarea
        className="w-40 bg-red-300 my-2 rounded-lg break-words resize-none pl-2"
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
        rows="1"
        style={{ height: "auto", minHeight: "1.5em", overflow: "hidden" }}
        ref={textareaRef}
      />
      
      <button
        className="bg-red-500 rounded-lg p-3 text-white"
        onClick={getResult}
      >
        Click Here
      </button>
      <div className="overflow-y-auto flex-1 w-full pl-2">
        {result &&
          result.split("\n").map((section, index) => {
            const isHeading = section.startsWith("**") && section.endsWith(":");
            const cleanText = section.replace(/\*\*/g, "").trim(); // Remove ** formatting

            if (isHeading) {
              return (
                <h2 key={index} className="text-lg font-bold text-blue-600 mt-4">
                  {cleanText}
                </h2>
              );
            }

            return (
              <p key={index} className="text-base text-gray-700 mt-2">
                {cleanText}
              </p>
            );
          })}
      </div>
    </div>
  );
};

export default Trip;
