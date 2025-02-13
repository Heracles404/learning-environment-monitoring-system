import React, { useState, useEffect } from "react";
import "./VolcanicSmogCard.css";
import { motion, LayoutGroup } from "framer-motion";
import Chart from "react-apexcharts";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { httpGetAllReadouts } from "../../../hooks/sensors.requests.js";

const VolcanicSmogCard = (props) => {
  return (
    <LayoutGroup>
      <ExpandedCard param={props} />
    </LayoutGroup>
  );
};

function ExpandedCard({ param }) {
  const [vocData, setVocData] = useState({ vocLevels: [], timestamps: [] });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState({ vocLevels: [], timestamps: [] });
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
    const fetchVOCData = async () => {
      try {
        const response = await httpGetAllReadouts();

        if (response && response.length > 0) {
          const vocLevels = response.map((item) => item.voc);
          const timestamps = response.map((item) => new Date(`${item.date} ${item.time}`).getTime());

          setVocData({ vocLevels, timestamps });
        } else {
          console.error("No data found.");
        }
      } catch (error) {
        console.error("Error fetching VOC data:", error);
      }
    };

    fetchVOCData();
  }, []);

  const filterData = () => {
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(23, 59, 59, 999);

    const filtered = vocData.timestamps
      .map((timestamp, index) =>
        timestamp >= start && timestamp <= end ? { timestamp, vocLevel: vocData.vocLevels[index] } : null
      )
      .filter(Boolean);

    setFilteredData({
      vocLevels: filtered.map((item) => item.vocLevel),
      timestamps: filtered.map((item) => item.timestamp),
    });

    setOpenDialog(filtered.length === 0);
  };

  const sortedData = filteredData.vocLevels.length > 0 ? filteredData : vocData;

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
        colors: [getRandomColor()],
        type: "gradient",
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: "smooth",
        colors: [getRandomColor()],
      },
      tooltip: {
        x: { format: "dd/MM/yy HH:mm" },
      },
      grid: { show: true },
      xaxis: {
        type: "datetime",
        categories: sortedData.timestamps.map((_, index) =>
          new Date(Date.now() - (sortedData.vocLevels.length - index) * 1000 * 60 * 60).toISOString()
        ),
      },
      yaxis: {
        title: {
          text: "VOC Level",
        },
      },
      annotations: {
        yaxis: [
          {
            y: 400,
            borderColor: "#008000",
            label: {
              borderColor: "#008000",
              style: {
                color: "#fff",
                background: "#008000",
              },
              text: "Good",
            },
          },
          {
            y: 300,
            borderColor: "#FF0000",
            label: {
              borderColor: "#FF0000",
              style: {
                color: "#fff",
                background: "#FF0000",
              },
              text: "Bad",
            },
          },
        ],
      },
    },
    series: [{ name: "VOC Level", data: sortedData.vocLevels }],
  };
  

  return (
    <motion.div className="ExpandedCard" style={{ background: param.color.backGround, boxShadow: param.color.boxShadow }} layoutId={`expandableCard-${param.title}`}>
      <span>{param.title}</span>

      <div className="date-filter">
        <TextField type="date" label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField type="date" label="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: startDate }} />
        <Button onClick={filterData} variant="contained" color="primary">
          Filter
        </Button>
      </div>

      <div className="chartContainer">
        <Chart options={data.options} series={data.series} type="area" />
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>No Data Found</DialogTitle>
        <DialogContent>
          <p style={{ fontSize: "1.2rem" }}>No data detected for the selected date range.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary" style={{ fontSize: "1.1rem" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}

export default VolcanicSmogCard;
