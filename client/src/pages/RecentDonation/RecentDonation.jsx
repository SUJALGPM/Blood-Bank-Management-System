import React, { useEffect, useState } from "react";
import { useBloodManager } from "../../context/BloodManagerContext";
import Sidebar from "../../components/SideBar/Sidebar";
import { Droplet, Calendar, User, Activity, Search } from "lucide-react";

export const RecentDonation = () => {
  const { recentDonationReq, recentDonation, recentDonReq, recentDon } =
    useBloodManager();
  const [donations, setDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        await recentDonReq();
        await recentDonationReq();
        const donationsList = [...(recentDonation || []), ...(recentDon || [])];
        setDonations(donationsList);
      } catch (err) {
        setError("Failed to fetch donation data.");
      } finally {
        setLoading(false);
      }
    };
    console.log("donations", donations);
    fetchData();
  }, []); // Dependency array updated

  const filteredDonations = donations.filter((donation) => {
    if (
      !donation ||
      (!donation.donor_name && !donation.donee_name) ||
      !donation.blood_type
    ) {
      return false;
    }
    console.log(donation);
    const matchesSearch =
      (donation.donor_name &&
        donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (donation.donee_name &&
        donation.donee_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (donation.blood_type &&
        donation.blood_type.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "ALL" || donation.inventory_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-purple-100 min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col h-screen lg:flex-row">
        <Sidebar />
        <main className="flex-grow p-4 lg:p-8 flex items-center justify-center">
          <div className="w-full">
            <div className="min-h-screen bg-purple-100 text-purple-950 p-4 sm:p-8">
              <div className="max-w-6xl mx-auto bg-purple-100 rounded-lg shadow-xl overflow-hidden">
                <div className="p-4 sm:p-8">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-start mb-6 sm:mb-8">
                    Blood Donation History
                  </h1>
                  <div className="mb-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        placeholder="Search by donor name or blood type"
                        className="w-full bg-purple-100 text-purple-100 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Search className="absolute left-3 top-2.5 h-5 w-5 text-purple-400" />
                    </div>
                    <select
                      className="w-full sm:w-auto bg-purple-500 text-purple-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="ALL">All Status</option>
                      <option value="IN">In Inventory</option>
                      <option value="OUT">Out of Inventory</option>
                    </select>
                  </div>
                  {loading ? (
                    <div className="text-center py-8 text-purple-400">
                      Loading donations...
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-red-400">{error}</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-purple-300">
                            <th className="py-3 px-2 md:px-4 text-left">
                              Donor
                            </th>
                            <th className="py-3 px-2 md:px-4 text-left">
                              Blood Type
                            </th>
                            <th className="py-3 px-2 md:px-4 text-left">
                              Quantity
                            </th>
                            <th className="py-3 px-2 md:px-4 text-left">
                              Donation Date
                            </th>
                            <th className="py-3 px-2 md:px-4 text-left">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDonations.map((donation, index) => (
                            <tr
                              key={index}
                              className="border-b border-purple-700 hover:bg-purple-750 transition-colors duration-150"
                            >
                              <td className="py-3 px-2 md:px-4">
                                <div className="flex items-center space-x-2 md:space-x-3">
                                  <User className="h-5 w-5 text-purple-400" />
                                  <span className="font-medium text-sm md:text-base">
                                    {donation.donor_name ?? donation.donee_name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-2 md:px-4">
                                <div className="flex items-center space-x-1 md:space-x-2">
                                  <Droplet className="h-5 w-5 text-purple-400" />
                                  <span className="text-sm md:text-base">
                                    {donation.blood_type}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-2 md:px-4">
                                <div className="flex items-center space-x-1 md:space-x-2">
                                  <Activity className="h-5 w-5 text-purple-400" />
                                  <span className="text-sm md:text-base">
                                    {donation.quantity_ml} mL
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-2 md:px-4">
                                <div className="flex items-center space-x-1 md:space-x-2">
                                  <Calendar className="h-5 w-5 text-purple-400" />
                                  <span className="text-sm md:text-base">
                                    {(() => {
                                      const formattedDonationDate = formatDate(
                                        donation.donation_date
                                      );
                                      return formattedDonationDate !==
                                        "Invalid Date"
                                        ? formattedDonationDate
                                        : formatDate(donation.request_date);
                                    })()}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-2 md:px-4">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    donation.inventory_status === "IN"
                                      ? "bg-purple-200 "
                                      : "bg-purple-200 "
                                  }`}
                                >
                                  {donation.inventory_status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {filteredDonations.length === 0 && !loading && (
                    <div className="text-center py-8 text-purple-400">
                      No matching donations found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
