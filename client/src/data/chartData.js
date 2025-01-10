// Sidebar imports
import {
  UilEstate,
  UilClipboardAlt,
  UilUsersAlt,
  UilPackage,
  UilChart,
  UilSignOutAlt,
  UilUsdSquare,
  UilMoneyWithdrawal,
} from "@iconscout/react-unicons";

import AirIcon from "@mui/icons-material/Air";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import WbIncandescentIcon from "@mui/icons-material/WbIncandescent";
import VolcanoIcon from "@mui/icons-material/Volcano";

import { httpGetAllReadouts } from "../hooks/sensors.requests.js";



// Function to fetch real-time data
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

// Sample data
const classroomData = await fetchData("IAQIndex").classroom;
console.log("ito", classroomData);

// Append "Room" to each classroom name
// const updatedClassroomData = classroomData.map(classroom => classroom + " Room");

// console.log(updatedClassroomData);

// Cards Data with line colors for each room
export const CardsData = [
  {
    title: "Air Quality",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70,
    value: "BAD",
    png: AirIcon,
    series: [
      {
        name: "Room 1 Air Quality",
        data: await fetchData("IAQIndex"),
        color: "#FF5733", // Red line color for Room 1
      },
      {
        name: "Room 2 Air Quality",
        data: await fetchData("IAQIndex"), // Hardcoded sample data
        color: "#33FF57", // Green line color for Room 2
      },
      // {
      //   name: "Room 3 Air Quality",
      //   data: [70, 75, 80, 85, 90, 95, 100], // Hardcoded sample data
      //   color: "#3357FF", // Blue line color for Room 3
      // },
      // {
      //   name: "Room 4 Air Quality",
      //   data: [60, 65, 70, 75, 80, 85, 90], // Hardcoded sample data
      //   color: "#FF33A1", // Pink line color for Room 4
      // },
    ],
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
      },
      {
        name: "Room 2 Temperature",
        data: await fetchData("temperature"), // Hardcoded sample data
        color: "#33FF57", // Green line color for Room 2
      },
      // {
      //   name: "Room 3 Temperature",
      //   data: [28, 29, 30, 31, 32, 33, 34], // Hardcoded sample data
      //   color: "#3357FF", // Blue line color for Room 3
      // },
      // {
      //   name: "Room 4 Temperature",
      //   data: [25, 26, 27, 28, 29, 30, 31], // Hardcoded sample data
      //   color: "#FF33A1", // Pink line color for Room 4
      // },
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
