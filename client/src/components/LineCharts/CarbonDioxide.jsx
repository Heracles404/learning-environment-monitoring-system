import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useEffect, useState } from 'react';
import { httpGetAllReadouts } from "../../hooks/sensors.requests"; // Adjust the import path as necessary

const CarbonDioxideChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching CO2 data...");
        const fetchedData = await httpGetAllReadouts();
        console.log("Fetched data:", fetchedData);

        // Transform fetched data into the format expected by ResponsiveLine
        const transformedData = [];

        fetchedData.forEach(item => {
          const roomIndex = transformedData.findIndex(d => d.id === item.room);
          const dataPoint = { x: item.date, y: item.value };

          if (roomIndex === -1) {
            // If the room doesn't exist, create a new entry
            transformedData.push({
              id: item.room,
              color: tokens("dark").greenAccent[500], // You can customize colors based on room
              data: [dataPoint],
            });
          } else {
            // If the room exists, push the new data point to the existing room's data
            transformedData[roomIndex].data.push(dataPoint);
          }
        });

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching CO2 data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {data.length > 0 ? (
        <ResponsiveLine
          data={data}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: colors.grey[100],
                },
              },
              legend: {
                text: {
                  fill: colors.grey[100],
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
            tooltip: {
              container: {
                color: colors.primary[500],
              },
            },
          }}
          colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "time", format: "%Y-%m-%d", precision: "day" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: true,
            reverse: false,
          }}
          axisBottom={{
            orient: "bottom",
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            legend: isDashboard ? undefined : "Date",
            legendOffset: 36,
            legendPosition: "middle",
            format: "%b %d",
          }}
          axisLeft={{
            orient: "left",
            tickValues: 5,
            tickSize: 3,
            tickPadding: 5,
            tickRotation: 0,
            legend: isDashboard ? undefined : "PP M (parts per million)",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          enableGridX={false}
          enableGridY={true}
          pointSize={10}
          pointColor={{ from: "color", modifiers: [] }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          enableArea={true}
          areaBaselineValue={0}
          areaOpacity={0.1}
          useMesh={true}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.85,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      ) : (
        <p>Loading...</p> // Optional loading indicator
      )}
    </div>
  );
};

export default CarbonDioxideChart;