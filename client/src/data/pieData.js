import { httpGetAllReadouts } from "../hooks/vog.requests"; // Importing the correct hook for VOG
import { httpGetAllReadouts as httpGetSensorData } from "../hooks/sensors.requests"; // Adjust this import based on your sensor hook location

// Declare the data arrays for each pie chart
export let indoorAirPieData = [];
export let temperaturePieData = [];
export let lightingPieData = [];
export let vogPieData = [];
export let indoorAirPieWithData = [];
export let temperaturePieDataWithData = [];
export let lightingPieDataWithData = [];

// Function to fetch and categorize pie data for indoorAir, temp, and lighting
export const fetchPieData = async () => {
  try {
    const readouts = await httpGetSensorData(); // Fetch sensor data for indoor air, temperature, and lighting

    // Initialize data storage for latest status per room
    const roomStatus = {};

    // Iterate over sensor data and update the latest reading per room
    readouts.forEach((item) => {
      const { classroom, indoorAir, temp, lightRemarks, IAQIndex, temperature, lighting } = item;

      if (!roomStatus[classroom]) {
        roomStatus[classroom] = {
          indoorAir: null,
          temp: null,
          lightRemarks: null,
          IAQIndex: null,
          temperature: null,
          lighting: null,
        };
      }

      // Always update to the latest data for each room
      roomStatus[classroom] = {
        indoorAir,
        temp,
        lightRemarks,
        IAQIndex,
        temperature,
        lighting,
      };
    });

    // Process categorized data for Good/Bad classifications
    const indoorAirGoodData = [];
    const indoorAirBadData = [];
    const tempGoodData = [];
    const tempBadData = [];
    const lightingGoodData = [];
    const lightingBadData = [];

    // Iterate through the latest data per room and categorize
    Object.keys(roomStatus).forEach((room) => {
      const { indoorAir, temp, lightRemarks, IAQIndex, temperature, lighting } = roomStatus[room];

      if (indoorAir === "Good") {
        indoorAirGoodData.push({ classroom: room, data: IAQIndex });
      } else if (indoorAir === "Bad") {
        indoorAirBadData.push({ classroom: room, data: IAQIndex });
      }

      if (temp === "Good") {
        tempGoodData.push({ classroom: room, data: temperature });
      } else if (temp === "Bad") {
        tempBadData.push({ classroom: room, data: temperature });
      }

      if (lightRemarks === "Good") {
        lightingGoodData.push({ classroom: room, data: lighting });
      } else if (lightRemarks === "Bad") {
        lightingBadData.push({ classroom: room, data: lighting });
      }
    });

    // Generate indoorAir pie data with latest values
    indoorAirPieWithData = [
      {
        id: indoorAirGoodData.map((room) => `${room.classroom}: ${room.data}`).join("\n"),
        label: `Good: ${indoorAirGoodData.length}`,
        value: indoorAirGoodData.length,
        color: "hsl(120, 70%, 50%)",
      },
      {
        id: indoorAirBadData.map((room) => `${room.classroom}: ${room.data}`).join("\n"),
        label: `Bad: ${indoorAirBadData.length}`,
        value: indoorAirBadData.length,
        color: "hsl(0, 70%, 50%)",
      },
    ];

    temperaturePieDataWithData = [
      {
        id: tempGoodData.map((room) => `${room.classroom}: ${room.data}`).join("\n"),
        label: `Good: ${tempGoodData.length}`,
        value: tempGoodData.length,
        color: "hsl(120, 70%, 50%)",
      },
      {
        id: tempBadData.map((room) => `${room.classroom}: ${room.data}`).join("\n"),
        label: `Bad: ${tempBadData.length}`,
        value: tempBadData.length,
        color: "hsl(0, 70%, 50%)",
      },
    ];

    lightingPieDataWithData = [
      {
        id: lightingGoodData.map((room) => `${room.classroom}: ${room.data}`).join("\n"),
        label: `Good: ${lightingGoodData.length}`,
        value: lightingGoodData.length,
        color: "hsl(120, 70%, 50%)",
      },
      {
        id: lightingBadData.map((room) => `${room.classroom}: ${room.data}`).join("\n"),
        label: `Bad: ${lightingBadData.length}`,
        value: lightingBadData.length,
        color: "hsl(0, 70%, 50%)",
      },
    ];

    // Generate simplified pie data for display (Good/Bad count only)
    indoorAirPieData = [
      { id: "Good", label: `Good: ${indoorAirGoodData.length}`, value: indoorAirGoodData.length, color: "hsl(120, 70%, 50%)" },
      { id: "Bad", label: `Bad: ${indoorAirBadData.length}`, value: indoorAirBadData.length, color: "hsl(0, 70%, 50%)" },
    ];

    temperaturePieData = [
      { id: "Good", label: `Good: ${tempGoodData.length}`, value: tempGoodData.length, color: "hsl(120, 70%, 50%)" },
      { id: "Bad", label: `Bad: ${tempBadData.length}`, value: tempBadData.length, color: "hsl(0, 70%, 50%)" },
    ];

    lightingPieData = [
      { id: "Good", label: `Good: ${lightingGoodData.length}`, value: lightingGoodData.length, color: "hsl(120, 70%, 50%)" },
      { id: "Bad", label: `Bad: ${lightingBadData.length}`, value: lightingBadData.length, color: "hsl(0, 70%, 50%)" },
    ];

    console.log("Updated Indoor Air Pie Data:", indoorAirPieData);
    console.log("Updated Temperature Pie Data:", temperaturePieData);
    console.log("Updated Lighting Pie Data:", lightingPieData);

    // Fetch VOG data (unchanged)
    fetchVogPieData();
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
};

// Function to fetch and categorize VOG pie data (UNCHANGED)
const fetchVogPieData = async () => {
  try {
    const readouts = await httpGetAllReadouts(); // Fetch VOG sensor data

    const levelCounts = [0, 0, 0, 0, 0];

    readouts.forEach((item) => {
      const { level } = item;
      if (level >= 0 && level <= 4) {
        levelCounts[level] += 1;
      }
    });

    const maxLevel = levelCounts.indexOf(Math.max(...levelCounts));

    vogPieData = Array.from({ length: 5 }, (_, i) => ({
      id: `Level ${i}`,
      label: `Level ${i}`,
      value: i === maxLevel ? 1 : 0,
      color: i === 0 ? "hsl(120, 70%, 50%)" : "hsl(0, 70%, 50%)",
      tooltip: `Level ${i}: ${levelCounts[i]} readings`,
    }));

    console.log("VOG Pie Data:", vogPieData);
  } catch (error) {
    console.error("Error fetching or processing VOG data:", error);
  }
};

// Call the fetch function on module load
fetchPieData();
