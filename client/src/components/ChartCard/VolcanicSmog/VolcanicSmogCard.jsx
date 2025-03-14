import React, { useState, useEffect } from "react";
import "./VolcanicSmogCard.css";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import { httpGetAllReadouts } from "../../../hooks/vog.requests.js";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";

const VolcanicSmogCard = (props) => {
  const [airData, setAirData] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState({});
  const [selectedRooms, setSelectedRooms] = useState([]);

  useEffect(() => {
    const fetchAirData = async () => {
      try {
        const response = await httpGetAllReadouts();
        if (response && response.length > 0) {
          const roomData = response.reduce((acc, item) => {
            const room = item.classroom;
            if (!acc[room]) {
              acc[room] = { readings: [] };
            }

            const dateString = item.date ? item.date : new Date().toISOString().split("T")[0];
            const localDate = new Date(`${dateString} ${item.time}`);
            const timestamp = localDate.getTime();

            acc[room].readings.push({
              timestamp,
              pm25: item.pm25,
              pm10: item.pm10,
            });

            return acc;
          }, {});

          // Sort timestamps in ascending order for each room
          Object.keys(roomData).forEach((room) => {
            roomData[room].readings.sort((a, b) => a.timestamp - b.timestamp);

            roomData[room] = {
              pm25Levels: roomData[room].readings.map((d) => d.pm25),
              pm10Levels: roomData[room].readings.map((d) => d.pm10),
              timestamps: roomData[room].readings.map((d) => d.timestamp),
              formattedTimestamps: roomData[room].readings.map((d) => {
                const dateObj = new Date(d.timestamp);
                return dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });
              }),
            };
          });

          setAirData(roomData);
          setFilteredData(roomData);
        } else {
          console.error("No data found.");
        }
      } catch (error) {
        console.error("Error fetching air data:", error);
      }
    };
    fetchAirData();
  }, []);

  const filterData = () => {
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(23, 59, 59, 999);

    const filtered = Object.keys(airData).reduce((acc, room) => {
      if (selectedRooms.length === 0 || selectedRooms.includes(room)) {
        const filteredRoomData = airData[room].timestamps
          .map((timestamp, index) =>
            timestamp >= start && timestamp <= end
              ? {
                  timestamp,
                  pm25Level: airData[room].pm25Levels[index],
                  pm10Level: airData[room].pm10Levels[index],
                  formattedTimestamp: airData[room].formattedTimestamps[index],
                }
              : null
          )
          .filter(Boolean);

        if (filteredRoomData.length > 0) {
          acc[room] = {
            pm25Levels: filteredRoomData.map((item) => item.pm25Level),
            pm10Levels: filteredRoomData.map((item) => item.pm10Level),
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
    setFilteredData(airData);
  };

  const sortedData = Object.keys(filteredData).length > 0 ? filteredData : airData;

  const seriesData = Object.keys(sortedData)
    .map((room) => {
      const roomData = sortedData[room];
      if (!roomData || roomData.pm25Levels.length === 0 || roomData.pm10Levels.length === 0) {
        return null;
      }
      return [
        {
          name: `Room ${room} PM2.5`,
          data: roomData.timestamps.map((timestamp, index) => ({
            x: timestamp,
            y: roomData.pm25Levels[index],
          })),
        },
        {
          name: `Room ${room} PM10`,
          data: roomData.timestamps.map((timestamp, index) => ({
            x: timestamp,
            y: roomData.pm10Levels[index],
          })),
        },
      ];
    })
    .flat()
    .filter(Boolean);

  const data = {
    options: {
      chart: { type: "area" },
      xaxis: { type: "datetime" },
      dataLabels: { enabled: false },
      tooltip: {
        x: {
          formatter: function (value, { dataPointIndex, seriesIndex }) {
            const roomKey = Object.keys(sortedData)[Math.floor(seriesIndex / 2)];
            return sortedData[roomKey]?.formattedTimestamps?.[dataPointIndex] || "Unknown";
          },
        },
      },
      annotations: {
        yaxis: [
          { y: 50, borderColor: "#70FFA2", label: { borderColor: "#70FFA2", style: { color: "#fff", background: "#70FFA2" }, text: "Level 1" } },
          { y: 150, borderColor: "#FFC2C2", label: { borderColor: "#FFC2C2", style: { color: "#fff", background: "#FFC2C2" }, text: "Level 2" } },
          { y: 250, borderColor: "#FF7070", label: { borderColor: "#FF7070", style: { color: "#fff", background: "#FF7070" }, text: "Level 3" } },
          { y: 300, borderColor: "#FF1F1F", label: { borderColor: "#FF1F1F", style: { color: "#fff", background: "#FF1F1F" }, text: "Level 4" } },
        ],
      },
      legend: { show: false },
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
