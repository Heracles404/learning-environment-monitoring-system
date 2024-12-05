import React, { useState, useEffect } from "react";
import "./HeatIndexCard.css";
import { motion, LayoutGroup } from "framer-motion";
import Chart from "react-apexcharts";
import axios from "axios";

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
        const response = await axios.get("http://localhost:8000/sensors", {
          headers: { "Cache-Control": "no-cache" }, // Disable caching
        });

        const values = response.data.map((item) => item.heatIndex);
        const timestamps = response.data.map((item) =>
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

    // Polling to fetch updated data every 30 seconds
    const interval = setInterval(fetchHeatIndexData, 30000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  if (heatIndexData.values.length === 0 || heatIndexData.timestamps.length === 0) {
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
        type: "datetime",
        categories: heatIndexData.timestamps,
      },
    },
    series: [
      {
        name: "Heat Index",
        data: heatIndexData.values,
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

export default HeatIndexCard;
