import React, { useState, useEffect } from "react";
import "./VolcanicSmogCard.css";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import { httpGetAllReadouts } from "../../../hooks/vog.requests.js";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";

const VolcanicSmogCard = (props) => {
  const [airData, setAirData] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState({});
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedPollutants, setSelectedPollutants] = useState(["pm25", "pm10"]);

  useEffect(() => {
    const fetchAirData = async () => {
      try {
        const response = await httpGetAllReadouts();
        if (response && response.length > 0) {
          const roomData = response.reduce((acc, item) => {
            const room = item.classroom;
            if (!acc[room]) acc[room] = { readings: [] };

            const dateString = item.date || new Date().toISOString().split("T")[0];
            const localDate = new Date(`${dateString} ${item.time}`);
            const timestamp = localDate.getTime();

            acc[room].readings.push({
              timestamp,
              pm25: item.pm25,
              pm10: item.pm10,
            });

            return acc;
          }, {});

          Object.keys(roomData).forEach((room) => {
            roomData[room].readings.sort((a, b) => a.timestamp - b.timestamp);

            roomData[room] = {
              pm25Levels: roomData[room].readings.map((d) => d.pm25),
              pm10Levels: roomData[room].readings.map((d) => d.pm10),
              timestamps: roomData[room].readings.map((d) => d.timestamp),
              formattedTimestamps: roomData[room].readings.map((d) => {
                const dateObj = new Date(d.timestamp);
                return (
                  dateObj.toLocaleDateString() +
                  " " +
                  dateObj.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                );
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

  useEffect(() => {
    if (!Object.keys(airData).length) return;

    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    const filtered = Object.keys(airData).reduce((acc, room) => {
      if (selectedRooms.length === 0 || selectedRooms.includes(room)) {
        const filteredRoomData = airData[room].timestamps
          .map((timestamp, index) => {
            const isInDateRange =
              (start === null || timestamp >= start) &&
              (end === null || timestamp <= end);

            if (isInDateRange) {
              return {
                timestamp,
                pm25Level: airData[room].pm25Levels[index],
                pm10Level: airData[room].pm10Levels[index],
                formattedTimestamp: airData[room].formattedTimestamps[index],
              };
            }
            return null;
          })
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
  }, [startDate, endDate, selectedRooms, airData]);

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedRooms([]);
    setSelectedPollutants(["pm25", "pm10"]);
    setFilteredData(airData);
  };

  const sortedData = Object.keys(filteredData).length > 0 ? filteredData : airData;

  const seriesData = Object.keys(sortedData)
    .map((room) => {
      const roomData = sortedData[room];
      if (!roomData) return null;

      const series = [];

      if (selectedPollutants.includes("pm25") && roomData.pm25Levels.length > 0) {
        series.push({
          name: `Room ${room} PM2.5`,
          data: roomData.timestamps.map((timestamp, index) => ({
            x: timestamp,
            y: roomData.pm25Levels[index],
          })),
        });
      }

      if (selectedPollutants.includes("pm10") && roomData.pm10Levels.length > 0) {
        series.push({
          name: `Room ${room} PM10`,
          data: roomData.timestamps.map((timestamp, index) => ({
            x: timestamp,
            y: roomData.pm10Levels[index],
          })),
        });
      }

      return series;
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
          const roomIndex = Math.floor(seriesIndex / selectedPollutants.length);
          const roomKey = Object.keys(sortedData)[roomIndex];
          return sortedData[roomKey]?.formattedTimestamps?.[dataPointIndex] || "Unknown";
        },
      },
      y: {
        formatter: function (val) {
          return val?.toFixed ? val.toFixed(2) : val;
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val?.toFixed ? val.toFixed(2) : val;
        },
      },
    },
    annotations: {
      yaxis: [
        {
          y: 50,
          borderColor: "#70FFA2",
          label: {
            borderColor: "#70FFA2",
            style: { color: "#fff", background: "#70FFA2" },
            text: "Level 1",
          },
        },
        {
          y: 150,
          borderColor: "#FFC2C2",
          label: {
            borderColor: "#FFC2C2",
            style: { color: "#fff", background: "#FFC2C2" },
            text: "Level 2",
          },
        },
        {
          y: 250,
          borderColor: "#FF7070",
          label: {
            borderColor: "#FF7070",
            style: { color: "#fff", background: "#FF7070" },
            text: "Level 3",
          },
        },
        {
          y: 300,
          borderColor: "#FF1F1F",
          label: {
            borderColor: "#FF1F1F",
            style: { color: "#fff", background: "#FF1F1F" },
            text: "Level 4",
          },
        },
      ],
    },
    legend: { show: false },
  },
  series: seriesData,
};


  return (
    <motion.div
      className="ExpandedCard"
      style={{ background: props.color.backGround, boxShadow: props.color.boxShadow }}
    >
      <span>{props.title}</span>
      <div className="filters" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Room Selector */}
          <FormControl style={{ minWidth: 200 }}>
            <InputLabel>Device</InputLabel>
            <Select
              multiple
              value={selectedRooms}
              onChange={(e) => setSelectedRooms(e.target.value)}
              renderValue={(selected) => selected.join(", ")}
            >
              {Object.keys(airData).map((room) => (
                <MenuItem key={room} value={room}>
                  <Checkbox checked={selectedRooms.includes(room)} />
                  <ListItemText primary={`Room ${room}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Date Filters */}
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

          {/* Pollutant Selector */}
          <FormControl style={{ minWidth: 160 }}>
            <InputLabel>Pollutants</InputLabel>
            <Select
              multiple
              value={selectedPollutants}
              onChange={(e) => setSelectedPollutants(e.target.value)}
              renderValue={(selected) =>
                selected
                  .map((p) => (p === "pm25" ? "PM2.5" : "PM10"))
                  .join(", ")
              }
            >
              <MenuItem value="pm25">
                <Checkbox checked={selectedPollutants.includes("pm25")} />
                <ListItemText primary="PM2.5" />
              </MenuItem>
              <MenuItem value="pm10">
                <Checkbox checked={selectedPollutants.includes("pm10")} />
                <ListItemText primary="PM10" />
              </MenuItem>
            </Select>
          </FormControl>

          <Button onClick={clearFilters} variant="contained" color="primary">
            Clear Filters
          </Button>
        </div>
      </div>

      <div className="chartContainer" style={{ marginTop: "20px" }}>
        <Chart options={data.options} series={data.series} type="area" />
      </div>
    </motion.div>
  );
};

export default VolcanicSmogCard;
