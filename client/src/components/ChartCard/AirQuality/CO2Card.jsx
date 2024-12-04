import React, { useState, useEffect } from "react";
import "./CO2Card.css";
import { motion, LayoutGroup } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";
import axios from "axios";

// Parent Card Component
const CO2Card = (props) => {
  return (
    <LayoutGroup>
      <ExpandedCard param={props} />
    </LayoutGroup>
  );
};

// Expanded Card Component
function ExpandedCard({ param }) {
  const [iaqData, setIaqData] = useState({ iaqIndexes: [], timestamps: [] }); // State to hold IAQ Index data

  useEffect(() => {
    // Fetch IAQ Index data from the backend API
    const fetchIAQData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/sensors");

        // Assuming the API response is an array of data objects
        const iaqIndexes = response.data.map((item) => item.IAQIndex); // Extract IAQ Index
        const timestamps = response.data.map((item) => {
          // Ensure the time field is a valid date format
          const timestamp = new Date(item.time); // Convert to Date object
          return timestamp.getTime(); // Return as milliseconds since Unix epoch
        });

        // Set the state with the fetched IAQ Index and timestamps
        setIaqData({
          iaqIndexes,
          timestamps,
        });
      } catch (error) {
        console.error("Error fetching IAQ data:", error);
      }
    };

    fetchIAQData(); // Call the fetch function when component mounts
  }, []);

  // Only render chart if data is available
  if (iaqData.iaqIndexes.length === 0 || iaqData.timestamps.length === 0) {
    return <div>Loading...</div>; // Display loading message until data is fetched
  }

  // Chart options for displaying IAQ Index
  const data = {
    options: {
      chart: {
        type: "line",
        height: "auto",
      },
      dropShadow: {
        enabled: false,
        top: 0,
        left: 0,
        blur: 3,
        color: "#000",
        opacity: 0.35,
      },
      fill: {
        colors: ["#1e5245"],
        type: "gradient",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: ["#00cc00"],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
      grid: {
        show: true,
      },
      xaxis: {
        type: "datetime", // Ensure it's recognized as a datetime type
        categories: iaqData.timestamps, // Set the x-axis categories as the timestamps (converted to Unix time)
      },
    },
    series: [
      {
        name: "IAQ Index",
        data: iaqData.iaqIndexes, // Set the series data to the IAQ Index values
      },
    ],
  };

  return (
    <motion.div
      className="ExpandedCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      layoutId={`expandableCard-${param.title}`}
    >
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
        {/* <UilTimes onClick={setExpanded} /> */}
      </div>
      <span>{param.title}</span>
      <div className="chartContainer">
        <Chart options={data.options} series={data.series} type="line" />
      </div>
      <span>Last 24 hours</span>
    </motion.div>
  );
}

export default CO2Card;
