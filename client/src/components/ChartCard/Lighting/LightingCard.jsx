import React, { useState, useEffect } from "react";
import "./LightingCard.css";
import { motion, LayoutGroup } from "framer-motion";
import Chart from "react-apexcharts";
import { httpGetAllReadouts } from "../../../hooks/sensors.requests.js";

const LightingCard = (props) => {
  return (
    <LayoutGroup>
      <ExpandedCard param={props} />
    </LayoutGroup>
  );
};

function ExpandedCard({ param }) {
  const [lightingData, setLightingData] = useState({ lightingValues: [], timestamps: [] });

  useEffect(() => {
    const fetchLightingData = async () => {
      try {
        const response = await httpGetAllReadouts();

        const lightingValues = response.map((item) => item.lighting);
        const timestamps = response.map((item) =>
          new Date(`${item.date} ${item.time}`).getTime()
        );

        setLightingData({
          lightingValues,
          timestamps,
        });
      } catch (error) {
        console.error("Error fetching lighting data:", error);
      }
    };

    fetchLightingData();

    // Polling to fetch updated data every 30 seconds
    const interval = setInterval(fetchLightingData, 30000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  if (lightingData.lightingValues.length === 0 || lightingData.timestamps.length === 0) {
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
        colors: ["#ffcc00"],
        type: "gradient",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: ["#ffaa00"],
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
        categories: lightingData.timestamps,
      },
    },
    series: [
      {
        name: "Lighting",
        data: lightingData.lightingValues,
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

export default LightingCard;
