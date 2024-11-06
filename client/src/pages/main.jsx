// pages/index.js
import React from "react";
// Adjust if the path is different
import AppRouter from "../routes/route"; // Adjust path if needed

const Main = () => {
  return (
    <div className="max-w-full overflow-x-hidden">
      <AppRouter />
    </div>
  );
};

export default Main;
