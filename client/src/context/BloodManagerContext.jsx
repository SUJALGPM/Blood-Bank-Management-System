// src/contexts/BloodManagerContext.js
import axios from "axios";
import React, { createContext, useState } from "react";

const BloodManagerContext = createContext();

export const BloodManagerProvider = ({ children }) => {
  const [managerData, setManagerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState(null);
  const [request, setRequest] = useState(null);
  const [recentDonation, setRecentDonation] = useState(null);
  const [recentDon ,setRecentDon] = useState(null);
  const [error, setError] = useState("");

  const registerManager = async (registrationData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND + "/api/bloodmanager/bm-register",
        {
          email: registrationData.email,
          password: registrationData.password,
          username: `${registrationData.first_name} ${registrationData.last_name}`,
          phone: registrationData.contact,
        }
      );

      setManagerData(response.data);
    } catch (err) {
      if (err.response) {
        console.error(err.response);
        setError(
          err.response.data.error || "An error occurred during registration."
        );
      } else {
        setError("Network error or unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  const loginManager = async (loginData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND + "/api/bloodmanager/bm-login",
        {
          email: loginData.email,
          password: loginData.password,
        }
      );

      // console.log("Response data:", response.data);

      // Directly set the donor data from the response
      setManagerData(response.data);
    } catch (err) {
      // Check if the error response exists and set the error message
      if (err.response) {
        console.error("Error response data:", err.response.data);
        setError(err.response.data.error || "An error occurred during Login.");
      } else {
        setError("Network error or unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  const showStock = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        process.env.REACT_APP_BACKEND + "/api/bloodmanager/bm-bloodbank-stock"
      );

      // console.log("Response data:", response.data);

      // Directly set the donor data from the response
      setStock(response.data);
      console.log(response.data);
    } catch (err) {
      // Check if the error response exists and set the error message
      if (err.response) {
        console.error("Error response data:", err.response.data);
        setError(err.response.data.error || "An error occurred during Login.");
      } else {
        setError("Network error or unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  const showRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        process.env.REACT_APP_BACKEND +
          "/api/bloodmanager/bm-fetch-pending-request"
      );

      setRequest(response.data);
      console.log(response.data);
    } catch (err) {
      // Check if the error response exists and set the error message
      if (err.response) {
        console.error("Error response data:", err.response.data);
        setError(err.response.data.error || "An error occurred during Login.");
      } else {
        setError("Network error or unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  const recentDonationReq = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        process.env.REACT_APP_BACKEND +
          "/api/bloodmanager/bm-recent-donations"
      );

      setRecentDonation(response.data);
      console.log(response.data);
    } catch (err) {
      if (err.response) {
        console.error("Error response data:", err.response.data);
        setError(err.response.data.error || "An error occurred during Login.");
      } else {
        setError("Network error or unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  const recentDonReq = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        process.env.REACT_APP_BACKEND +
          "/api/bloodmanager/bm-recent-donations-request"
      );

      setRecentDon(response.data);
      console.log(response.data);
    } catch (err) {
      if (err.response) {
        console.error("Error response data:", err.response.data);
        setError(err.response.data.error || "An error occurred during Login.");
      } else {
        setError("Network error or unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  const approveRequest = async (data) => {
    setLoading(true);
    setError(null);
    console.log(data);
    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND + "/api/bloodmanager/bm-request-handle",
        {
          requestId: data.requestId,
          status: "approved",
        }
      );

      // setRequest(response.data);
      console.log(response.data);
    } catch (err) {
      if (err.response) {
        console.error("Error response data:", err.response.data);
        setError(err.response.data.error || "An error occurred during Login.");
      } else {
        setError("Network error or unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <BloodManagerContext.Provider
      value={{
        managerData,
        loading,
        error,
        registerManager,
        loginManager,
        showStock,
        stock,
        showRequest,
        request,
        approveRequest,
        recentDonationReq,
        recentDonation,
        setRecentDonation,
        setRecentDon,recentDonReq,recentDon
      }}
    >
      {children}
    </BloodManagerContext.Provider>
  );
};

export const useBloodManager = () => {
  const context = React.useContext(BloodManagerContext);
  if (!context) {
    throw new Error(
      "useBloodManager must be used within a BloodManagerProvider"
    );
  }
  return context;
};
