// Sidebar imports
import{
    UilEstate,
    UilClipboardAlt,
    UilUsersAlt,
    UilPackage,
    UilChart,
    UilSignOutAlt,
    UilUsdSquare,
    UilMoneyWithdrawal
} from "@iconscout/react-unicons";

// Analytics Cards Data
export const CardsData = [
  {
    title: "Air Quality",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70,
    value: "Bad",
    png: UilClipboardAlt,
    series: [
      {
        name: "Air Quality",
        data: [31, 40, 28, 51, 42, 109, 100],
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
    value: "Bad",
    png: UilClipboardAlt,
    series: [
      {
        name: "Temperature",
        data: [10, 100, 50, 70, 80, 30, 40],
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
    value: "Good",
    png: UilClipboardAlt,
    series: [
      {
        name: "Light",
        data: [10, 25, 15, 30, 12, 15, 20],
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
    value: "Good",
    png: UilClipboardAlt,
    series: [
      {
        name: "Light",
        data: [10, 25, 15, 30, 12, 15, 20],
      },
    ],
  },
];

// CO2 Cards Data
export const CO2Data = [
  {
    title: "Air Quality",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    png: UilUsdSquare,  // Use the imported icon
    series: [
      {
        name: "Air Quality",
        data: [1, 5, 16, 20, 4, 26, 14, 2],
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
    png: UilUsdSquare,  // Use the imported icon
    series: [
      {
        name: "Heat Index",
        data: [10, 20, 30, 40, 50, 60, 70, 80],
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
    png: UilUsdSquare,  // Use the imported icon
    series: [
      {
        name: "Lighting",
        data: [100, 150, 200, 250, 300, 350, 400, 450],
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
    png: UilUsdSquare,  // Use the imported icon
    series: [
      {
        name: "Volcanic Smog",
        data: [5, 10, 15, 20, 25, 30, 35, 40],
      },
    ],
  },
];
