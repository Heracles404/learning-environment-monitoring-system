// import { httpGetAllReadouts } from "../hooks/vog.requests"; // Importing the correct hook for VOG
import { httpGetAllReadouts as httpGetSensorData } from "../hooks/sensors.requests"; // Adjust this import based on your sensor hook location

// Declare the data arrays for each pie chart
export let indoorAirPieData = [];
export let HeatIndexPieData = [];
export let lightingPieData = [];
export let vogPieData = [];
export let indoorAirPieWithData = [];
export let HeatIndexPieDataWithData = [];
export let lightingPieDataWithData = [];

// Function to fetch and categorize pie data for indoorAir, temp, and lighting
export const fetchPieData = async () => {
  try {
    const readouts = await httpGetSensorData(); // Fetch sensor data for indoor air, temperature, and lighting

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
      const { indoorAir, temp, lightRemarks, IAQIndex, heatIndex, lighting } = roomStatus[room];

      if (indoorAir === "GOOD") {
        indoorAirGoodData.push({ classroom: room, data: IAQIndex });
      } else if (indoorAir === "BAD") {
        indoorAirBadData.push({ classroom: room, data: IAQIndex });
      }

      if (temp === "GOOD") {
        heatGoodData.push({ classroom: room, data: heatIndex });
      } else if (temp === "BAD") {
        heatBadData.push({ classroom: room, data: heatIndex });
      }

      if (lightRemarks === "GOOD") {
        lightingGoodData.push({ classroom: room, data: lighting });
      } else if (lightRemarks === "BAD") {
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

    HeatIndexPieDataWithData = [
      {
        id: heatGoodData.map((room) => `${room.classroom}: ${room.data}`).join("\n"),
        label: `Good: ${heatGoodData.length}`,
        value: heatGoodData.length,
        color: "hsl(120, 70%, 50%)",
      },
      {
        id: heatBadData.map((room) => `${room.classroom}: ${room.data}`).join("\n"),
        label: `Bad: ${heatBadData.length}`,
        value: heatBadData.length,
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

    HeatIndexPieData = [
      { id: "Good", label: `Good: ${heatGoodData.length}`, value: heatGoodData.length, color: "hsl(120, 70%, 50%)" },
      { id: "Bad", label: `Bad: ${heatBadData.length}`, value: heatBadData.length, color: "hsl(0, 70%, 50%)" },
    ];

    lightingPieData = [
      { id: "Good", label: `Good: ${lightingGoodData.length}`, value: lightingGoodData.length, color: "hsl(120, 70%, 50%)" },
      { id: "Bad", label: `Bad: ${lightingBadData.length}`, value: lightingBadData.length, color: "hsl(0, 70%, 50%)" },
    ];




    console.log("Updated Indoor Air Pie Data:", indoorAirPieData);
    // console.log("Updated Temperature Pie Data:", temperaturePieData);
    // console.log("Updated Lighting Pie Data:", lightingPieData);


    // Fetch VOG data (unchanged)
    // fetchVogPieData();
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
};

// Function to fetch and categorize VOG pie data (UNCHANGED)
// const fetchVogPieData = async () => {
//   try {
//     const readouts = await httpGetAllReadouts(); // Fetch VOG sensor data

//     if (readouts.length === 0) {
//       console.warn("No VOG data available.");
//       vogPieData = [{ id: "No Data", label: "No Data", value: 1, color: "hsl(0, 0%, 80%)" }];
//       return;
//     }

//     const levelCounts = [0, 0, 0, 0, 0]; // Initialize counts for levels 0-4

//     readouts.forEach(({ level }) => {
//       if (level >= 0 && level <= 4) {
//         levelCounts[level] += 1; // Count occurrences of each level
//       }
//     });

//     const { level } = readouts[readouts.length - 1]; // Get the most recent level
//     const validLevel = level >= 0 && level <= 4 ? level : 0; // Ensure valid range

//     vogPieData = Array.from({ length: 5 }, (_, i) => ({
//       id: `Level ${i}`,
//       label: `Level ${i}`,
//       value: i === validLevel ? levelCounts[i] : 1, // Show only current level, retain others with small value
//       color: i === validLevel ? "hsl(0, 70%, 50%)" : "hsl(0, 0%, 90%)", // Highlight current level, dim others
//       tooltip: `Level ${i}: ${levelCounts[i]} readings`,
//     }));

//     console.log("Updated VOG Pie Data:", vogPieData);
//   } catch (error) {
//     console.error("Error fetching or processing VOG data:", error);
//   }
// };

// console.log("VOG Pie Data:", vogPieData);
// } catch (error) {
//     console.error("Error fetching or processing VOG data:", error);
//   }
// };


// Call the fetch function on module load
fetchPieData();
