import axios from "axios";
import React, { createContext, useState } from "react";

const DoneeContext = createContext();

export const DoneeProvider = ({ children }) => {
  const [doneeData, setDoneeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerDonee = async (registrationData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND + "/api/donee/donee-register",
        {
          email: registrationData.email,
          password: registrationData.password,
          first_name: registrationData.first_name,
          last_name: registrationData.last_name,
          contact: registrationData.contact,
        }
      );

      if (response.data) {
        setDoneeData(response.data);
      } else {
        setError("Unexpected response format.");
      }
    } catch (err) {
      if (err.response) {
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

  const loginDonee = async (loginData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND + "/api/donee/donee-login",
        {
          email: loginData.email,
          password: loginData.password,
        }
      );

      setDoneeData(response.data);
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

  const updateDonee = async (id, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        process.env.REACT_APP_BACKEND + `/api/donee/donee-update-profile/${id}`,
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

      setDoneeData(response.data);
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
  const sendRequest = async (id, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND + `/api/donee/donee-request-blood/${id}`,
        {
          donee_id: data.id,
          donee_name: data.name,
          blood_group: data.bloodgroup,
          quantity_ml: data.quantity,
        }
      );

      setDoneeData(response.data);
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
    <DoneeContext.Provider
      value={{
        doneeData,
        loading,
        error,
        registerDonee,
        loginDonee,
        updateDonee,
        sendRequest,
      }}
    >
      {children}
    </DoneeContext.Provider>
  );
};

export const useDonee = () => {
  const context = React.useContext(DoneeContext);
  if (!context) {
    throw new Error("useDonee must be used within a DoneeProvider");
  }
  return context;
};
