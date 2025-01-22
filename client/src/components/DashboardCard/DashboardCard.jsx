import React, {useEffect, useState} from "react";
import "./DashboardCard.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, LayoutGroup } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";
import { httpGetAllReadouts } from "../../hooks/sensors.requests";
import TemperaturePieChart from "../DashboardPieChart/TemperaturePieChart";
// parent Card

const DashboardCard = (props) => {
  const [expanded, setExpanded] = useState(false);
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
              // text={`${param.barValue}%`}
              text={`${param.barValue}`}
          />
          <span>{param.title}</span>
        </div>
        <div className="detail">
          <Png style={{ width: '50px', height: '50px' }}/>
          <span>{param.value}</span>
          <span>Last 24 hours</span>
        </div>
      </motion.div>
  );
}

function useDateTime() {
  const [dateTimeAxis, setDateTimeAxis] = useState([]);

  useEffect(() => {
    const fetchReadouts = async () => {
      try {
        const data = await httpGetAllReadouts();

        if (Array.isArray(data)) {
          const newDateTimeAxis = data.map((readout) => {
            const date = readout.date; // Assuming 'date' is in a valid format
            const time = readout.time; // Assuming 'time' is in a valid format
            const dateTimeString = `${date} ${time}`;
            const dateObj = new Date(dateTimeString);
            const formattedDateTime = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:${dateObj.getSeconds().toString().padStart(2, '0')}`;
            return formattedDateTime;
          });

          setDateTimeAxis(newDateTimeAxis);
        } else {
          console.error("Expected an array but received:", data);
        }
      } catch (error) {
        console.error("Error fetching readouts:", error);
      }
    };

    fetchReadouts();
  }, []);

  return dateTimeAxis;
}


// Expanded Card
function DBExpandedCard({ param, setExpanded }) {
  const dateTimeAxis = useDateTime();
  console.log(dateTimeAxis);

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
        type: "string",
        categories: dateTimeAxis,
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
        <Chart options={data.options} series={param.series} type="area" />
      </div>
      {/* <span>Last 24 hours</span> */}
    </motion.div>
  );
}

export default DashboardCard;
