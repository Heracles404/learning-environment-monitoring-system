import React, { useState, useEffect } from "react";
import "./HeatIndexCard.css";
import { motion, LayoutGroup } from "framer-motion";
import Chart from "react-apexcharts";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
} from "@mui/material";
import { httpGetAllReadouts } from "../../../hooks/sensors.requests.js";

const HeatIndexCard = (props) => {
  return (
    <LayoutGroup>
      <ExpandedCard param={props} />
    </LayoutGroup>
  );
};

function ExpandedCard({ param }) {
  const [heatIndexData, setHeatIndexData] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Fetch and preprocess data on mount
  useEffect(() => {
    const fetchHeatIndexData = async () => {
      try {
        const response = await httpGetAllReadouts();
        if (response && response.length > 0) {
          const roomData = response.reduce((acc, item) => {
            const room = item.classroom;
            if (!acc[room]) {
              acc[room] = { heatIndexLevels: [], timestamps: [], formattedTimestamps: [] };
            }

            const dateString = item.date || new Date().toISOString().split("T")[0];
            const timeString = item.time || "00:00:00";
            const parsedDate = new Date(`${dateString} ${timeString}`);
            const timestamp = parsedDate.getTime();

            acc[room].heatIndexLevels.push({ timestamp, heatIndex: item.heatIndex });

            return acc;
          }, {});

          // Sort and format data
          Object.keys(roomData).forEach((room) => {
            roomData[room].heatIndexLevels.sort((a, b) => a.timestamp - b.timestamp);

            roomData[room] = {
              heatIndexLevels: roomData[room].heatIndexLevels.map((d) => d.heatIndex),
              timestamps: roomData[room].heatIndexLevels.map((d) => d.timestamp),
              formattedTimestamps: roomData[room].heatIndexLevels.map((d) =>
                new Date(d.timestamp).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              ),
            };
          });

          setHeatIndexData(roomData);
          setFilteredData(roomData);
        } else {
          console.error("No data found.");
        }
      } catch (error) {
        console.error("Error fetching heat index data:", error);
      }
    };

    fetchHeatIndexData();
  }, []);

  // Auto filter data whenever filters change
  useEffect(() => {
    if (!startDate && !endDate && selectedRooms.length === 0) {
      setFilteredData(heatIndexData);
      setOpenDialog(false);
      return;
    }

    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : Number.NEGATIVE_INFINITY;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : Number.POSITIVE_INFINITY;

    const filtered = Object.keys(heatIndexData).reduce((acc, room) => {
      if (selectedRooms.length === 0 || selectedRooms.includes(room)) {
        const filteredRoomData = heatIndexData[room].timestamps
          .map((timestamp, index) =>
            timestamp >= start && timestamp <= end
              ? {
                  timestamp,
                  heatIndexLevel: heatIndexData[room].heatIndexLevels[index],
                  formattedTimestamp: heatIndexData[room].formattedTimestamps[index],
                }
              : null
          )
          .filter(Boolean);

        if (filteredRoomData.length > 0) {
          acc[room] = {
            heatIndexLevels: filteredRoomData.map((item) => item.heatIndexLevel),
            timestamps: filteredRoomData.map((item) => item.timestamp),
            formattedTimestamps: filteredRoomData.map((item) => item.formattedTimestamp),
          };
        }
      }
      return acc;
    }, {});

    setFilteredData(filtered);

    setOpenDialog(Object.keys(filtered).length === 0);
  }, [startDate, endDate, selectedRooms, heatIndexData]);

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedRooms([]);
    setFilteredData(heatIndexData);
    setOpenDialog(false);
  };

  const sortedData = Object.keys(filteredData).length > 0 ? filteredData : heatIndexData;

  const seriesData = Object.keys(sortedData)
    .map((room) => {
      const roomData = sortedData[room];
      if (!roomData || roomData.heatIndexLevels.length === 0 || roomData.timestamps.length === 0) {
        return null;
      }
      return {
        name: `Room ${room}`,
        data: roomData.timestamps.map((timestamp, index) => ({
          x: timestamp,
          y: roomData.heatIndexLevels[index],
        })),
      };
    })
    .filter(Boolean);

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
        x: {
          formatter: function (value, { dataPointIndex, seriesIndex }) {
            const roomKey = Object.keys(sortedData)[seriesIndex];
            return sortedData[roomKey]?.formattedTimestamps?.[dataPointIndex] || "Unknown";
          },
        },
      },
      grid: { show: true },
      xaxis: {
        type: "datetime",
        categories: Object.values(sortedData).flatMap((data) =>
          data.timestamps.map((timestamp) => new Date(timestamp).toISOString())
        ),
      },
      annotations: {
        yaxis: [
          {
            y: 27,
            borderColor: "green",
            label: {
              borderColor: "green",
              style: {
                color: "#fff",
                background: "green",
              },
              text: "Good",
            },
          },
          {
            y: 41,
            borderColor: "red",
            label: {
              borderColor: "red",
              style: {
                color: "#fff",
                background: "red",
              },
              text: "Bad",
            },
          },
        ],
      },
      legend: {
        show: false,
      },
    },
    series: seriesData,
  };

  const handleRoomChange = (event) => {
    setSelectedRooms(event.target.value);
  };

  return (
    <motion.div
      className="ExpandedCard"
      style={{ background: param.color.backGround, boxShadow: param.color.boxShadow }}
      layoutId={`expandableCard-${param.title}`}
    >
      <span>{param.title}</span>

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

          <FormControl variant="outlined" margin="normal" style={{ minWidth: 200, width: 140 }}>
            <InputLabel htmlFor="roomSelect" style={{ fontSize: "0.9rem" }}>
              Select Rooms
            </InputLabel>
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
              style={{
                fontSize: "0.9rem",
                padding: "5px",
                height: "40px",
              }}
            >
              {Object.keys(heatIndexData).map((room) => (
                <MenuItem key={room} value={room}>
                  <Checkbox checked={selectedRooms.indexOf(room) > -1} />
                  <ListItemText primary={`Room ${room}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button onClick={clearFilters} variant="contained" color="primary" style={{ height: "40px" }}>
            Clear Filters
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
}

export default HeatIndexCard;
