import React, { useState, useEffect } from "react";
import "./CO2Card.css";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import { httpGetAllReadouts } from "../../../hooks/sensors.requests.js";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";

const CO2Card = (props) => {
  const [iaqData, setIaqData] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState({});
  const [selectedRooms, setSelectedRooms] = useState([]);

  useEffect(() => {
    const fetchIAQData = async () => {
      try {
        const response = await httpGetAllReadouts();
        if (response && response.length > 0) {
          const roomData = response.reduce((acc, item) => {
            const room = item.classroom;
            if (!acc[room]) {
              acc[room] = { iaqIndexes: [], timestamps: [], formattedTimestamps: [] };
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

            acc[room].iaqIndexes.push(item.IAQIndex);
            acc[room].timestamps.push(timestamp);
            acc[room].formattedTimestamps.push(`${dateString} ${formattedTime}`); // Combine date and time for the tooltip
            return acc;
          }, {});
          setIaqData(roomData);
          setFilteredData(roomData);
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
            timestamp >= start && timestamp <= end
              ? { timestamp, iaqIndex: iaqData[room].iaqIndexes[index], formattedTimestamp: iaqData[room].formattedTimestamps[index] }
              : null
          )
          .filter(Boolean);

        if (filteredRoomData.length > 0) {
          acc[room] = {
            iaqIndexes: filteredRoomData.map((item) => item.iaqIndex),
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
    setFilteredData(iaqData);
  };

  const sortedData = Object.keys(filteredData).length > 0 ? filteredData : iaqData;

  const seriesData = Object.keys(sortedData)
    .map((room) => {
      const roomData = sortedData[room];
      if (!roomData || roomData.iaqIndexes.length === 0 || roomData.timestamps.length === 0) {
        return null;
      }
      return {
        name: `Room ${room}`,
        data: roomData.timestamps.map((timestamp, index) => ({
          x: timestamp,
          y: roomData.iaqIndexes[index],
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
              y: 100, // Threshold Level 1
              borderColor: 'red',
              label: {
                borderColor: 'red',
                style: {
                  color: '#fff',
                  background: 'red',
                },
                text: 'Bad',
              },
            },
            {
              y: 50, // Threshold Level 2
              borderColor: 'green',
              label: {
                borderColor: 'green',
                style: {
                  color: '#fff',
                  background: 'green',
                },
                text: 'Good',
              },
            },
          ],
        },
        legend: { show: false }, // This removes the legend
      },
      series: seriesData,
    };
    

  return (
    <motion.div className="ExpandedCard" style={{ background: props.color.backGround, boxShadow: props.color.boxShadow }}>
      <span>{props.title}</span>
      <div className="filters" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <TextField type="date" label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} style={{ width: "140px" }} />
          <TextField type="date" label="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: startDate }} style={{ width: "140px" }} />
          <FormControl variant="outlined" margin="normal" style={{ minWidth: 200, width: 140 }}>
            <InputLabel htmlFor="roomSelect">Select Rooms</InputLabel>
            <Select multiple value={selectedRooms} onChange={(e) => setSelectedRooms(e.target.value)} renderValue={(selected) => selected.join(", ")}>
              {Object.keys(iaqData).map((room) => (
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

export default CO2Card;
