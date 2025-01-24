import { useEffect, useState } from "react";
import AirIcon from "@mui/icons-material/Air";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import WbIncandescentIcon from "@mui/icons-material/WbIncandescent";

// Import hooks
import { httpGetAllReadouts } from "../hooks/sensors.requests"; // Adjust the path to your hooks

export const cardsData = [
  {
    title: "IAQ Index",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 0, // Placeholder until data is fetched
    value: 0, // Placeholder until data is fetched
    png: AirIcon,
    series: [
      {
        name: "IAQ Index",
        data: [], // Placeholder until data is fetched
      },
    ],
  },
  {
    title: "Temperature",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 0, // Placeholder until data is fetched
    value: 0, // Placeholder until data is fetched
    png: DeviceThermostatIcon,
    series: [
      {
        name: "Temperature",
        data: [], // Placeholder until data is fetched
      },
    ],
  },
  {
    title: "Lighting",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 0, // Placeholder until data is fetched
    value: 0, // Placeholder until data is fetched
    png: WbIncandescentIcon,
    series: [
      {
        name: "Lighting",
        data: [], // Placeholder until data is fetched
      },
    ],
  },
];
// Export other data with deduplication
export const IAQData = [
  {
    title: "Indoor Air Quality",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    png: WbIncandescentIcon,
    series: [
      {
        // name: "Indoor Air Quality",
        data: [], // Placeholder until data is fetched
      },
    ],
  },
];

export const HeatIndexData = [
  {
    title: "Heat Index",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    png: WbIncandescentIcon,
    series: [
      {
        // name: "Heat Index",
        data: [], // Placeholder until data is fetched
      },
    ],
  },
];

export const LightingData = [
  {
    title: "Lighting",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    png: WbIncandescentIcon,
    series: [
      {
        // name: "Lighting",
        data: [], // Placeholder until data is fetched
      },
    ],
  },
];

export const VolcanicSmogData = [
  {
    title: "Volcanic Smog",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    png: WbIncandescentIcon,
    series: [
      {
        // name: "Volcanic Smog",
        data: [], // Placeholder until data is fetched
      },
    ],
  },
];


export const fetchCardData = async (setCardData) => {
  try {
    const readouts = await httpGetAllReadouts(); // Fetch data
    const roomData = {};

    // Group data by room
    readouts.forEach((readout) => {
      const room = readout.classroom;

      // Initialize arrays for each room if not already present
      if (!roomData[room]) {
        roomData[room] = {
          iaqIndex: [],
          temperature: [],
          lighting: [],
          indoorAirRemarks: [],
          tempRemarks: [],
          lightRemarks: [],
        };
      }

      // Add data to corresponding room
      roomData[room].iaqIndex.push(readout.IAQIndex);
      roomData[room].temperature.push(readout.temperature);
      roomData[room].lighting.push(readout.lighting);
      roomData[room].indoorAirRemarks.push(readout.indoorAir);
      roomData[room].tempRemarks.push(readout.temp);
      roomData[room].lightRemarks.push(readout.lightRemarks);
    });

    // Function to determine if most remarks are "Good"
    const determineGoodBad = (remarks) => {
      const goodCount = remarks.filter((remark) => remark === "Good").length;
      return goodCount > remarks.length / 2 ? "Good" : "Bad";
    };

    // Prepare the updated data for cards
    const updatedCardsData = [
      {
        ...cardsData[0],
        barValue: Object.values(roomData)
          .map((room) => room.iaqIndex)
          .flat()
          .pop() || 0, // Directly use the latest IAQ Index value for barValue
        value: Object.values(roomData)
          .map((room) => room.iaqIndex)
          .flat()
          .pop() || 0, // Directly use the latest IAQ Index value for value
        series: Object.keys(roomData).map((room) => ({
          name: `Room ${room}`,
          data: roomData[room].iaqIndex, // Use IAQ Index data for each room
        })),
        remark: determineGoodBad(
          Object.values(roomData).map((room) => room.indoorAirRemarks).flat()
        ),
      },
      {
        ...cardsData[1],
        barValue: Object.values(roomData)
          .map((room) => room.temperature)
          .flat()
          .pop() || 0, // Directly use the latest temperature value for barValue
        value: Object.values(roomData)
          .map((room) => room.temperature)
          .flat()
          .pop() || 0, // Directly use the latest temperature value for value
        series: Object.keys(roomData).map((room) => ({
          name: `Room ${room}`,
          data: roomData[room].temperature, // Use temperature data for each room
        })),
        remark: determineGoodBad(
          Object.values(roomData).map((room) => room.tempRemarks).flat()
        ),
      },
      {
        ...cardsData[2],
        barValue: Object.values(roomData)
          .map((room) => room.lighting)
          .flat()
          .pop() || 0, // Directly use the latest lighting value for barValue
        value: Object.values(roomData)
          .map((room) => room.lighting)
          .flat()
          .pop() || 0, // Directly use the latest lighting value for value
        series: Object.keys(roomData).map((room) => ({
          name: `Room ${room}`,
          data: roomData[room].lighting, // Use lighting data for each room
        })),
        remark: determineGoodBad(
          Object.values(roomData).map((room) => room.lightRemarks).flat()
        ),
      },
    ];

    setCardData(updatedCardsData); // Update the state with fetched data
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
