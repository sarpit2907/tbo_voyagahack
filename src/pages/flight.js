import React, { useState } from "react";

const Flight = () => {
  return (
    <div className="min-h-screen bg-[#DDDDDD]">
      {/* Header */}
      <header className="w-full bg-white text-white py-6 flex items-center justify-between px-6 z-50">
        <img src="/logo.svg" alt="Logo" className="h-10 w-auto pl-10" />
        <img src="/account.svg" alt="Account" className="h-10 w-auto pr-10" />
      </header>
    </div>
  );
};

export default Flight;
