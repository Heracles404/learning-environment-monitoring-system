import {
  UilUsdSquare,
} from "@iconscout/react-unicons";

import AirIcon from "@mui/icons-material/Air";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import WbIncandescentIcon from "@mui/icons-material/WbIncandescent";
import VolcanoIcon from "@mui/icons-material/Volcano";

import { httpGetAllReadouts as getAllSensorReadouts } from "../hooks/sensors.requests.js";
import { httpGetAllDevices } from "../hooks/devices.requests";

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
    // console.log("check sensor response:", response);

    // Filter data for the specific classroom
    const data = response
      .filter(item => item.classroom === deviceId) // Filter by classroom ID
      .map(item => item[key]);
    // console.log("check sensor data:", data);
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
    // console.log(`Air Quality Data for ${device.classroom}:`, data); // Log the fetched data
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

// Fetch Volcanic Smog Data (VOC)
const fetchVolcanicSmogData = async () => {
  const devices = await httpGetAllDevices();
  const activeDevices = devices.filter(device => device.status === "active");

  const volcanicSmogSeries = await Promise.all(activeDevices.map(async (device) => {
    const data = await fetchData("voc", device.classroom);
    // console.log(`Volcanic Smog Data for ${device.classroom}:`, data); // Log the fetched data
    return {
      name: `${device.classroom} Volcanic Smog`,
      data: data.length > 0 ? data : [0], // Ensure there's data to display
      color: getRandomColor(),
    };
  }));

  return volcanicSmogSeries;
};

// Fetch all data
const LightData = await fetchLightData();
const airQualityData = await fetchAirQualityData();
const TemperatureData = await fetchTempData();
const volcanicSmogData = await fetchVolcanicSmogData();

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
    series: getUniqueSeries(volcanicSmogData), // Deduplicate volcanic smog data
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
    series: getUniqueSeries(volcanicSmogData),
  },
];
