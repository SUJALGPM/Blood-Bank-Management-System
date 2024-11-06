import React, { useState } from "react";
import Sidebar from "../../components/SideBar/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Droplet,
  Users,
  Calendar,
  Home,
  Menu,
  X,
  PieChart,
  Settings,
  LogOut,
} from "lucide-react";

const data = [
  { name: "Jan", donations: 400 },
  { name: "Feb", donations: 300 },
  { name: "Mar", donations: 200 },
  { name: "Apr", donations: 278 },
  { name: "May", donations: 189 },
  { name: "Jun", donations: 239 },
];

const SidebarLink = ({ icon: Icon, text, active }) => (
  <a
    href="#"
    className={`flex items-center space-x-2 px-4 py-2 rounded transition duration-200 ${
      active
        ? "bg-purple-700 text-white"
        : "text-gray-300 hover:bg-purple-700 hover:text-white"
    }`}
  >
    <Icon size={20} />
    <span>{text}</span>
  </a>
);

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-lg shadow p-4 sm:p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
          {value}
        </p>
      </div>
      <Icon className="h-8 w-8 text-purple-600" />
    </div>
  </div>
);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-semibold text-purple-700">
              Dashboard
            </h1>
            {/* <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full object-cover"
                src="/placeholder.svg?height=32&width=32"
                alt="Profile"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:inline-block">
                Sujal Dingankar
              </span>
            </div> */}
            <div className="flex items-center">
              {/* Placeholder icon for profile picture */}
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:inline-block">
                Sujal Dingankar
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Donations" value="1,234" icon={Droplet} />
            <StatCard title="Active Donors" value="567" icon={Users} />
            <StatCard title="This Month" value="89" icon={Calendar} />
            <StatCard title="Donation Centers" value="12" icon={Home} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Monthly Donations
              </h2>
              <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="donations" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Donations
              </h2>
              <div className="space-y-4">
                {[
                  { name: "Harsha Surwase", type: "A+", date: "2023-06-15" },
                  { name: "Shreeya Nemade", type: "O-", date: "2023-06-14" },
                  { name: "Rakesh Ramane", type: "B+", date: "2023-06-13" },
                  { name: "Shruti Bhuvad", type: "AB-", date: "2023-06-12" },
                ].map((donation, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Droplet className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{donation.name}</p>
                        <p className="text-sm text-gray-500">
                          Blood Type: {donation.type}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {donation.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
