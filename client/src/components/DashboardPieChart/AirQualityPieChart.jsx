import { useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../../theme";
import { useTheme, Card, CardContent, Typography, Button } from "@mui/material";
import { indoorAirPieData as data, indoorAirPieWithData } from "../../data/pieData";

const AirQualityPieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const customColors = ["#5CFFD3", "#FFC2C2"];
  const [selectedData, setSelectedData] = useState(null);

  const handleClick = (e) => {
    const clickedCategory = e.id; // "Good" or "Bad"
    const matchedData = indoorAirPieWithData.find((item) =>
      item.label.includes(clickedCategory)
    );

    if (matchedData) {
      setSelectedData(matchedData);
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ResponsivePie
        data={data}
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
        colors={customColors}
        arcLinkLabelsTextColor="white"
        arcLinkLabelsThickness={2}
        arcLinkLabelsDiagonalLength={5}
        arcLinkLabelsStraightLength={14}
        arcLinkLabelsColor={{ from: "color" }}
        enableArcLabels={false}
        arcLabelsRadiusOffset={0.4}
        arcLabelsSkipAngle={7}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
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
            effects: [{ on: "hover", style: { itemTextColor: "#000" } }],
          },
        ]}
        onClick={handleClick} // Show card on click
      />

      {/* Display the clicked slice data in a Card */}
      {selectedData && (
        <Card
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 320,
            bgcolor: "#70d8bd", // Green background color
            color: "white",
            padding: 3,
            boxShadow: 5,
            zIndex: 10,
            textAlign: "center", // Center text inside the card
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {selectedData.label}
            </Typography>
            <Typography variant="body2" sx={{ marginTop: 1, whiteSpace: "pre-line" }}>
              {/* Display each room on a new line */}
              {selectedData.id
                .split(", ") // Assuming the data is stored in a comma-separated string
                .map((roomData, index) => (
                  <div key={index}>{roomData}</div>
                ))}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
              onClick={() => setSelectedData(null)}
            >
              Close
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AirQualityPieChart;
