// src/context/DashboardContext.js
import React, { createContext, useContext, useState } from "react";

// Create the Dashboard Context
const DashboardContext = createContext();

// Create a provider component
export const DashboardProvider = ({ children }) => {
  const [activeLink, setActiveLink] = useState("dashboard");
  

  return (
    <DashboardContext.Provider value={{ activeLink, setActiveLink }}>
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook to use the Dashboard Context
export const useDashboard = () => {
  return useContext(DashboardContext);
};
