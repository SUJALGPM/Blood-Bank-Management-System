import React from "react";

const recentDonations = [
  { id: 1, donor: "John Doe", bloodType: "A+", date: "2024-10-20" },
  { id: 2, donor: "Jane Smith", bloodType: "O-", date: "2024-10-21" },
  { id: 3, donor: "Mike Johnson", bloodType: "B+", date: "2024-10-22" },
  { id: 4, donor: "Emily White", bloodType: "AB-", date: "2024-10-23" },
  { id: 5, donor: "Chris Green", bloodType: "A-", date: "2024-10-24" },
];

const upcomingDrives = [
  { id: 1, location: "City Hospital", date: "2024-11-01", goal: 100 },
  { id: 2, location: "Community Center", date: "2024-11-15", goal: 80 },
  { id: 3, location: "University Campus", date: "2024-12-01", goal: 120 },
];

const DonationsAndDrives = () => {
  return (
    <div className="bg-purple-900 text-white p-6 space-y-6 w-full">
      {/* Recent Donations Card */}
      <div className="bg-purple-800 rounded-lg shadow-lg p-6  ">
        <div className="mb-4 my-6">
          <h2 className="text-xl font-bold">Recent Donations</h2>
          <p className="text-sm text-purple-400">Last 5 blood donations</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left bg-purple-700 text-purple-300">
              <th className="py-2 px-4">Donor</th>
              <th className="py-2 px-4">Blood Type</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentDonations.map((donation) => (
              <tr
                key={donation.id}
                className="odd:bg-purple-800 even:bg-purple-700"
              >
                <td className="py-2 px-4">{donation.donor}</td>
                <td className="py-2 px-4">{donation.bloodType}</td>
                <td className="py-2 px-4">{donation.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upcoming Blood Drives Card */}
      <div className="bg-purple-800 rounded-lg shadow-lg p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Upcoming Blood Drives</h2>
          <p className="text-sm text-purple-400">
            Scheduled blood donation events
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left bg-purple-700 text-purple-300">
              <th className="py-2 px-4">Location</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Goal</th>
            </tr>
          </thead>
          <tbody>
            {upcomingDrives.map((drive) => (
              <tr key={drive.id} className="odd:bg-purple-800 even:bg-purple-700">
                <td className="py-2 px-4">{drive.location}</td>
                <td className="py-2 px-4">{drive.date}</td>
                <td className="py-2 px-4">{drive.goal} units</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationsAndDrives;
