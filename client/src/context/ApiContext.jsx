// src/contexts/ApiContext.js
import React from "react";
import { DoneeProvider } from "./DoneeContext";
import { DonorProvider } from "./DonorContext";
import { BloodManagerProvider } from "./BloodManagerContext";
import { UserProvider } from "./userContext";
import { DashboardProvider } from "./DashboardContext";

const ApiContext = ({ children }) => {
  return (
    <DashboardProvider>
      <DoneeProvider>
        <DonorProvider>
          <BloodManagerProvider>
            <UserProvider>{children}</UserProvider>
          </BloodManagerProvider>
        </DonorProvider>
      </DoneeProvider>
    </DashboardProvider>
  );
};

export default ApiContext;
