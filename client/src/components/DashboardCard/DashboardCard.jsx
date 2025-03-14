import React, { useState, useEffect } from "react";
import "./DashboardCard.css";
import "react-circular-progressbar/dist/styles.css";
import { motion, LayoutGroup } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";
import { fetchCardData } from "../../data/mockChartData"; // Import the fetchCardData function

// parent Card
const DashboardCard = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [cardData, setCardData] = useState(props.cardData || []); // Use cardData passed as prop or empty array

  useEffect(() => {
    if (props.cardData.length === 0) {
      fetchCardData(setCardData); // Fetch data if not provided via props
    }
  }, [props.cardData]);

  return (
    <LayoutGroup>
      {expanded ? (
        <DBExpandedCard param={props} setExpanded={() => setExpanded(false)} />
      ) : (
        <DBCompactCard param={props} setExpanded={() => setExpanded(true)} />
      )}
    </LayoutGroup>
  );
};

// Compact Card
function DBCompactCard({ param, setExpanded }) {
  const Png = param.png;
  return (
    <motion.div
      className="DBCompactCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      layoutId={`expandableCard-${param.title}`}
      onClick={setExpanded}
    >
      <div className="DBradialBar">
        <span style={{ color: param.titleColor }}>{param.title}</span>
      </div>
      <div className="detail">
        <Png style={{ width: "50px", height: "50px", color: param.iconColor }} />
        <span>{param.value}</span>
        <span>Latest Status</span>
      </div>
    </motion.div>
  );
}

// Expanded Card
// Expanded Card
// Expanded Card
function DBExpandedCard({ param, setExpanded }) {
  // Ensure all series data is sorted by timestamp while maintaining x-y pairs
  const sortedSeries = param.series.map((serie) => ({
    ...serie,
    data: [...serie.data].sort((a, b) => new Date(a.x) - new Date(b.x)), // Sort each series
  }));

  const data = {
    options: {
      chart: {
        type: "area",
        height: "auto",
      },
      dropShadow: {
        enabled: false,
        blur: 3,
        color: "#000",
        opacity: 0.3,
      },
      dataLabels: {
        enabled: false, // Disables small value labels
      },
      stroke: {
        curve: "smooth",
        colors: ["white"],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm", // Tooltip time format
        },
        y: {
          formatter: (val) => (val !== undefined && val !== null ? val.toFixed(2) : ""), // Ensures no undefined errors
        },
      },
      grid: {
        show: true,
      },
      xaxis: {
        type: "datetime",
        categories: sortedSeries[0]?.data.map((point) =>
          point.x ? new Date(point.x).toISOString() : null
        ), // Ensure 'x' values exist before converting
      },
      yaxis: {
        labels: {
          formatter: (val) => (val !== undefined ? val.toFixed(2) : ""), // Fix potential undefined values
        },
      },
    },
  };
  
  

  return (
    <motion.div
      className="DBExpandedCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      layoutId={`expandableCard-${param.title}`}
    >
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
        <UilTimes onClick={setExpanded} />
      </div>
      <span style={{ color: param.titleColor }}>{param.title}</span>
      <div className="DBchartContainer">
        <Chart options={data.options} series={sortedSeries} type="area" />
      </div>
    </motion.div>
  );
}



export default DashboardCard;
