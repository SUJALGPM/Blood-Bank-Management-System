import React, { useEffect } from "react";
import { Droplet, AlertTriangle, CheckCircle } from "lucide-react";
import Sidebar from "../../components/SideBar/Sidebar";
import { useBloodManager } from "../../context/BloodManagerContext";

export default function BloodInventory() {
  const { showStock, stock } = useBloodManager();

  useEffect(() => {
    showStock();
  }, []);

  const getStockLevel = (quantity_ml) => {
    if (quantity_ml < 20) return "critical";
    if (quantity_ml < 50) return "low";
    return "sufficient";
  };

  return (
    <div className="bg-purple-50  min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col h-screen lg:flex-row">
        <Sidebar />
        <main className="flex-grow flex items-center justify-center">
          <div className="container mx-auto p-4 bg-purple-100 min-h-screen text-purple-950">
            <h1 className="text-3xl font-bold text-start mb-2 text-purple-950">
              Blood Inventory
            </h1>
            <p className="text-start text-purple-400 mb-6">
              Current stock levels for different blood types
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {Array.isArray(stock) &&
                stock.map((blood) => (
                  <div
                    key={blood.blood_type}
                    className="bg-purple-300 text-purple-950 border-purple-700 rounded-lg w-[98%] h-36 p-4"
                  >
                    <div className="pb-2">
                      <h2 className="text-2xl font-bold text-purple-950 flex items-center">
                        <Droplet className="mr-2 h-6 w-6 text-purple-950" />
                        {blood.blood_type}
                      </h2>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mt-6 mb-2">
                        <span className="text-sm font-medium text-purple-950">
                          Stock Level:
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            getStockLevel(blood.quantity_ml) === "critical"
                              ? "text-red-400"
                              : getStockLevel(blood.quantity_ml) === "low"
                              ? "text-yellow-400"
                              : "text-green-400"
                          }`}
                        >
                          {blood.quantity_ml} ml
                        </span>
                      </div>
                      <div className="bg-purple-700 h-2 rounded-full ">
                        <div
                          className={`h-full  max-w-full rounded-full ${
                            getStockLevel(blood.quantity_ml) === "critical"
                              ? "bg-red-500"
                              : getStockLevel(blood.quantity_ml) === "low"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${(blood.quantity_ml / 100) * 100}%`,
                          }} // Assuming a max value of 100 ml for percentage calculation
                        />
                      </div>
                      <div
                        className={`flex items-center mt-2 ${
                          getStockLevel(blood.quantity_ml) === "critical"
                            ? "text-red-400"
                            : getStockLevel(blood.quantity_ml) === "low"
                            ? "text-yellow-400"
                            : "text-green-400"
                        }`}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
