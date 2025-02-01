import { useState, useEffect } from "react";
import { httpGetAllReadouts } from "../hooks/vog.requests"; // Importing the correct hook for VOG
import { httpGetAllReadouts as httpGetSensorData } from "../hooks/sensors.requests"; // Adjust this import based on your sensor hook location

// Declare the data arrays for each pie chart
export let indoorAirPieData = [];
export let temperaturePieData = [];
export let lightingPieData = [];
export let vogPieData = [];

// Function to fetch and categorize pie data for indoorAir, temp, lighting, and VOG levels
export const fetchPieData = async () => {
  try {
    const readouts = await httpGetSensorData(); // Fetch sensor data for indoor air, temperature, and lighting

    // Categorize indoorAir data
    const indoorAirGoodRooms = new Set();
    const indoorAirBadRooms = new Set();
    readouts.forEach((item) => {
      const { classroom, indoorAir } = item;
      if (indoorAir === "Good") {
        indoorAirGoodRooms.add(classroom);
      } else if (indoorAir === "Bad") {
        indoorAirBadRooms.add(classroom);
      }
    });

    // Generate indoorAir pie data
    indoorAirPieData = [
      {
        id: "Good",
        label: "Good",
        value: indoorAirGoodRooms.size,
        color: "hsl(120, 70%, 50%)", // Green for "Good"
      },
      {
        id: "Bad",
        label: "Bad",
        value: indoorAirBadRooms.size,
        color: "hsl(0, 70%, 50%)", // Red for "Bad"
      },
    ];

    // Categorize temperature data
    const tempGoodRooms = new Set();
    const tempBadRooms = new Set();
    readouts.forEach((item) => {
      const { classroom, temp } = item;
      if (temp === "Good") {
        tempGoodRooms.add(classroom);
      } else if (temp === "Bad") {
        tempBadRooms.add(classroom);
      }
    });

    // Generate temperature pie data
    temperaturePieData = [
      {
        id: "Good",
        label: "Good",
        value: tempGoodRooms.size,
        color: "hsl(120, 70%, 50%)", // Green for "Good"
      },
      {
        id: "Bad",
        label: "Bad",
        value: tempBadRooms.size,
        color: "hsl(0, 70%, 50%)", // Red for "Bad"
      },
    ];

    // Categorize lighting data
    const lightingGoodRooms = new Set();
    const lightingBadRooms = new Set();
    readouts.forEach((item) => {
      const { classroom, lightRemarks } = item;
      if (lightRemarks === "Good") {
        lightingGoodRooms.add(classroom);
      } else if (lightRemarks === "Bad") {
        lightingBadRooms.add(classroom);
      }
    });

    // Generate lighting pie data
    lightingPieData = [
      {
        id: "Good",
        label: "Good",
        value: lightingGoodRooms.size,
        color: "hsl(120, 70%, 50%)", // Green for "Good"
      },
      {
        id: "Bad",
        label: "Bad",
        value: lightingBadRooms.size,
        color: "hsl(0, 70%, 50%)", // Red for "Bad"
      },
    ];

    console.log("Indoor Air Pie Data:", indoorAirPieData);
    console.log("Temperature Pie Data:", temperaturePieData);
    console.log("Lighting Pie Data:", lightingPieData);
    
    // Fetch VOG data
    fetchVogPieData();

  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
};

// Function to fetch and categorize VOG pie data
const fetchVogPieData = async () => {
  try {
    const readouts = await httpGetAllReadouts(); // Fetch VOG sensor data

    // Count occurrences of each level
    const levelCounts = [0, 0, 0, 0, 0];

    readouts.forEach((item) => {
      const { level } = item;
      if (level >= 0 && level <= 4) {
        levelCounts[level] += 1;
      }
    });

    // Determine the most frequent VOG level
    const maxLevel = levelCounts.indexOf(Math.max(...levelCounts));

    // Generate VOG pie data: retain all levels but display 1 only for the majority level
    vogPieData = Array.from({ length: 5 }, (_, i) => ({
      id: `Level ${i}`,
      label: `Level ${i}`,
      value: i === maxLevel ? 1 : 0, // Show 1 only for the most frequent level, 0 for others
      color: i === 0 ? "hsl(120, 70%, 50%)" : "hsl(0, 70%, 50%)", // Green for Level 0, Red for others
      tooltip: `Level ${i}: ${levelCounts[i]} readings`, // Tooltip on hover
    }));

    console.log("VOG Pie Data (Legends Retained, Fixed Display):", vogPieData);

  } catch (error) {
    console.error("Error fetching or processing VOG data:", error);
  }
};



// Call the fetch function on module load
fetchPieData();
