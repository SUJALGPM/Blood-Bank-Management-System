import axios from "axios";
import React, { createContext, useState } from "react";

const DonorContext = createContext();

export const DonorProvider = ({ children }) => {
  const [donorData, setDonorData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerDonor = async (registrationData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND + "/api/donor/donor-register",
        {
          email: registrationData.email,
          password: registrationData.password,
          first_name: registrationData.first_name,
          last_name: registrationData.last_name,
          contact: registrationData.contact,
        }
      );

      console.log("Response data:", response.data);

      // Directly set the donor data from the response
      setDonorData(response.data);
    } catch (err) {
      // Check if the error response exists and set the error message
      if (err.response) {
        console.error("Error response data:", err.response.data);
        setError(
          err.response.data.error || "An error occurred during registration."
        );
      } else {
        setError("Network error or unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND + "/api/donor/donor-register",
        {
          email: registrationData.email,
          password: registrationData.password,
          first_name: registrationData.first_name,
          last_name: registrationData.last_name,
          contact: registrationData.contact,
        }
      );

      console.log("Response data:", response.data);

      // Directly set the donor data from the response
      setDonorData(response.data);
    } catch (err) {
      // Check if the error response exists and set the error message
      if (err.response) {
        console.error("Error response data:", err.response.data);
        setError(
          err.response.data.error || "An error occurred during registration."
        );
      } else {
        setError("Network error or unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }

    console.log("Message" + error);
  };

  const loginDonor = async (loginData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND + "/api/donor/donor-login",
        {
          email: loginData.email,
          password: loginData.password,
        }
      );

      // console.log("Response data:", response.data);

      // Directly set the donor data from the response
      setDonorData(response.data);
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

  const updateDonor = async (id, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        process.env.REACT_APP_BACKEND + `/api/donor/donor-update-profile/${id}`,
        {
          email: data.email,
          password: data.password,
          first_name: data.first_name,
          last_name: data.last_name,
          contact: data.contact,
          blood_group: data.blood_group,
          age: data.age,
          health_status: data.health_status,
        }
      );

      setDonorData(response.data);
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
  const makeDonation = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND + `/api/donor/donor-makeDonation`,
        {
          donor_id: data.id,
          donor_name: data.name,
          blood_type: data.bloodGroup,
          quantity_ml: data.quantity,
          donation_date: data.donationDate,
        }
      );

      setDonorData(response.data);
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

  return (
    <DonorContext.Provider
      value={{
        donorData,
        loginDonor,
        loading,
        error,
        registerDonor,
        updateDonor,
        makeDonation,
      }}
    >
      {children}
    </DonorContext.Provider>
  );
};

export const useDonor = () => {
  const context = React.useContext(DonorContext);
  if (!context) {
    throw new Error("useDonor must be used within a DonorProvider");
  }
  return context;
};
