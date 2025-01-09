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

import axios from "axios";

// Function to fetch real-time data
const fetchData = async (key) => {
  try {
    const response = await axios.get("http://localhost:8000/sensors", {
      headers: { "Cache-Control": "no-cache" }, // Disable caching
    });

    // Map data to the required key
    const data = response.data.map((item) => item[key]);
    return data;
  } catch (error) {
    console.error(`Error fetching ${key} data:`, error);
    return []; // Return an empty array on error
  }
};

// Cards Data
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
        name: "Air Quality",
        data: await fetchData("IAQIndex"),
      },
    ],
  },
  {
    title: "Temperature",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 80,
    value: "BAD",
    png: DeviceThermostatIcon,
    series: [
      {
        name: "Temperature",
        data: await fetchData("temperature"),
      },
    ],
  },
  {
    title: "Light",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 60,
    value: "GOOD",
    png: WbIncandescentIcon,
    series: [
      {
        name: "Light",
        data: await fetchData("lighting"),
      },
    ],
  },
  {
    title: "Volcanic Smog",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 60,
    value: "GOOD",
    png: VolcanoIcon,
    series: [
      {
        name: "Volcanic Smog",
        data: await fetchData("voc"),
      },
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
    png: UilUsdSquare, // Use the imported icon
    series: [
      {
        name: "CO2 Levels",
        data: await fetchData("CO2"),
      },
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
    png: UilUsdSquare, // Use the imported icon
    series: [
      {
        name: "Heat Index",
        data: await fetchData("heatIndex"),
      },
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
    png: UilUsdSquare, // Use the imported icon
    series: [
      {
        name: "Lighting",
        data: await fetchData("lighting"),
      },
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
    png: UilUsdSquare, // Use the imported icon
    series: [
      {
        name: "Volcanic Smog",
        data: await fetchData("voc"),
      },
    ],
  },
];
