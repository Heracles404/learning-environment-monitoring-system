
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
      boxShadow: "0px 10px 20px 0px #70FFDB",
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
      boxShadow: "0px 10px 20px 0px #70FFDB",
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
      boxShadow: "0px 10px 20px 0px #70FFDB",
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

      // Ensure correct date parsing & timezone handling
      const dateString = readout.date ? readout.date : new Date().toISOString().split('T')[0];
      let timeString = readout.time; // Example: "02:55 PM"

      // Convert 12-hour format to Date object
      const localDate = new Date(`${dateString} ${timeString}`);

      // Reformat to 12-hour AM/PM (ensures consistency)
      const formattedTime = localDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      console.log("Original Time:", readout.time);
      console.log("Formatted Time:", formattedTime);

      const timestamp = localDate.getTime() - localDate.getTimezoneOffset() * 60000; // Convert to UTC

      roomData[room].iaqIndex.push({ x: timestamp, y: readout.IAQIndex });
      roomData[room].heatIndex.push({ x: timestamp, y: readout.heatIndex });
      roomData[room].lighting.push({ x: timestamp, y: readout.lighting });
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

      const dateString = readout.date ? readout.date : new Date().toISOString().split('T')[0];
      let timeString = readout.time;

      // Convert 12-hour format to Date object
      const localDate = new Date(`${dateString} ${timeString}`);

      // Reformat to 12-hour AM/PM
      const formattedTime = localDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      console.log("Original Vog Time:", readout.time);
      console.log("Formatted Vog Time:", formattedTime);

      const timestamp = localDate.getTime() - localDate.getTimezoneOffset() * 60000; // Convert to UTC

      vogRoomData[room].pm25.push({ x: timestamp, y: readout.pm25 });
      vogRoomData[room].pm10.push({ x: timestamp, y: readout.pm10 });
    });

    const determineGoodBad = (remarks) => {
      const goodCount = remarks.filter((remark) => remark === "GOOD").length;
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
            data: vogReadouts.map((readout) => {
              const dateString = readout.date ? readout.date : new Date().toISOString().split('T')[0];
              let timeString = readout.time;
              const localDate = new Date(`${dateString} ${timeString}`);
              const timestamp = localDate.getTime() - localDate.getTimezoneOffset() * 60000; // Convert to UTC
              return { x: timestamp, y: readout.pm25 };
            }),
            color: getRandomColor(),
          },
          {
            name: "PMS10",
            data: vogReadouts.map((readout) => {
              const dateString = readout.date ? readout.date : new Date().toISOString().split('T')[0];
              let timeString = readout.time;
              const localDate = new Date(`${dateString} ${timeString}`);
              const timestamp = localDate.getTime() - localDate.getTimezoneOffset() * 60000; // Convert to UTC
              return { x: timestamp, y: readout.pm10 };
            }),
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


