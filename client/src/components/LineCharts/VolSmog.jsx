import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useEffect, useState } from 'react';
import { httpGetAllReadouts } from "../../hooks/sensors.requests"; // Adjust the import path as necessary

const VolSmogChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching Particulate Matter data...");
        const fetchedData = await httpGetAllReadouts(); // Fetch data from the same API
        console.log("Fetched data:", fetchedData); // Log the entire fetched data

        // Transform fetched data into the format expected by ResponsiveLine
        const transformedData = [{
          id: "Particulate Matter",
          color: colors.greenAccent?.[500] || '#00FF00', // Fallback color
          data: []
        }];

        // Loop through the fetched data and extract particulate matter values
        fetchedData.forEach(item => {
          // Check if the required properties exist
          if (item.date && item.time && item.particulateMatter !== undefined) {
            const dataPoint = {
              x: new Date(item.date + ' ' + item.time).toISOString(), // Combine date and time for x-axis
              y: item.particulateMatter // Access the particulate matter property
            };
            transformedData[0].data.push(dataPoint); // Push data point to the existing entry
          } else {
            console.warn("Missing data for item:", item); // Log a warning for missing data
          }
        });

        console.log("Transformed Particulate Matter data for chart:", transformedData); // Log the transformed data for the chart
        setData(transformedData);
      } catch (error) {
        console.error("Error fetching Particulate Matter data:", error);
      }
    };

    fetchData();
  }, []);

  // Check if data is empty or not in the expected format
  if (!data.length || !data[0].data.length) {
    return <p>No data available for Particulate Matter.</p>;
  }

  return (
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
      xScale={{ type: "time", format: "%Y-%m-%dT%H:%M:%S.%LZ", precision: "day" }}
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
        legend: isDashboard ? undefined : "PPM",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true }
      legends={[
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
  );
};

export default VolSmogChart;