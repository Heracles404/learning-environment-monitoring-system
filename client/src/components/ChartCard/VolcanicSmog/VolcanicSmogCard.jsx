import React, { useState, useEffect } from "react";
import "./VolcanicSmogCard.css";
import { motion, LayoutGroup } from "framer-motion";
import Chart from "react-apexcharts";
import { httpGetAllReadouts } from "../../../hooks/sensors.requests.js";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"; // Material UI components for date selection

const VolcanicSmogCard = (props) => {
  return (
    <LayoutGroup>
      <ExpandedCard param={props} />
    </LayoutGroup>
  );
};

function ExpandedCard({ param }) {
  const [vocData, setVocData] = useState({ vocValues: [], timestamps: [] });
  const [startDate, setStartDate] = useState(""); // Start date for filtering
  const [endDate, setEndDate] = useState(""); // End date for filtering
  const [filteredData, setFilteredData] = useState({ vocValues: [], timestamps: [] });
  const [noDataFound, setNoDataFound] = useState(false); // State for no data found prompt
  const [openDialog, setOpenDialog] = useState(false); // State for controlling the dialog visibility

  useEffect(() => {
    const fetchVOCData = async () => {
      try {
        // Fetch data using the hook
        const response = await httpGetAllReadouts();

        if (response && response.length > 0) {
          // Process the fetched data
          const vocValues = response.map((item) => item.voc);
          const timestamps = response.map((item) =>
            new Date(`${item.date} ${item.time}`).getTime()
          );

          // Update the state with fetched data
          setVocData({ vocValues, timestamps });
        } else {
          console.error("No data found.");
        }
      } catch (error) {
        console.error("Error fetching VOC data:", error);
      }
    };

    fetchVOCData();
  }, []); // Empty dependency array to fetch data on mount

  // Filter data based on the selected date range
  const filterData = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Normalize the start and end date to the beginning and end of the day
    start.setHours(0, 0, 0, 0); // Set to 00:00:00 for the start date
    end.setHours(23, 59, 59, 999); // Set to 23:59:59 for the end date

    const filtered = vocData.timestamps
      .map((timestamp, index) => {
        const currentTimestamp = new Date(timestamp);
        // Check if the timestamp is within the range (start and end inclusive)
        if (currentTimestamp >= start && currentTimestamp <= end) {
          return { timestamp, voc: vocData.vocValues[index] };
        }
        return null;
      })
      .filter(item => item !== null);

    // Check if there is no data found and show prompt
    if (filtered.length === 0) {
      setNoDataFound(true);
      setOpenDialog(true); // Open the modal dialog when no data is found
    } else {
      setNoDataFound(false);
    }

    // Update filtered data
    const filteredTimestamps = filtered.map(item => item.timestamp);
    const filteredVocValues = filtered.map(item => item.voc);

    setFilteredData({ vocValues: filteredVocValues, timestamps: filteredTimestamps });
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Ensure the timestamps are unique and ordered
  const sortedData = filteredData.vocValues.length > 0 ? filteredData : vocData;

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
        colors: ["#800020"],
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
        type: "category", // Use 'category' instead of 'datetime' to allow more flexible handling
        categories: sortedData.timestamps.map((timestamp) => new Date(timestamp).toLocaleString()), // Map the timestamp into categories
      },
    },
    series: [
      {
        name: "VOC",
        data: sortedData.timestamps.map((timestamp, index) => sortedData.vocValues[index]),
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

      {/* Date filter inputs */}
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
          // Disable dates before the selected start date
          inputProps={{
            min: startDate, // Ensure end date is greater than or equal to start date
          }}
        />
        <Button onClick={filterData} variant="contained" color="primary">
          Filter
        </Button>
      </div>

      {/* Chart */}
      <div className="chartContainer">
        <Chart options={data.options} series={data.series} type="line" />
      </div>

      <span>Last 24 hours</span>

      {/* Dialog for no data found */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>No Data Found</DialogTitle>
        <DialogContent>
          <p style={{ fontSize: '1.2rem' }}>No data detected for the selected date range.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" style={{ fontSize: '1.1rem' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}

export default VolcanicSmogCard;
