import React, { useState, useEffect } from "react";
import "./CO2Card.css";
import { motion, LayoutGroup } from "framer-motion";
import Chart from "react-apexcharts";
import { httpGetAllReadouts } from "../../../hooks/sensors.requests.js";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const CO2Card = (props) => {
  return (
    <LayoutGroup>
      <ExpandedCard param={props} />
    </LayoutGroup>
  );
};

function ExpandedCard({ param }) {
  const [iaqData, setIaqData] = useState({ iaqIndexes: [], timestamps: [] });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState({ iaqIndexes: [], timestamps: [] });
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
    const fetchIAQData = async () => {
      try {
        const response = await httpGetAllReadouts();

        if (response && response.length > 0) {
          const iaqIndexes = response.map((item) => item.IAQIndex);
          const timestamps = response.map((item) =>
            new Date(`${item.date} ${item.time}`).getTime()
          );
          setIaqData({ iaqIndexes, timestamps });
        } else {
          console.error("No data found.");
        }
      } catch (error) {
        console.error("Error fetching IAQ data:", error);
      }
    };

    fetchIAQData();
  }, []);

  const filterData = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const filtered = iaqData.timestamps
      .map((timestamp, index) => {
        const currentTimestamp = new Date(timestamp);
        if (currentTimestamp >= start && currentTimestamp <= end) {
          return { timestamp, iaqIndex: iaqData.iaqIndexes[index] };
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
    const filteredIaqIndexes = filtered.map((item) => item.iaqIndex);

    setFilteredData({ iaqIndexes: filteredIaqIndexes, timestamps: filteredTimestamps });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const sortedData = filteredData.iaqIndexes.length > 0 ? filteredData : iaqData;

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
        type: "category",
        categories: sortedData.timestamps.map((timestamp) =>
          new Date(timestamp).toLocaleString([], {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        ),
      },
    },
    series: [
      {
        name: "IAQ Index",
        data: sortedData.iaqIndexes,
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
        <Chart options={data.options} series={data.series} type="line" />
      </div>

      <span>Last 24 hours</span>

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

export default CO2Card;
