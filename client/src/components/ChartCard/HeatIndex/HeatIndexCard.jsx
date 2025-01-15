import React, { useState, useEffect } from "react";
import "./HeatIndexCard.css";
import { motion, LayoutGroup } from "framer-motion";
import Chart from "react-apexcharts";
import { httpGetAllReadouts } from "../../../hooks/sensors.requests.js";

const HeatIndexCard = (props) => {
  return (
    <LayoutGroup>
      <ExpandedCard param={props} />
    </LayoutGroup>
  );
};

function ExpandedCard({ param }) {
  const [heatIndexData, setHeatIndexData] = useState({ values: [], timestamps: [] });

  useEffect(() => {
    const fetchHeatIndexData = async () => {
      try {
        const response = await httpGetAllReadouts();

        const values = response.map((item) => item.heatIndex);
        const timestamps = response.map((item) =>
          new Date(`${item.date} ${item.time}`).getTime()
        );

        setHeatIndexData({
          values,
          timestamps,
        });
      } catch (error) {
        console.error("Error fetching heat index data:", error);
      }
    };

    fetchHeatIndexData();
  }, []);

  if (heatIndexData.values.length === 0 || heatIndexData.timestamps.length === 0) {
    return <div>Loading...</div>;
  }

  // Ensure the timestamps are unique and ordered
  const sortedData = heatIndexData.timestamps.map((timestamp, index) => ({
    timestamp: new Date(timestamp).toLocaleString(), // Use local string format to see readable timestamps
    heatIndex: heatIndexData.values[index],
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
        colors: ["#ff6347"],
        type: "gradient",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: ["#ff4500"],
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
        type: "category", // Use 'category' to handle custom formatted timestamps
        categories: sortedData.map((entry) => entry.timestamp), // Map the timestamp into categories
      },
    },
    series: [
      {
        name: "Heat Index",
        data: sortedData.map((entry) => entry.heatIndex),
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

export default HeatIndexCard;
