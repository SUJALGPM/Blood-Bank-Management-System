// components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  // Check if user data exists in local storage
  if (!user) {
    
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
     
      {children}
    </div>
  );
};

export default ProtectedRoute;
