import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { indoorAirPieData as data, indoorAirPieWithData } from "../../data/pieData";

const AirQualityPieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const customColors = ["#33FFC9", "#FFC2C2"];

  const handleClick = (e) => {
    // Find the matching entry from indoorAirPieDataTest
    const clickedCategory = e.id; // This will be "Good" or "Bad"
    const matchedData = indoorAirPieWithData.find((item) =>
      item.label.includes(clickedCategory)
    );

    if (matchedData) {
      alert(`${matchedData.id}`); // Show detailed room data
    } else {
      alert("No data found.");
    }
  };

  return (
    <ResponsivePie
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[500],
            },
          },
          legend: {
            text: {
              fill: colors.greenAccent[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      colors={customColors}
      arcLinkLabelsTextColor="white"
      arcLinkLabelsThickness={2}
      arcLinkLabelsDiagonalLength={5}
      arcLinkLabelsStraightLength={14}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      arcLabelsRadiusOffset={0.4}
      arcLabelsSkipAngle={7}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      legends={[
        {
          anchor: "bottom-left",
          direction: "column",
          justify: false,
          translateX: 0,
          translateY: 40,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "white",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 14,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
      onClick={handleClick} // Added onClick event to show room details
    />
  );
};

export default AirQualityPieChart;
