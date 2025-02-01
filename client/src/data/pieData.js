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

    // Initialize data for Good and Bad classifications
    const indoorAirGoodRooms = new Set();
    const indoorAirBadRooms = new Set();
    const indoorAirGoodData = [];
    const indoorAirBadData = [];

    const tempGoodRooms = new Set();
    const tempBadRooms = new Set();
    const tempGoodData = [];
    const tempBadData = [];

    const lightingGoodRooms = new Set();
    const lightingBadRooms = new Set();
    const lightingGoodData = [];
    const lightingBadData = [];

    // Categorize rooms based on Good/Bad status and store only the most recent data
    readouts.forEach((item) => {
      const { classroom, indoorAir, temp, lightRemarks, IAQIndex, temperature, lighting } = item;

      // Indoor Air categorization
      if (indoorAir === "Good" && !indoorAirGoodRooms.has(classroom)) {
        indoorAirGoodRooms.add(classroom);
        indoorAirGoodData.push({ classroom, data: IAQIndex }); // Store latest IAQIndex for "Good"
      } else if (indoorAir === "Bad" && !indoorAirBadRooms.has(classroom)) {
        indoorAirBadRooms.add(classroom);
        indoorAirBadData.push({ classroom, data: IAQIndex }); // Store latest IAQIndex for "Bad"
      }

      // Temperature categorization
      if (temp === "Good" && !tempGoodRooms.has(classroom)) {
        tempGoodRooms.add(classroom);
        tempGoodData.push({ classroom, data: temperature }); // Store latest temperature for "Good"
      } else if (temp === "Bad" && !tempBadRooms.has(classroom)) {
        tempBadRooms.add(classroom);
        tempBadData.push({ classroom, data: temperature }); // Store latest temperature for "Bad"
      }

      // Lighting categorization
      if (lightRemarks === "Good" && !lightingGoodRooms.has(classroom)) {
        lightingGoodRooms.add(classroom);
        lightingGoodData.push({ classroom, data: lighting }); // Store latest lighting value for "Good"
      } else if (lightRemarks === "Bad" && !lightingBadRooms.has(classroom)) {
        lightingBadRooms.add(classroom);
        lightingBadData.push({ classroom, data: lighting }); // Store latest lighting value for "Bad"
      }
    });

    // Generate indoorAir pie data with only the most recent IAQ value in the id field for each room
    indoorAirPieData = [
      {
        id: indoorAirGoodData.map(room => `${room.classroom}: ${room.data}`).join("\n"), // Using newline for separation
        label: `Good: ${indoorAirGoodRooms.size}`,
        value: indoorAirGoodRooms.size,
        color: "hsl(120, 70%, 50%)", // Green for "Good"
      },
      {
        id: indoorAirBadData.map(room => `${room.classroom}: ${room.data}`).join("\n"), // Using newline for separation
        label: `Bad: ${indoorAirBadRooms.size}`,
        value: indoorAirBadRooms.size,
        color: "hsl(0, 70%, 50%)", // Red for "Bad"
      },
    ];

    // Generate temperature pie data with only the most recent temperature value in the id field for each room
    temperaturePieData = [
      {
        id: tempGoodData.map(room => `${room.classroom}: ${room.data}`).join("\n"), // Using newline for separation
        label: `Good: ${tempGoodRooms.size}`,
        value: tempGoodRooms.size,
        color: "hsl(120, 70%, 50%)", // Green for "Good"
      },
      {
        id: tempBadData.map(room => `${room.classroom}: ${room.data}`).join("\n"), // Using newline for separation
        label: `Bad: ${tempBadRooms.size}`,
        value: tempBadRooms.size,
        color: "hsl(0, 70%, 50%)", // Red for "Bad"
      },
    ];

    // Generate lighting pie data with only the most recent lighting value in the id field for each room
    lightingPieData = [
      {
        id: lightingGoodData.map(room => `${room.classroom}: ${room.data}`).join("\n"), // Using newline for separation
        label: `Good: ${lightingGoodRooms.size}`,
        value: lightingGoodRooms.size,
        color: "hsl(120, 70%, 50%)", // Green for "Good"
      },
      {
        id: lightingBadData.map(room => `${room.classroom}: ${room.data}`).join("\n"), // Using newline for separation
        label: `Bad: ${lightingBadRooms.size}`,
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

// Function to fetch and categorize VOG pie data (keeping this as you requested)
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
