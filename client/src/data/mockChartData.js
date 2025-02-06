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
      boxShadow: "0px 10px 20px 0px #70FFDB",
    },
    barValue: 0,
    value: 0,
    iconColor: "#85FFE0",
    titleColor: "#85FFE0",
    png: AirIcon,
    series: [{ name: "IAQ Index", data: [] }],
  },
  {
    title: "Heat Index",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #FFD6D6",
    },
    barValue: 0,
    value: 0,
    iconColor: "#FFD8D6 ",
    titleColor: "#FFD8D6 ",
    png: DeviceThermostatIcon,
    series: [{ name: "Heat Index", data: [] }],
  },
  {
    title: "Lighting",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #FFF0C2",
    },
    barValue: 0,
    value: 0,
    iconColor: "#FFE699 ",
    titleColor: "#FFE699 ",
    png: WbIncandescentIcon,
    series: [{ name: "Lighting", data: [] }],
  },
  {
    title: "Volcanic Smog",
    color: {
      backGround: "linear-gradient(180deg, #4cceac 0%, #b7ebde 200%)",
      boxShadow: "0px 10px 20px 0px #FFDCAD",
    },
    iconColor: "#FFD399 ",
    titleColor: "#FFD399 ",
    barValue: 0,
    value: 0,
    png: VolcanoIcon,
    series: [
      { name: "PMS2.5", data: [] },
      { name: "PMS10", data: [] },
    ],
  },
];

// Function to generate a random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const fetchCardData = async (setCardData) => {
  try {
    const readouts = await httpGetAllReadouts();
    const vogReadouts = await httpGetVogReadouts();

    const roomData = {};
    readouts.forEach((readout) => {
      const room = readout.classroom;
      if (!roomData[room]) {
        roomData[room] = {
          iaqIndex: [],
          heatIndex: [],
          lighting: [],
          indoorAirRemarks: [],
          tempRemarks: [],
          lightRemarks: [],
        };
      }
      roomData[room].iaqIndex.push(readout.IAQIndex);
      roomData[room].heatIndex.push(readout.heatIndex);
      roomData[room].lighting.push(readout.lighting);
      roomData[room].indoorAirRemarks.push(readout.indoorAir);
      roomData[room].tempRemarks.push(readout.temp);
      roomData[room].lightRemarks.push(readout.lightRemarks);
    });

    const vogRoomData = {};
    vogReadouts.forEach((readout) => {
      const room = readout.classroom;
      if (!vogRoomData[room]) {
        vogRoomData[room] = { pm25: [], pm10: [] };
      }
      vogRoomData[room].pm25.push(readout.pm25);
      vogRoomData[room].pm10.push(readout.pm10);
    });

    const determineGoodBad = (remarks) => {
      const goodCount = remarks.filter((remark) => remark === "Good").length;
      return goodCount > remarks.length / 2 ? "Good" : "Bad";
    };

    const updatedCardsData = [
      {
        ...cardsData[0],
        barValue: readouts.length > 0 ? readouts[readouts.length - 1].IAQIndex : 0,
        value: readouts.length > 0 ? readouts[readouts.length - 1].IAQIndex : 0,
        series: Object.keys(roomData).map((room) => ({
          name: `Room ${room}`,
          data: roomData[room].iaqIndex,
          color: getRandomColor(),
        })),
        remark: determineGoodBad(
          Object.values(roomData).map((room) => room.indoorAirRemarks).flat()
        ),
      },
      {
        ...cardsData[1],
        barValue: readouts.length > 0 ? readouts[readouts.length - 1].heatIndex : 0,
        value: readouts.length > 0 ? readouts[readouts.length - 1].heatIndex : 0,
        series: Object.keys(roomData).map((room) => ({
          name: `Room ${room}`,
          data: roomData[room].heatIndex,
          color: getRandomColor(),
        })),
        remark: determineGoodBad(
          Object.values(roomData).map((room) => room.tempRemarks).flat()
        ),
      },
      {
        ...cardsData[2],
        barValue: readouts.length > 0 ? readouts[readouts.length - 1].lighting : 0,
        value: readouts.length > 0 ? readouts[readouts.length - 1].lighting : 0,
        series: Object.keys(roomData).map((room) => ({
          name: `Room ${room}`,
          data: roomData[room].lighting,
          color: getRandomColor(),
        })),
        remark: determineGoodBad(
          Object.values(roomData).map((room) => room.lightRemarks).flat()
        ),
      },
      {
        ...cardsData[3],
        barValue: vogReadouts.length > 0 ? vogReadouts[vogReadouts.length - 1].pm25 : 0,
        value: vogReadouts.length > 0 ? vogReadouts[vogReadouts.length - 1].pm10 : 0,
        series: [
          {
            name: "PMS2.5",
            data: vogReadouts.map((readout) => readout.pm25),
            color: getRandomColor(),
          },
          {
            name: "PMS10",
            data: vogReadouts.map((readout) => readout.pm10),
            color: getRandomColor(),
          },
        ],
      },
    ];

    setCardData(updatedCardsData);
  } catch (error) {
    console.error("Error fetching data", error);
  }
};
