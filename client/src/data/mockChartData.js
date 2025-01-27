import { useEffect, useState } from "react";
import AirIcon from "@mui/icons-material/Air";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import WbIncandescentIcon from "@mui/icons-material/WbIncandescent";
import VolcanoIcon from "@mui/icons-material/Volcano";

// Import hooks
import { httpGetAllReadouts } from "../hooks/sensors.requests"; // Adjust the path to your hooks
import { httpGetAllReadouts as httpGetVogReadouts } from "../hooks/vog.requests"; // Adjust the path to your vog hooks

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
  // New VOG card added for PMS2.5 and PMS10
  {
    title: "Volcanic Smog",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 0, // Placeholder until data is fetched
    value: 0, // Placeholder until data is fetched
    png: VolcanoIcon, // You can change the icon to something fitting for VOG
    series: [
      {
        name: "PMS2.5",
        data: [], // Placeholder for PMS2.5 data
      },
      {
        name: "PMS10",
        data: [], // Placeholder for PMS10 data
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
    const readouts = await httpGetAllReadouts(); // Fetch data for IAQ, Temperature, and Lighting
    const vogReadouts = await httpGetVogReadouts(); // Fetch data for Volcanic Smog (PMS2.5 and PMS10)

    const roomData = {};

    // Group IAQ, Temperature, Lighting data by room
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

    // Group VOG data by room for PMS2.5 and PMS10
    const vogRoomData = {};
    vogReadouts.forEach((readout) => {
      const room = readout.classroom;

      if (!vogRoomData[room]) {
        vogRoomData[room] = {
          pm25: [],
          pm10: [],
        };
      }

      vogRoomData[room].pm25.push(readout.pm25);
      vogRoomData[room].pm10.push(readout.pm10);
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
        barValue: readouts.length > 0 ? readouts[readouts.length - 1].IAQIndex : 0, // Latest IAQ Index value for barValue
        value: readouts.length > 0 ? readouts[readouts.length - 1].IAQIndex : 0, // Latest IAQ Index value for value
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
        barValue: readouts.length > 0 ? readouts[readouts.length - 1].temperature : 0, // Latest temperature value for barValue
        value: readouts.length > 0 ? readouts[readouts.length - 1].temperature : 0, // Latest temperature value for value
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
        barValue: readouts.length > 0 ? readouts[readouts.length - 1].lighting : 0, // Latest lighting value for barValue
        value: readouts.length > 0 ? readouts[readouts.length - 1].lighting : 0, // Latest lighting value for value
        series: Object.keys(roomData).map((room) => ({
          name: `Room ${room}`,
          data: roomData[room].lighting, // Use lighting data for each room
        })),
        remark: determineGoodBad(
          Object.values(roomData).map((room) => room.lightRemarks).flat()
        ),
      },
      {
        ...cardsData[3], // VOG Card for PMS2.5 and PMS10
        barValue: vogReadouts.length > 0 ? vogReadouts[vogReadouts.length - 1].pm25 : 0, // Latest PMS2.5 value for barValue
        value: vogReadouts.length > 0 ? vogReadouts[vogReadouts.length - 1].pm10 : 0, // Latest PMS10 value for value
        series: [
          {
            name: "PMS2.5",
            data: vogReadouts.map((readout) => readout.pm25), // Use PMS2.5 data
          },
          {
            name: "PMS10",
            data: vogReadouts.map((readout) => readout.pm10), // Use PMS10 data
          },
        ],
      },
    ];

    setCardData(updatedCardsData); // Update the state with new data
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


