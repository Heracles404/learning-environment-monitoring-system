// Sidebar imports
import {
  UilUsdSquare,
} from "@iconscout/react-unicons";

import AirIcon from "@mui/icons-material/Air";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import WbIncandescentIcon from "@mui/icons-material/WbIncandescent";
import VolcanoIcon from "@mui/icons-material/Volcano";

import { httpGetAllReadouts as getAllSensorReadouts } from "../hooks/sensors.requests.js";
import { httpGetAllReadouts as getAllVogReadouts } from "../hooks/vog.requests.js";
import { httpGetAllDevices } from "../hooks/devices.requests";

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const fetchData = async (key, deviceId) => {
  try {
    const response = await getAllSensorReadouts();
    console.log("check sensor response:", response);
    // Filter data for the specific device
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

// Function to fetch devices and construct air quality data
const fetchAirQualityData = async () => {
  const devices = await httpGetAllDevices(); // Fetch all devices
  const activeDevices = devices.filter(device => device.status === "active"); // Filter for active devices

  const airQualitySeries = await Promise.all(activeDevices.map(async (device) => ({
    name: `${device.classroom} Air Quality`, // Use the classroom name from the device
    data: await fetchData("IAQIndex", device.classroom), // Pass classroom ID
    color: getRandomColor(), // Random color for each classroom
  })));

  return airQualitySeries;
};


const fetchTempData = async () => {
  const devices = await httpGetAllDevices(); // Fetch all devices
  const activeDevices = devices.filter(device => device.status === "active"); // Filter for active devices

  const TemperatureSeries = await Promise.all(activeDevices.map(async (device) => ({
    name: `${device.classroom} Temperature`, // Use the classroom name from the device
    data: await fetchData("temperature", device.classroom), // Pass classroom ID
    color: getRandomColor(), // Random color for each classroom
  })));

  return TemperatureSeries;
};

const fetchLightData = async () => {
  const devices = await httpGetAllDevices(); // Fetch all devices
  const activeDevices = devices.filter(device => device.status === "active"); // Filter for active devices

  const LightSeries = await Promise.all(activeDevices.map(async (device) => ({
    name: `${device.classroom} Light`, // Use the classroom name from the device
    data: await fetchData("lighting", device.classroom), // Pass classroom ID
    color: getRandomColor(), // Random color for each classroom
  })));

  return LightSeries;
};

const LightData = await fetchLightData()
const airQualityData = await fetchAirQualityData()
const TemperatureData = await fetchTempData()

const fetchVOGData = async () => {
  try {
    const response = await getAllVogReadouts(); // Fetch VOG data
    console.log("check VOG response:", response);

    // Map the response to the required format
    const VOGSeries = [
      {
        name: "PM2.5",
        data: response.pm25 ? [response.pm25] : [], // Ensure data is an array
        color: "#FF5733",
      },
      {
        name: "PM10",
        data: response.pm10 ? [response.pm10] : [], // Ensure data is an array
        color: "#33FF57",
      },
    ];

    return VOGSeries;
  } catch (error) {
    console.error("Error fetching VOG data:", error);
    return []; // Return an empty array on error
  }
};

const VOGData = await fetchVOGData();

export const CardsData = [
  {
    title: "Air Quality",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70, // You can adjust this based on your logic
    value: "BAD", // You can adjust this based on your logic
    png: AirIcon,
    series: airQualityData, // Use the dynamically fetched air quality data
  },

  {
    title: "Temperature",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70, // You can adjust this based on your logic
    value: "BAD", // You can adjust this based on your logic
    png: DeviceThermostatIcon,
    series: TemperatureData, // Use the dynamically fetched air quality data
  },

  {
    title: "Light",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70, // You can adjust this based on your logic
    value: "BAD", // You can adjust this based on your logic
    png: WbIncandescentIcon,
    series: LightData, // Use the dynamically fetched air quality data
  },
  {
    title: "VOG",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70, // You can adjust this based on your logic
    value: "BAD", // You can adjust this based on your logic
    png: VolcanoIcon,
    series: VOGData, // Use the dynamically fetched VOG data
  },
];

// CO2 Cards Data
export const CO2Data = [
  {
    title: "CO2 Levels",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    png: UilUsdSquare,
    series: airQualityData,
  },
];

// HeatIndex Cards Data
export const HeatIndexData = [
  {
    title: "Heat Index",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    png: UilUsdSquare,
    series: TemperatureData
  },
];

// Lighting Cards Data
export const LightingData = [
  {
    title: "Lighting",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    png: UilUsdSquare,
    series: LightData
  },
];

// Volcanic Smog Cards Data
export const VolcanicSmogData = [
  {
    title: "Volcanic Smog",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    png: UilUsdSquare,
    series: [
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

    ],
  },
];
