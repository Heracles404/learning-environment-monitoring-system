import React, { useState, useEffect } from "react";
import "./VolcanicSmogCard.css";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import { httpGetAllReadouts } from "../../../hooks/sensors.requests.js";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";

const VolcanicSmogCard = (props) => {
  const [vocData, setVocData] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState({});
  const [selectedRooms, setSelectedRooms] = useState([]);

  useEffect(() => {
    const fetchVOCData = async () => {
      try {
        const response = await httpGetAllReadouts();
        if (response && response.length > 0) {
          const roomData = response.reduce((acc, item) => {
            const room = item.classroom;
            if (!acc[room]) {
              acc[room] = { vocLevels: [], timestamps: [], formattedTimestamps: [] };
            }

            // Keep the date intact, but handle the time properly
            const dateString = item.date ? item.date : new Date().toISOString().split('T')[0];
            let timeString = item.time; // Example: "02:55 PM"
            
            // Convert 12-hour format time to 24-hour format and build the Date object
            const localDate = new Date(`${dateString} ${timeString}`);
            
            // Reformat to 12-hour AM/PM (ensures consistency)
            const formattedTime = localDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });

            // Correct timestamp conversion for UTC (without altering the date)
            const timestamp = localDate.getTime() - localDate.getTimezoneOffset() * 60000; // Convert to UTC

            acc[room].vocLevels.push(item.voc);
            acc[room].timestamps.push(timestamp);
            acc[room].formattedTimestamps.push(`${dateString} ${formattedTime}`); // Combine date and time for the tooltip
            return acc;
          }, {});          
          setVocData(roomData);
          setFilteredData(roomData);
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

    const filtered = Object.keys(vocData).reduce((acc, room) => {
      if (selectedRooms.length === 0 || selectedRooms.includes(room)) {
        const filteredRoomData = vocData[room].timestamps
          .map((timestamp, index) =>
            timestamp >= start && timestamp <= end
              ? { timestamp, vocLevel: vocData[room].vocLevels[index], formattedTimestamp: vocData[room].formattedTimestamps[index] }
              : null
          )
          .filter(Boolean);

        if (filteredRoomData.length > 0) {
          acc[room] = {
            vocLevels: filteredRoomData.map((item) => item.vocLevel),
            timestamps: filteredRoomData.map((item) => item.timestamp),
            formattedTimestamps: filteredRoomData.map((item) => item.formattedTimestamp),
          };
        }
      }
      return acc;
    }, {});

    setFilteredData(filtered);
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedRooms([]);
    setFilteredData(vocData);
  };

  const sortedData = Object.keys(filteredData).length > 0 ? filteredData : vocData;

  const seriesData = Object.keys(sortedData)
    .map((room) => {
      const roomData = sortedData[room];
      if (!roomData || roomData.vocLevels.length === 0 || roomData.timestamps.length === 0) {
        return null;
      }
      return {
        name: `Room ${room}`,
        data: roomData.timestamps.map((timestamp, index) => ({
          x: timestamp,
          y: roomData.vocLevels[index],
        })),
      };
    })
    .filter(Boolean);

  const data = {
    options: {
      chart: { type: "area" },
      xaxis: { type: "datetime" },
      dataLabels: { enabled: false },
      tooltip: {
        x: {
          formatter: function (value, { dataPointIndex, seriesIndex }) {
            const roomKey = Object.keys(sortedData)[seriesIndex];
            return sortedData[roomKey]?.formattedTimestamps?.[dataPointIndex] || "Unknown";
          },
        },
      },
      annotations: {
        yaxis: [
          {
            y: 50, // Threshold Level 1
            borderColor: '#70FFA2',
            label: {
              borderColor: '#70FFA2',
              style: {
                color: '#fff',
                background: '#70FFA2',
              },
              text: 'Level 1',
            },
          },
          {
            y: 150, // Threshold Level 2
            borderColor: '#FFC2C2',
            label: {
              borderColor: '#FFC2C2',
              style: {
                color: '#fff',
                background: '#FFC2C2',
              },
              text: 'Level 2',
            },
          },
          {
            y: 250, // Threshold Level 2
            borderColor: '#FF7070',
            label: {
              borderColor: '#FF7070',
              style: {
                color: '#fff',
                background: '#FF7070',
              },
              text: 'Level 3',
            },
          },
          {
            y: 300, // Threshold Level 2
            borderColor: '#FF1F1F',
            label: {
              borderColor: '#FF1F1F',
              style: {
                color: '#fff',
                background: '#FF1F1F',
              },
              text: 'Level 4',
            },
          },
        ],
      },
    },
    series: seriesData,
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
          <FormControl variant="outlined" margin="normal" style={{ minWidth: 100, width: 140 }}>
            <InputLabel htmlFor="roomSelect">Select Rooms</InputLabel>
            <Select multiple value={selectedRooms} onChange={(e) => setSelectedRooms(e.target.value)} renderValue={(selected) => selected.join(", ")}>
              {Object.keys(vocData).map((room) => (
                <MenuItem key={room} value={room}>
                  <Checkbox checked={selectedRooms.includes(room)} />
                  <ListItemText primary={`Room ${room}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={filterData} variant="contained" color="primary">Filter</Button>
          <Button onClick={clearFilters} variant="contained" color="primary">Clear Filters</Button>
        </div>
      </div>
      <div className="chartContainer" style={{ marginTop: "20px" }}>
        <Chart options={data.options} series={data.series} type="area" />
      </div>
    </motion.div>
  );
};

export default VolcanicSmogCard;
