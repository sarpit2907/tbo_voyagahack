import React, { createContext, useContext, useState } from "react";

const Details = createContext();
const DetailsProvider = ({ children }) => {
  const [source, setSource] = useState([]);
  const [date, setDate] = useState([]);
  const [destination, setDestination] = useState([]);
  const [travellers, setTravellers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    Class: "Economy",
  });
  const [cost, setCost] = useState(0);

  return (
    <Details.Provider
      value={{
        source,
        setSource,
        destination,
        setDestination,
        travellers,
        setTravellers,
        date,
        setDate,
        cost,
        setCost

      }}
    >
      {children}
    </Details.Provider>
  );
};

export const useDetails = () => {
  return useContext(Details);
};

export default DetailsProvider;