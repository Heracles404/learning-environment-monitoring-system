import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useEffect, useState } from 'react';
import { httpGetAllReadouts } from "../../hooks/sensors.requests"; // Adjust the import path as necessary

const CarbonDioxideChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("Fetching CO2 data...");
        const fetchedData = await httpGetAllReadouts();
        // console.log("Fetched data:", fetchedData); // Log the entire fetched data

        // Transform fetched data into the format expected by ResponsiveLine
        const transformedData = [{
          id: "Carbon Dioxide",
          color: tokens("dark").greenAccent[500], // Customize color
          data: []
        }];

        // Loop through the fetched data and extract carbon dioxide values
        fetchedData.forEach(item => {
          const dataPoint = {
            x: new Date(item.date + ' ' + item.time).toISOString(), // Combine date and time for x-axis
            y: item.carbonDioxide // Access the carbonDioxide property
          };
          transformedData[0].data.push(dataPoint); // Push data point to the existing entry
        });

        // console.log("Transformed CO2 data for chart:", transformedData); // Log the transformed data for the chart
        setData(transformedData);
      } catch (error) {
        console.error("Error fetching CO2 data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ height: '400px', width: '100%' }}> {/* Set a fixed height for visibility */}
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
          colors={{ datum: "color" }}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "time", format: "%Y-%m-%dT%H:%M:%S.%LZ", precision: "day" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: false,
            reverse: false,
          }}
          axisBottom={{
            orient: "bottom",
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Date",
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
            legend: "PPM (parts per million)",
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
          legends ={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
        />
      ) : (
        <p>No data available for Carbon Dioxide.</p>
      )}
    </div>
  );
};

export default CarbonDioxideChart;