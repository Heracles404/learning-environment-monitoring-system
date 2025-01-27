import React, { useState, useEffect } from "react";
import "./DashboardCard.css";
import { CircularProgressbar } from "react-circular-progressbar";
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
      <div className="radialBar">
        <CircularProgressbar
          value={param.barValue}
          text={`${param.barValue}`}
        />
        <span>{param.title}</span>
      </div>
      <div className="detail">
      <Png style={{ width: '50px', height: '50px' }}/>
        <span>{param.value}</span>
        <span>Current Status</span>
      </div>
    </motion.div>
  );
}

// Expanded Card
function DBExpandedCard({ param, setExpanded }) {
  const data = {
    options: {
      chart: {
        type: "area",
        height: "auto",
      },
      dropShadow: {
        enabled: false,
        enabledOnSeries: undefined,
        top: 0,
        left: 0,
        blur: 3,
        color: "#000",
        opacity: 0.35,
      },
      fill: {
        colors: ["#fff"],
        type: "gradient",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: ["white"],
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
        categories: param.series[0].data.map((_, index) => {
          // Using the timestamp or index to create datetime categories
          return new Date(Date.now() - (param.series[0].data.length - index) * 1000 * 60 * 60).toISOString();
        }),
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
      <span>{param.title}</span>
      <div className="DBchartContainer">
        <Chart
          options={data.options}
          series={param.series} // Series now contains data for each room
          type="area"
        />
      </div>
      {/* <span>Last 24 hours</span> */}
    </motion.div>
  );
}


export default DashboardCard;