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

    // Fetch VOG levels dynamically from the data
    const levelCounts = [0, 0, 0, 0, 0]; // Array to hold counts for each level (Level 0, Level 1, Level 2, Level 3, Level 4)

    // Count the rooms for each level
    readouts.forEach((item) => {
      const { level } = item; // Get the level from the item
      if (level >= 0 && level <= 4) {
        levelCounts[level] += 1;
      }
    });

    // Generate VOG pie data dynamically based on the counts
    vogPieData = [
      {
        id: "Level 0",
        label: "Level 0",
        value: levelCounts[0], 
        color: "hsl(120, 70%, 50%)", // Green
      },
      {
        id: "Level 1",
        label: "Level 1",
        value: levelCounts[1], 
        color: "hsl(120, 70%, 50%)", // Green
      },
      {
        id: "Level 2",
        label: "Level 2",
        value: levelCounts[2], 
        color: "hsl(0, 70%, 50%)", // Red
      },
      {
        id: "Level 3",
        label: "Level 3",
        value: levelCounts[3], 
        color: "hsl(0, 100%, 50%)", // Dark Red
      },
      {
        id: "Level 4",
        label: "Level 4",
        value: levelCounts[4], 
        color: "hsl(0, 70%, 50%)", // Red
      },
    ];

    console.log("VOG Pie Data:", vogPieData); // Display the dynamic VOG levels

  } catch (error) {
    console.error("Error fetching or processing VOG data:", error);
  }
};

// Call the fetch function on module load
fetchPieData();
