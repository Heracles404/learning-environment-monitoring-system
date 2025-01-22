import { useState, useEffect } from "react";
import { httpGetAllReadouts } from "../hooks/sensors.requests"; // Adjust path to your hook

// Declare the data array
export let indoorAirPieData = []; 
export let temperaturePieData = []; 
export let lightingPieData = []; 

// Function to fetch and categorize pie data for indoorAir, temp, and lighting
export const fetchPieData = async () => {
  try {
    const readouts = await httpGetAllReadouts(); // Fetch sensor data

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
        value: indoorAirGoodRooms.size, // Total number of rooms with "Good" remark
        color: "hsl(120, 70%, 50%)", // Green for "Good"
      },
      {
        id: "Bad",
        label: "Bad",
        value: indoorAirBadRooms.size, // Total number of rooms with "Bad" remark
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
        value: tempGoodRooms.size, // Total number of rooms with "Good" remark
        color: "hsl(120, 70%, 50%)", // Green for "Good"
      },
      {
        id: "Bad",
        label: "Bad",
        value: tempBadRooms.size, // Total number of rooms with "Bad" remark
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
        value: lightingGoodRooms.size, // Total number of rooms with "Good" remark
        color: "hsl(120, 70%, 50%)", // Green for "Good"
      },
      {
        id: "Bad",
        label: "Bad",
        value: lightingBadRooms.size, // Total number of rooms with "Bad" remark
        color: "hsl(0, 70%, 50%)", // Red for "Bad"
      },
    ];

    console.log("Indoor Air Pie Data:", indoorAirPieData);
    console.log("Temperature Pie Data:", temperaturePieData);
    console.log("Lighting Pie Data:", lightingPieData);
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
};

// Call the fetch function on module load
fetchPieData();
