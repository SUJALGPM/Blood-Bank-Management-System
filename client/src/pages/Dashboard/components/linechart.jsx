// DonorTrendLineChart.js
import React, { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const LineChart = () => {
  const chartRef = useRef(null);

  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
    ],
    datasets: [
      {
        label: "Number of Donors",
        data: [120, 150, 100, 170, 220, 190, 240, 300],
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 1)",
        borderColor: "rgba(75, 192, 192, 0.6)",
        tension: 0.1,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#fff",
        },
      },
      title: {
        display: true,
        text: "Donor Trend",
        font: {
          size: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#444",
        },
        ticks: {
          color: "#fff",
        },
      },
      x: {
        grid: {
          color: "#444",
        },
        ticks: {
          color: "#fff",
        },
      },
    },
  };

  // Effect to clean up the chart on unmount
  useEffect(() => {
    const chart = chartRef.current;
    return () => {
      if (chart) {
        chart.destroy(); // Destroy the chart instance on unmount
      }
    };
  }, []);

  return (
    <div
      className="bg-purple-800"
      style={{
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ color: "#fff" }}>Donor Trend</h2>
      <Line ref={chartRef} options={options} data={data} />
    </div>
  );
};

export default LineChart;
