// Chart.js
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  const data = {
    labels: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], // Blood types
    datasets: [
      {
        label: "Blood Inventory",
        data: [50, 30, 80, 60, 90, 20, 70, 40], // Example inventory levels
        backgroundColor: "rgba(75, 192, 192, 0.8)", // Bar color
        borderColor: "rgba(75, 192, 192, 1)", // Border color
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Blood Inventory",
        font: {
          size: 20,
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#444", // Dark grid lines
        },
        ticks: {
          color: "#fff", // Tick labels color
        },
      },
      x: {
        grid: {
          color: "#444", // Dark grid lines
        },
        ticks: {
          color: "#fff", // Tick labels color
        },
      },
    },
  };

  return (
    <div
      className="bg-purple-800"
      style={{
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      {/* <h2 style={{ color: "#fff" }}>Current blood type inventory levels</h2> */}
      <Bar options={options} data={data} />
    </div>
  );
};

export default Chart;
