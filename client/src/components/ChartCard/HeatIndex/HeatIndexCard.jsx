import React, { useState, useEffect } from "react";
import "./HeatIndexCard.css";
import { motion, LayoutGroup } from "framer-motion";
import Chart from "react-apexcharts";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { httpGetAllReadouts } from "../../../hooks/sensors.requests.js";

const HeatIndexCard = (props) => {
  return (
    <LayoutGroup>
      <ExpandedCard param={props} />
    </LayoutGroup>
  );
};

function ExpandedCard({ param }) {
  const [heatIndexData, setHeatIndexData] = useState({ heatIndexes: [], timestamps: [] });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState({ heatIndexes: [], timestamps: [] });
  const [noDataFound, setNoDataFound] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    const fetchHeatIndexData = async () => {
      try {
        const response = await httpGetAllReadouts();

        if (response && response.length > 0) {
          const heatIndexes = response.map((item) => item.heatIndex);
          const timestamps = response.map((item) =>
            new Date(`${item.date} ${item.time}`).getTime()
          );
          setHeatIndexData({ heatIndexes, timestamps });
        } else {
          console.error("No data found.");
        }
      } catch (error) {
        console.error("Error fetching heat index data:", error);
      }
    };

    fetchHeatIndexData();
  }, []);

  const filterData = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Normalize time to handle full day range
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const filtered = heatIndexData.timestamps
      .map((timestamp, index) => {
        const currentTimestamp = new Date(timestamp);
        if (currentTimestamp >= start && currentTimestamp <= end) {
          return { timestamp, heatIndex: heatIndexData.heatIndexes[index] };
        }
        return null;
      })
      .filter((item) => item !== null);

    if (filtered.length === 0) {
      setNoDataFound(true);
      setOpenDialog(true);
    } else {
      setNoDataFound(false);
    }

    const filteredTimestamps = filtered.map((item) => item.timestamp);
    const filteredHeatIndexes = filtered.map((item) => item.heatIndex);

    setFilteredData({ heatIndexes: filteredHeatIndexes, timestamps: filteredTimestamps });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const sortedData = filteredData.heatIndexes.length > 0 ? filteredData : heatIndexData;

  const data = {
    options: {
      chart: {
        type: "area",
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
        colors: ["#FF4500"],
        type: "gradient",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: [getRandomColor()],
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
        type: "datetime", // Set type to 'datetime'
        categories: sortedData.timestamps.map((timestamp, index) => {
          // Adjust the timestamp based on dynamic calculation
          return new Date(Date.now() - (sortedData.heatIndexes.length - index) * 1000 * 60 * 60).toISOString();
        }),
      },
    },
    series: [
      {
        name: "Heat Index",
        data: sortedData.heatIndexes,
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
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}></div>
      <span>{param.title}</span>

      <div className="date-filter">
        <TextField
          type="date"
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          type="date"
          label="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: startDate,
          }}
        />
        <Button onClick={filterData} variant="contained" color="primary">
          Filter
        </Button>
      </div>

      <div className="chartContainer">
        <Chart options={data.options} series={data.series} type="area" />
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>No Data Found</DialogTitle>
        <DialogContent>
          <p style={{ fontSize: "1.2rem" }}>No data detected for the selected date range.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" style={{ fontSize: "1.1rem" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}

export default HeatIndexCard;
