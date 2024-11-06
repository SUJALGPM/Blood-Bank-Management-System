import {
  LayoutDashboard,
  LogOut,
  UserCog,
  UserPlus,
  Menu,
  CalendarCheck2,
  Droplet,
  BarChart,
  Clock,
  Send,
  Box,
  Layers,
  Inbox,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/header_logo.svg";
import LogoutModal from "../../pages/Dashboard/components/Logout_modal";
import { useUser } from "../../context/userContext";
import { useDashboard } from "../../context/DashboardContext"; // Import the useDashboard hook

const Sidebar = () => {
  const { activeLink, setActiveLink } = useDashboard(); // Get activeLink from context
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const [role, setRole] = useState("DONOR");

  useEffect(() => {
    if (user) {
      setRole(user?.role?.toUpperCase() || "");
      console.log(user);
    } else {
      console.log("No user data found in context.");
    }
  }, [user]);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="relative">
      {/* Header with Logo and Hamburger */}
      <header className="flex items-center justify-between bg-purple-800 p-4 md:hidden">
        <p>LifeLine</p>
        <button
          className="text-gray-200 p-2"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Sidebar Content */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-purple-950 p-4 h-full transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:block`}
      >
        <div className="mb-8 w-[80%] mx-auto md:mx-0">
          {/* Logo shown in desktop view */}
          <p className="text-start font-medium font-viga text-4xl text-white">LifeLine</p>
        </div>

        <nav className="space-y-4">
          {[
            role === "MANAGER"
              ? [
                  {
                    id: "dashboard",
                    label: "Dashboard",
                    icon: LayoutDashboard,
                    route: "/dashboard",
                  },
                  {
                    id: "stock",
                    label: "Blood Stock",
                    icon: Layers,
                    route: "/stock",
                  },
                  {
                    id: "list",
                    label: "Requests",
                    icon: Inbox,
                    route: "/list",
                  },
                  {
                    id: "recent_donation",
                    label: "Donation History",
                    icon: Clock,
                    route: "/recent-donation",
                  },
                  {
                    id: "logout",
                    label: "Log Out",
                    icon: LogOut,
                    action: handleLogoutConfirm,
                  },
                ]
              : role === "DONOR"
              ? [
                  {
                    id: "dashboard",
                    label: "Dashboard",
                    icon: LayoutDashboard,
                    route: "/dashboard",
                  },
                  {
                    id: "profile",
                    label: "Profile Manage",
                    icon: UserPlus,
                    route: "/profile",
                  },
                  {
                    id: "donation",
                    label: "Make Donation",
                    icon: CalendarCheck2,
                    route: "/donation",
                  },
                  {
                    id: "logout",
                    label: "Log Out",
                    icon: LogOut,
                    action: handleLogoutConfirm,
                  },
                ]
              : [
                  {
                    id: "dashboard",
                    label: "Dashboard",
                    icon: LayoutDashboard,
                    route: "/dashboard",
                  },
                  {
                    id: "profile",
                    label: "Profile Manage",
                    icon: UserPlus,
                    route: "/profile",
                  },
                  {
                    id: "blood_request",
                    label: "Blood Request",
                    icon: Droplet,
                    route: "/blood-request",
                  },
                  {
                    id: "logout",
                    label: "Log Out",
                    icon: LogOut,
                    action: handleLogoutConfirm,
                  },
                ],
          ]
            .flat()
            .map((item) => (
              // <div
              //   key={item.id}
              //   className={`flex items-center mt-4 space-x-3 cursor-pointer p-3 rounded-md transition ${
              //     activeLink === item.id
              //       ? "bg-purple-700 bg-opacity-60"
              //       : "hover:bg-purple-700"
              //   }`}
              //   onClick={() => {
              //     setActiveLink(item.id); // Set active link in context
              //     setIsSidebarOpen(false); // Close sidebar after clicking
              //     if (item.action) {
              //       item.action(); // Trigger custom action if exists
              //     } else if (item.route) {
              //       navigate(item.route); // Navigate to route if defined
              //     }
              //   }}
              // >
              //   <item.icon className="w-5 h-5" />
              //   <span>{item.label}</span>
              // </div>
              <div
                key={item.id}
                className={`flex items-center mt-4 space-x-3 cursor-pointer p-3 rounded-md transition ${
                  activeLink === item.id
                    ? "bg-purple-700 bg-opacity-60 text-white" // Apply text-white when active
                    : "hover:bg-purple-700"
                }`}
                onClick={() => {
                  setActiveLink(item.id); // Set active link in context
                  setIsSidebarOpen(false); // Close sidebar after clicking
                  if (item.action) {
                    item.action(); // Trigger custom action if exists
                  } else if (item.route) {
                    navigate(item.route); // Navigate to route if defined
                  }
                }}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
            ))}
        </nav>
      </aside>

      {/* Overlay to close sidebar when clicking outside */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Logout Confirmation Modal */}
    </div>
  );
};

export default Sidebar;
