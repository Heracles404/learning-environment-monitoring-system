// Sidebar imports
import {
  UilUsdSquare,
} from "@iconscout/react-unicons";

import AirIcon from "@mui/icons-material/Air";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import WbIncandescentIcon from "@mui/icons-material/WbIncandescent";
import VolcanoIcon from "@mui/icons-material/Volcano";

import { httpGetAllReadouts as getAllSensorReadouts } from "../hooks/sensors.requests.js";
import { httpGetAllDevices } from "../hooks/devices.requests";
import { httpGetAllReadouts } from "../hooks/vog.requests.js"; // Import the VOG requests

// Get random color for chart series
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Function to fetch sensor data for specific classrooms
const fetchData = async (key, deviceId) => {
  try {
    const response = await getAllSensorReadouts();
    console.log("check sensor response:", response);

    // Filter data for the specific classroom
    const data = response
      .filter(item => item.classroom === deviceId) // Filter by classroom ID
      .map(item => item[key]);
    console.log("check sensor data:", data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${key} data:`, error);
    return []; // Return an empty array on error
  }
};

// Fetch Air Quality Data
const fetchAirQualityData = async () => {
  const devices = await httpGetAllDevices();
  const activeDevices = devices.filter(device => device.status === "active");

  const airQualitySeries = await Promise.all(activeDevices.map(async (device) => {
    const data = await fetchData("IAQIndex", device.classroom);
    console.log(`Air Quality Data for ${device.classroom}:`, data); // Log the fetched data
    return {
      name: `${device.classroom} Air Quality`,
      data: data.length > 0 ? data : [0], // Ensure there's data to display
      color: getRandomColor(),
    };
  }));

  return airQualitySeries;
};

// Fetch Temperature Data
const fetchTempData = async () => {
  const devices = await httpGetAllDevices();
  const activeDevices = devices.filter(device => device.status === "active");

  const TemperatureSeries = await Promise.all(activeDevices.map(async (device) => ({
    name: `${device.classroom} Temperature`,
    data: await fetchData("temperature", device.classroom),
    color: getRandomColor(),
  })));

  return TemperatureSeries;
};

// Fetch Lighting Data
const fetchLightData = async () => {
  const devices = await httpGetAllDevices();
  const activeDevices = devices.filter(device => device.status === "active");

  const LightSeries = await Promise.all(activeDevices.map(async (device) => ({
    name: `${device.classroom} Light`,
    data: await fetchData("lighting", device.classroom),
    color: getRandomColor(),
  })));

  return LightSeries;
};

// Fetch PM10 Data
const fetchPM10Data = async () => {
  try {
    const response = await httpGetAllReadouts();
    console.log("check PM10 response:", response);

    // Extract PM10 data
    const pm10Data = response.map(item => item.pm10);
    console.log("check PM10 data:", pm10Data);
    return pm10Data;
  } catch (error) {
    console.error("Error fetching PM10 data:", error);
    return []; // Return an empty array on error
  }
};

// Fetch PM2.5 Data
const fetchPM25Data = async () => {
  try {
    const response = await httpGetAllReadouts();
    console.log("check PM2.5 response:", response);

    // Extract PM2.5 data
    const pm25Data = response.map(item => item.pm25);
    console.log("check PM2.5 data:", pm25Data);
    return pm25Data;
  } catch (error) {
    console.error("Error fetching PM2.5 data:", error);
    return []; // Return an empty array on error
  }
};

// Fetch all data
const LightData = await fetchLightData();
const airQualityData = await fetchAirQualityData();
const TemperatureData = await fetchTempData();
const PM10Data = await fetchPM10Data();
const PM25Data = await fetchPM25Data();

// Cards Data with deduplication
const getUniqueSeries = (series) => {
  const seen = new Set();
  return series.filter(item => {
    const isDuplicate = seen.has(item.name);
    seen.add(item.name);
    return !isDuplicate;
  });
};

export const CardsData = [
  {
    title: "Air Quality",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)", // Fixed gradient
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70,
    value: "BAD",
    png: AirIcon,
    series: getUniqueSeries(airQualityData), // Deduplicate series
  },

  {
    title: "Temperature",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70,
    value: "BAD",
    png: DeviceThermostatIcon,
    series: getUniqueSeries(TemperatureData), // Deduplicate series
  },

  {
    title: "Light",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70,
    value: "BAD",
    png: WbIncandescentIcon,
    series: getUniqueSeries(LightData), // Deduplicate series
  },
  {
    title: "Volcanic Smog",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70,
    value: "BAD",
    png: VolcanoIcon,
    series: getUniqueSeries([ // Deduplicate PM2.5 and PM10 data
      {
        name: "PM2.5",
        data: PM25Data,
        color: "#FF5733", // Red line color for PM2.5
      },
      {
        name: "PM10",
        data: PM10Data,
        color: "#33FF57", // Green line color for PM10
      },
    ]),
  },
];

// Export other data with deduplication
export const CO2Data = [
  {
    title: "CO2 Levels",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    png: UilUsdSquare,
    series: getUniqueSeries(airQualityData),
  },
];

export const HeatIndexData = [
  {
    title: "Heat Index",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    png: UilUsdSquare,
    series: getUniqueSeries(TemperatureData),
  },
];

export const LightingData = [
  {
    title: "Lighting",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    png: UilUsdSquare,
    series: getUniqueSeries(LightData),
  },
];

export const VolcanicSmogData = [
  {
    title: "Volcanic Smog",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    png: UilUsdSquare,
    series: getUniqueSeries([
      {
        name: "Room 1 Volcanic Smog",
        data: await fetchData("voc"),
        color: "#FF5733", // Red line color for Room 1
      },
      {
        name: "Room 2 Volcanic Smog",
        data: [50, 55, 60, 65, 70, 75, 80], // Hardcoded sample data
        color: "#33FF57", // Green line color for Room 2
      },
    ]),
  },
];
