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

        // Process the fetched data
        const iaqIndexes = response.map((item) => item.IAQIndex);
        const timestamps = response.map((item) =>
          new Date(`${item.date} ${item.time}`).getTime()
        );

        // Update the state with processed data
        setIaqData({
          iaqIndexes,
          timestamps,
        });
      } catch (error) {
        console.error("Error fetching IAQ data:", error);
      }
    };

    fetchIAQData();

    // Polling to fetch updated data every 30 seconds
    const interval = setInterval(fetchIAQData, 30000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  if (iaqData.iaqIndexes.length === 0 || iaqData.timestamps.length === 0) {
    return <div>Loading...</div>;
  }

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
        type: "datetime",
        categories: iaqData.timestamps,
      },
    },
    series: [
      {
        name: "IAQ Index",
        data: iaqData.iaqIndexes,
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
