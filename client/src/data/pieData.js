// Importing the correct hook for fetching sensor data
import { httpGetAllReadouts as httpGetSensorData } from "../hooks/sensors.requests"; 

// Declare the data arrays for each pie chart
export let indoorAirPieData = [];
export let HeatIndexPieData = [];
export let lightingPieData = [];
export let vogPieData = [];
export let indoorAirPieWithData = [];
export let HeatIndexPieDataWithData = [];
export let lightingPieDataWithData = [];

// Function to fetch and categorize pie data for indoor air, heat index, and lighting
export const fetchPieData = async () => {
  try {
    const readouts = await httpGetSensorData(); // Fetch sensor data

    // Initialize data storage for latest status per room
    const roomStatus = {};

    // Iterate over sensor data and update the latest reading per room
    readouts.forEach((item) => {
      const { classroom, indoorAir, temp, lightRemarks, IAQIndex, heatIndex, lighting } = item;

      if (!roomStatus[classroom]) {
        roomStatus[classroom] = {
          indoorAir: null,
          temp: null,
          lightRemarks: null,
          IAQIndex: null,
          heatIndex: null,
          lighting: null,
        };
      }

      // Always update to the latest data for each room
      roomStatus[classroom] = {
        indoorAir,
        temp,
        lightRemarks,
        IAQIndex,
        heatIndex,
        lighting,
      };
    });

    // Process categorized data for Good/Bad classifications
    const indoorAirGoodData = [];
    const indoorAirBadData = [];
    const heatGoodData = [];
    const heatBadData = [];
    const lightingGoodData = [];
    const lightingBadData = [];

    // Iterate through the latest data per room and categorize
    Object.keys(roomStatus).forEach((room) => {
      const { IAQIndex, heatIndex, lighting } = roomStatus[room];

      // Ensure "BAD" for values below 5
      const IAQStatus = IAQIndex < 100 ? "GOOD" : "BAD";
      const heatStatus = heatIndex >= 27 && heatIndex <= 32 ? "GOOD" : "BAD";
      const lightingStatus = lighting >= 300 && lighting <= 500 ? "GOOD" : "BAD";


      if (IAQStatus === "GOOD") {
        indoorAirGoodData.push({ classroom: room, data: IAQIndex });
      } else {
        indoorAirBadData.push({ classroom: room, data: IAQIndex });
      }

      if (heatStatus === "GOOD") {
        heatGoodData.push({ classroom: room, data: heatIndex });
      } else {
        heatBadData.push({ classroom: room, data: heatIndex });
      }

      if (lightingStatus === "GOOD") {
        lightingGoodData.push({ classroom: room, data: lighting });
      } else {
        lightingBadData.push({ classroom: room, data: lighting });
      }
    });

    // Generate pie data with latest values for indoor air
    indoorAirPieWithData = [
      {
        id: indoorAirGoodData.map((room) => `Room ${room.classroom}: ${room.data} IAQ`).join("\n"),
        label: `Good: ${indoorAirGoodData.length}`,
        value: indoorAirGoodData.length,
        color: "hsl(120, 70%, 50%)",
      },
      {
        id: indoorAirBadData.map((room) => `Room ${room.classroom}: ${room.data} IAQ`).join("\n"),
        label: `Bad: ${indoorAirBadData.length}`,
        value: indoorAirBadData.length,
        color: "hsl(0, 70%, 50%)",
      },
    ];

    // Generate pie data for heat index
    HeatIndexPieDataWithData = [
      {
        id: heatGoodData.map((room) => `Room ${room.classroom}: ${room.data} °C`).join("\n"),
        label: `Good: ${heatGoodData.length}`,
        value: heatGoodData.length,
        color: "hsl(120, 70%, 50%)",
      },
      {
        id: heatBadData.map((room) => `Room ${room.classroom}: ${room.data} °C`).join("\n"),
        label: `Bad: ${heatBadData.length}`,
        value: heatBadData.length,
        color: "hsl(0, 70%, 50%)",
      },
    ];

    // Generate pie data for lighting
    lightingPieDataWithData = [
      {
        id: lightingGoodData.map((room) => `Room ${room.classroom}: ${room.data} lx`).join("\n"),
        label: `Good: ${lightingGoodData.length}`,
        value: lightingGoodData.length,
        color: "hsl(120, 70%, 50%)",
      },
      {
        id: lightingBadData.map((room) => `Room ${room.classroom}: ${room.data} lx`).join("\n"),
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

    HeatIndexPieData = [
      { id: "Good", label: `Good: ${heatGoodData.length}`, value: heatGoodData.length, color: "hsl(120, 70%, 50%)" },
      { id: "Bad", label: `Bad: ${heatBadData.length}`, value: heatBadData.length, color: "hsl(0, 70%, 50%)" },
    ];

    lightingPieData = [
      { id: "Good", label: `Good: ${lightingGoodData.length}`, value: lightingGoodData.length, color: "hsl(120, 70%, 50%)" },
      { id: "Bad", label: `Bad: ${lightingBadData.length}`, value: lightingBadData.length, color: "hsl(0, 70%, 50%)" },
    ];

    console.log("Updated Indoor Air Pie Data:", indoorAirPieData);
    console.log("Updated Heat Index Pie Data:", HeatIndexPieData);
    console.log("Updated Lighting Pie Data:", lightingPieData);
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
};

// Call the fetch function on module load
fetchPieData();
