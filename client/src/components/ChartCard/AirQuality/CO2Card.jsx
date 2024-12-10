import React, { useState, useEffect } from "react";
import "./CO2Card.css";
import { motion, LayoutGroup } from "framer-motion";
import Chart from "react-apexcharts";
import axios from "axios";

const CO2Card = (props) => {
  return (
    <LayoutGroup>
      <ExpandedCard param={props} />
    </LayoutGroup>
  );
};

function ExpandedCard({ param }) {
  const [iaqData, setIaqData] = useState({ iaqIndexes: [], timestamps: [] });
  const [startDate, setStartDate] = useState("");  // State for start date
  const [endDate, setEndDate] = useState("");      // State for end date

  useEffect(() => {
    const fetchIAQData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/sensors", {
          headers: { "Cache-Control": "no-cache" }, // Disable caching
        });

        // Log the response data for debugging
        console.log(response.data);

        let filteredData = response.data;

        // Filter data based on the selected date range
        if (startDate && endDate) {
          filteredData = filteredData.filter((item) => {
            const timestamp = new Date(`${item.date} ${item.time}`).getTime();
            return timestamp >= new Date(startDate).getTime() && timestamp <= new Date(endDate).getTime();
          });
        }

        const iaqIndexes = filteredData.map((item) => item.IAQIndex);
        const timestamps = filteredData.map((item) =>
          new Date(`${item.date} ${item.time}`).getTime()  // Corrected string interpolation
        );

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
  }, [startDate, endDate]); // Add startDate and endDate as dependencies

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
      <span>{param.title}</span>
      
      {/* Date Filter UI */}
      <div className="dateFilter">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
        />
      </div>

      <div className="chartContainer">
        <Chart options={data.options} series={data.series} type="line" />
      </div>
      <span>Last 24 hours</span>
    </motion.div>
  );
}

export default CO2Card;
