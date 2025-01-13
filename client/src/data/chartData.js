// Sidebar imports
import {
  UilUsdSquare,
} from "@iconscout/react-unicons";

import AirIcon from "@mui/icons-material/Air";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import WbIncandescentIcon from "@mui/icons-material/WbIncandescent";
import VolcanoIcon from "@mui/icons-material/Volcano";

import { httpGetAllReadouts } from "../hooks/sensors.requests.js";
import { httpGetAllDevices } from "../hooks/devices.requests";

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const fetchData = async (key) => {
  try {
    const response = await httpGetAllReadouts(); 
    console.log("check sensor response:", response)
    // Map data to the required key
    const data = response.map((item) => item[key]);
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
    data: await fetchData("IAQIndex"), // Fetch air quality index data
    color: getRandomColor(), // Random color for each classroom
  })));

  return airQualitySeries;
};

const airQualityData = await fetchAirQualityData()

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
    barValue: 80,
    value: "HOT",
    png: DeviceThermostatIcon,
    series: [
      {
        name: "Room 1 Temperature",
        data: await fetchData("temperature"),
        color: "#FF5733", // Red line color for Room 1
      }
    ],
  },
  {
    title: "Light",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 60,
    value: "BRIGHT",
    png: WbIncandescentIcon,
    series: [
      {
        name: "Room 1 Light",
        data: await fetchData("lighting"),
        color: "#FF5733", // Red line color for Room 1
      },
      {
        name: "Room 2 Light",
        data: await fetchData("lighting"), // Hardcoded sample data
        color: "#33FF57", // Green line color for Room 2
      },
      // {
      //   name: "Room 3 Light",
      //   data: [110, 120, 130, 140, 150, 160, 170], // Hardcoded sample data
      //   color: "#3357FF", // Blue line color for Room 3
      // },
      // {
      //   name: "Room 4 Light",
      //   data: [100, 110, 120, 130, 140, 150, 160], // Hardcoded sample data
      //   color: "#FF33A1", // Pink line color for Room 4
      // },
    ],
  },
  {
    title: "Volcanic Smog",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 50,
    value: "SAFE",
    png: VolcanoIcon,
    series: [
      {
        name: "Room 1 Volcanic Smog",
        data: await fetchData("voc"),
        color: "#FF5733", // Red line color for Room 1
      },
      {
        name: "Room 2 Volcanic Smog",
        data: await fetchData("voc"), // Hardcoded sample data
        color: "#33FF57", // Green line color for Room 2
      },
      // {
      //   name: "Room 3 Volcanic Smog",
      //   data: [55, 60, 65, 70, 75, 80, 85], // Hardcoded sample data
      //   color: "#3357FF", // Blue line color for Room 3
      // },
      // {
      //   name: "Room 4 Volcanic Smog",
      //   data: [50, 55, 60, 65, 70, 75, 80], // Hardcoded sample data
      //   color: "#FF33A1", // Pink line color for Room 4
      // },
    ],
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
    series: [
      {
        name: "Room 1 CO2 Levels",
        data: await fetchData("CO2"),
        color: "#FF5733", // Red line color for Room 1
      },
      {
        name: "Room 2 CO2 Levels",
        data: await fetchData("CO2"), // Hardcoded sample data
        color: "#33FF57", // Green line color for Room 2
      },
      // {
      //   name: "Room 3 CO2 Levels",
      //   data: [390, 400, 410, 420, 430, 440, 450], // Hardcoded sample data
      //   color: "#3357FF", // Blue line color for Room 3
      // },
      // {
      //   name: "Room 4 CO2 Levels",
      //   data: [380, 390, 400, 410, 420, 430, 440], // Hardcoded sample data
      //   color: "#FF33A1", // Pink line color for Room 4
      // },
    ],
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
    series: [
      {
        name: "Room 1 Heat Index",
        data: await fetchData("heatIndex"),
        color: "#FF5733", // Red line color for Room 1
      },
      {
        name: "Room 2 Heat Index",
        data: [35, 36, 37, 38, 39, 40, 41], // Hardcoded sample data
        color: "#33FF57", // Green line color for Room 2
      },
      // {
      //   name: "Room 3 Heat Index",
      //   data: [34, 35, 36, 37, 38, 39, 40], // Hardcoded sample data
      //   color: "#3357FF", // Blue line color for Room 3
      // },
      // {
      //   name: "Room 4 Heat Index",
      //   data: [33, 34, 35, 36, 37, 38, 39], // Hardcoded sample data
      //   color: "#FF33A1", // Pink line color for Room 4
      // },
    ],
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
    series: [
      {
        name: "Room 1 Lighting",
        data: await fetchData("lighting"),
        color: "#FF5733", // Red line color for Room 1
      },
      {
        name: "Room 2 Lighting",
        data: [60, 70, 75, 80, 90, 95, 100], // Hardcoded sample data
        color: "#33FF57", // Green line color for Room 2
      },
      // {
      //   name: "Room 3 Lighting",
      //   data: [50, 60, 70, 80, 90, 100, 110], // Hardcoded sample data
      //   color: "#3357FF", // Blue line color for Room 3
      // },
      // {
      //   name: "Room 4 Lighting",
      //   data: [40, 50, 60, 70, 80, 90, 100], // Hardcoded sample data
      //   color: "#FF33A1", // Pink line color for Room 4
      // },
    ],
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
      // {
      //   name: "Room 3 Volcanic Smog",
      //   data: [45, 50, 55, 60, 65, 70, 75], // Hardcoded sample data
      //   color: "#3357FF", // Blue line color for Room 3
      // },
      // {
      //   name: "Room 4 Volcanic Smog",
      //   data: [40, 45, 50, 55, 60, 65, 70], // Hardcoded sample data
      //   color: "#FF33A1", // Pink line color for Room 4
      // },
    ],
  },
];
