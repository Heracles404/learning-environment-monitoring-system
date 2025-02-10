import { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { httpGetAllReadouts } from "../../hooks/vog.requests"; // Fetch VOG data from API

const VOGPieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const defaultColors = ["#33FFC9", "#00F5B4", "#00A378", "#00664B"]; // Colors for levels 1-4
  const fadedColor = "#50ccac"; // Faded color for levels above the latest one

  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const readouts = await httpGetAllReadouts(); // Fetch VOG data from API
        if (readouts.length === 0) {
          console.warn("No VOG data available.");
          setPieData([{ id: "No Data", label: "No Data", value: 1, color: "hsl(0, 0%, 80%)" }]);
          return;
        }

        // Filter out any levels that are outside the range of 1 to 4
        const validReadouts = readouts.filter(item => item.level >= 1 && item.level <= 4);

        if (validReadouts.length === 0) {
          console.warn("No valid VOG data available.");
          setPieData([{ id: "No Data", label: "No Data", value: 1, color: "hsl(0, 0%, 80%)" }]);
          return;
        }

        // Get the most recent valid level from the filtered data
        const latestReadout = validReadouts[validReadouts.length - 1];
        const latestLevel = latestReadout.level;

        // Generate pie data
        const vogPieData = Array.from({ length: 4 }, (_, i) => {
          const level = i + 1;
          const isHighlighted = level <= latestLevel;
          return {
            id: `Level ${level}`,
            label: `Level ${level}`,
            value: 1, // Keep all levels equally sized
            color: isHighlighted ? defaultColors[level - 1] : fadedColor, // Highlight latest level and below, fade out above
            textColor: isHighlighted ? "white" : fadedColor, // White for highlighted levels, invisible for faded
          };
        });

        setPieData(vogPieData);
      } catch (error) {
        console.error("Error fetching VOG data:", error);
      }
    };

    fetchData(); // Fetch immediately
    const interval = setInterval(fetchData, 5000); // Auto-refresh every 5 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsivePie
      data={pieData}
      theme={{
        axis: {
          domain: { line: { stroke: colors.grey[500] } },
          legend: { text: { fill: colors.greenAccent[100] } },
          ticks: {
            line: { stroke: colors.grey[100], strokeWidth: 1 },
            text: { fill: colors.grey[100] },
          },
        },
        legends: { text: { fill: colors.grey[100] } },
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={(slice) => slice.data.textColor} // Dynamic text color (invisible for faded)
      arcLinkLabelsThickness={2}
      arcLinkLabelsDiagonalLength={5}
      arcLinkLabelsStraightLength={14}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      arcLabelsRadiusOffset={0.4}
      arcLabelsSkipAngle={7}
      arcLabelsTextColor={(slice) => slice.data.textColor} // Invisible text for faded levels
      isInteractive={false}
      colors={(slice) => slice.data.color} // Use assigned colors
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
    />
  );
};

export default VOGPieChart;
