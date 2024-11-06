"use client";

import { useEffect, useState } from "react";
import {
  Droplet,
  Calendar,
  Syringe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Sidebar from "../../components/SideBar/Sidebar";
import { useBloodManager } from "../../context/BloodManagerContext";

// Your blood donation request data

export default function BloodRequestsList() {
  const { request, showRequest, approveRequest } = useBloodManager();
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    showRequest();
    console.log(request);
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "APPROVED":
        return "bg-green-500";
      case "REJECTED":
        return "bg-red-500";
      default:
        return "bg-purple-500";
    }
  };

  const handleApprove = (requestId) => {
    
    approveRequest({ status: "approved", requestId: requestId });
    showRequest();
  };

  const toggleExpand = (requestId) => {
    setExpandedId(expandedId === requestId ? null : requestId);
  };

  return (
    <div className="bg-purple-100  min-h-screen w-full flex flex-col">
      <div className="flex-grow flex flex-col h-screen w-screen lg:flex-row">
        <Sidebar />
        <main className="flex-grow p-4 w-full lg:w-[60%] m-auto lg:p-8 flex items-center justify-center">
          <div className="min-h-screen w-full bg-purple-100 text-purple-950">
            <div className="w-full mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold text-start mb-8">
                Blood Donation Requests
              </h1>
              <div className="space-y-4 w-full">
                {request?.flat().map((request) => (
                  <div
                    key={request.requestId}
                    className="bg-purple-200 rounded-lg overflow-hidden shadow-lg"
                  >
                    <div
                      className="flex justify-between items-center p-4 cursor-pointer hover:bg-purple-700 transition-colors duration-200"
                      onClick={() => toggleExpand(request.requestId)}
                    >
                      <div className="flex items-center space-x-4">
                        <Droplet className="h-6 w-6 text-red-500" />
                        <div>
                          <p className="font-semibold">{request.bloodType}</p>
                          <p className="text-sm text-purple-400">
                            {request.doneeName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded text-white text-sm ${getStatusColor(
                            request.requestStatus
                          )}`}
                        >
                          {request.requestStatus}
                        </span>
                        {expandedId === request.requestId ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    {expandedId === request.requestId && (
                      <div className="p-4 bg-purple-700 space-y-3">
                        <div className="flex items-center space-x-2">
                          <Syringe className="h-4 w-4 text-purple-400" />
                          <span className="text-sm">
                            Quantity: {request.quantityMl} mL
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-purple-400" />
                          <span className="text-sm">
                            Date: {formatDate(request.requestDate)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleApprove(request.requestId)}
                          disabled={request.requestStatus !== "PENDING"}
                          className={`mt-2 px-4 py-2 rounded text-white font-semibold transition-colors duration-200 ${
                            request.requestStatus === "PENDING"
                              ? "bg-purple-900 hover:bg-purple-700"
                              : "bg-purple-600 cursor-not-allowed"
                          }`}
                        >
                          {request.requestStatus === "PENDING"
                            ? "Approve"
                            : "View Details"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
