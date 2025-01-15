import React, { useState, useEffect } from "react";
import "./CO2Card.css";
import { motion, LayoutGroup } from "framer-motion";
import Chart from "react-apexcharts";
import { httpGetAllReadouts } from "../../../hooks/sensors.requests.js";

const CO2Card = (props) => {
  return (
    <LayoutGroup>
      <ExpandedCard param={props} />
    </LayoutGroup>
  );
};

function ExpandedCard({ param }) {
  const [iaqData, setIaqData] = useState({ iaqIndexes: [], timestamps: [] });

  useEffect(() => {
    const fetchIAQData = async () => {
      try {
        // Fetch data using the hook
        const response = await httpGetAllReadouts();

        if (response && response.length > 0) {
          // Log response to check structure
          console.log("Fetched IAQ data:", response);

          // Process the fetched data
          const iaqIndexes = response.map((item) => item.IAQIndex);
          const timestamps = response.map((item) =>
            new Date(`${item.date} ${item.time}`).getTime()
          );

          // Log processed data
          console.log("Processed IAQ Indexes:", iaqIndexes);
          console.log("Processed Timestamps:", timestamps);

          // Update the state with processed data
          setIaqData({
            iaqIndexes,
            timestamps,
          });
        } else {
          console.error("No data found.");
        }
      } catch (error) {
        console.error("Error fetching IAQ data:", error);
      }
    };

    fetchIAQData();
  }, []); // Empty dependency array to fetch data on mount

  if (iaqData.iaqIndexes.length === 0 || iaqData.timestamps.length === 0) {
    return <div>Loading...</div>;
  }

  // Ensure the timestamps are unique and ordered
  const sortedData = iaqData.timestamps.map((timestamp, index) => ({
    timestamp: new Date(timestamp).toLocaleString(), // Use local string format to see readable timestamps
    iaqIndex: iaqData.iaqIndexes[index],
  }));

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
        type: "category", // Use 'category' instead of 'datetime' to allow more flexible handling
        categories: sortedData.map((entry) => entry.timestamp), // Map the timestamp into categories
      },
    },
    series: [
      {
        name: "IAQ Index",
        data: sortedData.map((entry) => entry.iaqIndex),
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
        {/* Optional close button */}
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
