// components/AppRouter.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import ProtectedRoute from "./ProtectedRoute";
import { MakeDonation } from "../pages/MakeDonation/MakeDonation";
import BloodRequestForm from "../pages/BloodRequest/BloodRequestForm";
import BloodInventory from "../pages/BloodStock/BloodStock";
import BloodRequestsList from "../pages/Requestlist/RequestList";
import { RecentDonation } from "../pages/RecentDonation/RecentDonation";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/blood-request" element={<BloodRequestForm />} />
        <Route path="/donation" element={<MakeDonation />} />
        <Route path="/stock" element={<BloodInventory />} />
        <Route path="/list" element={<BloodRequestsList />} />
        <Route path="/recent-donation" element={<RecentDonation />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
