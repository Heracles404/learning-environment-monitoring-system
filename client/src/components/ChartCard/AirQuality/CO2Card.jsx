import React, { useState, useEffect } from "react";
import "./CO2Card.css";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import { httpGetAllReadouts } from "../../../hooks/sensors.requests.js";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";

// Utility function to generate a random color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const CO2Card = (props) => {
  const [iaqData, setIaqData] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]); // State to store selected rooms

  useEffect(() => {
    const fetchIAQData = async () => {
      try {
        const response = await httpGetAllReadouts();

        if (response && response.length > 0) {
          const roomData = response.reduce((acc, item) => {
            const room = item.classroom;
            if (!acc[room]) {
              acc[room] = { iaqIndexes: [], timestamps: [] };
            }
            acc[room].iaqIndexes.push(item.IAQIndex);
            acc[room].timestamps.push(new Date(`${item.date} ${item.time}`).getTime());
            return acc;
          }, {});

          setIaqData(roomData);
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
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(23, 59, 59, 999);

    const filtered = Object.keys(iaqData).reduce((acc, room) => {
      if (selectedRooms.length === 0 || selectedRooms.includes(room)) {
        const filteredRoomData = iaqData[room].timestamps
          .map((timestamp, index) =>
            timestamp >= start && timestamp <= end ? { timestamp, iaqIndex: iaqData[room].iaqIndexes[index] } : null
          )
          .filter(Boolean);

        if (filteredRoomData.length > 0) {
          acc[room] = {
            iaqIndexes: filteredRoomData.map((item) => item.iaqIndex),
            timestamps: filteredRoomData.map((item) => item.timestamp),
          };
        }
      }
      return acc;
    }, {});

    setFilteredData(filtered);
    setOpenDialog(Object.keys(filtered).length === 0);
  };

  const sortedData = Object.keys(filteredData).length > 0 ? filteredData : iaqData;

  const seriesData = Object.keys(sortedData).map((room) => {
    const roomData = sortedData[room];
    if (!roomData || roomData.iaqIndexes.length === 0 || roomData.timestamps.length === 0) {
      return null; // Skip empty room data
    }
    return {
      name: `Room ${room}`,
      data: roomData.timestamps.map((timestamp, index) => ({
        x: timestamp,
        y: roomData.iaqIndexes[index],
      })),
    };
  }).filter(Boolean); // Filter out any null or undefined series

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
        colors: Object.keys(sortedData).map(() => getRandomColor()),
        type: "gradient",
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: "smooth",
        colors: Object.keys(sortedData).map(() => getRandomColor()),
      },
      tooltip: {
        x: { format: "dd/MM/yy HH:mm" },
      },
      grid: { show: true },
      xaxis: {
        type: "datetime",
        categories: Object.values(sortedData).flatMap((data) =>
          data.timestamps.map((timestamp) => new Date(timestamp).toISOString())
        ),
      },
      yaxis: {
        title: {
          text: "IAQ Index",
        },
      },
      legend: {
        show: false, // This removes the legends
      },
    },
    series: seriesData,
  };

  const handleRoomChange = (event) => {
    setSelectedRooms(event.target.value);
  };

  return (
    <motion.div className="ExpandedCard" style={{ background: props.color.backGround, boxShadow: props.color.boxShadow }}>
      <span>{props.title}</span>

      <div className="filters" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <TextField
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ width: "140px" }}
          />
          <TextField
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: startDate }}
            style={{ width: "140px" }}
          />
          {/* Room filter */}
          <FormControl variant="outlined" margin="normal" style={{ minWidth: 100, width: 140 }}>
            <InputLabel htmlFor="roomSelect" style={{ fontSize: "0.9rem" }}>Select Rooms</InputLabel>
            <Select
              multiple
              value={selectedRooms}
              onChange={handleRoomChange}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    width: 140,
                  },
                },
              }}
              inputProps={{ id: "roomSelect" }}
              label="Select Rooms"
              style={{ fontSize: "0.9rem", padding: "5px", height: "40px" }}
            >
              {Object.keys(iaqData).map((room) => (
                <MenuItem key={room} value={room}>
                  <Checkbox checked={selectedRooms.indexOf(room) > -1} />
                  <ListItemText primary={`Room ${room}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button onClick={filterData} variant="contained" color="primary" style={{ height: "40px" }}>
            Filter
          </Button>
        </div>
      </div>

      <div className="chartContainer" style={{ marginTop: "20px" }}>
        <Chart options={data.options} series={data.series} type="area" />
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>No Data Found</DialogTitle>
        <DialogContent>
          <p style={{ fontSize: "1.2rem" }}>No data detected for the selected date range and room(s).</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary" style={{ fontSize: "1.1rem" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default CO2Card;
