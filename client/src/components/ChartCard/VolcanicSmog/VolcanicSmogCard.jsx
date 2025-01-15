import React, { useState, useEffect } from "react";
import "./VolcanicSmogCard.css";
import { motion, LayoutGroup } from "framer-motion";
import Chart from "react-apexcharts";
import { httpGetAllReadouts } from "../../../hooks/sensors.requests.js";

const VolcanicSmogCard = (props) => {
  return (
    <LayoutGroup>
      <ExpandedCard param={props} />
    </LayoutGroup>
  );
};

function ExpandedCard({ param }) {
  const [vocData, setVocData] = useState({ vocValues: [], timestamps: [] });

  useEffect(() => {
    const fetchVOCData = async () => {
      try {
        const response = await httpGetAllReadouts();

        // Use the correct key `voc` for the data
        const vocValues = response.map((item) => item.voc);
        const timestamps = response.map((item) =>
          new Date(`${item.date} ${item.time}`).getTime()
        );

        setVocData({
          vocValues,
          timestamps,
        });
      } catch (error) {
        console.error("Error fetching VOC data:", error);
      }
    };

    fetchVOCData();
  }, []);

  if (vocData.vocValues.length === 0 || vocData.timestamps.length === 0) {
    return <div>Loading...</div>;
  }

  // Ensure the timestamps are unique and ordered
  const sortedData = vocData.timestamps.map((timestamp, index) => ({
    timestamp: new Date(timestamp).toLocaleString(), // Format timestamp for readability
    voc: vocData.vocValues[index],
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
        colors: ["#800020"],
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
        categories: sortedData.map((entry) => entry.timestamp), // Map formatted timestamp into categories
      },
    },
    series: [
      {
        name: "VOC",
        data: sortedData.map((entry) => entry.voc),
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

export default VolcanicSmogCard;
