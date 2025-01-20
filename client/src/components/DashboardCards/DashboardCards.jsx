import React, { useEffect, useState } from 'react';
import './DashboardCards.css';
import { CardsData } from '../../data/chartData';
import DashboardCard from '../DashboardCard/DashboardCard';
import { httpGetAllReadouts } from "../../hooks/sensors.requests.js";
import { httpGetAllReadouts as httpGetVogReadouts } from '../../hooks/vog.requests.js';  // Keeping this for the PM2.5 data

const DashboardCards = () => {
  const [cardData, setCardData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null); // Track the latest data's timestamp or unique ID

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await httpGetAllReadouts();  // Fetch from the sensors API
        const vogResponse = await httpGetVogReadouts();  // Fetch from the vog API to get the PM2.5 data
        // Get the latest data (assuming the last item in the array is the newest)
        const latestData = response[response.length - 1];
        const latestVogData = vogResponse[vogResponse.length - 1];  // Latest PM2.5 data

        // Check if the latest data is new (based on unique `_id` or timestamp)
        if (!lastUpdated || latestData._id !== lastUpdated) {
          const updatedCards = CardsData.map(card => {
            let updatedValue = 'Unknown';
            let updatedBarValue = 0;

            switch (card.title) {
              case 'Air Quality':
                const IAQIndex = latestData.IAQIndex.toFixed(2); // Assuming latestData has IAQIndex

                // Classify air quality based on IAQIndex
                if (IAQIndex > 0 && IAQIndex <= 50) {
                  updatedValue = "CLEAN";
                } else if (IAQIndex > 50 && IAQIndex <= 100) {
                  updatedValue = "NORMAL";
                } else if (IAQIndex > 100 && IAQIndex <= 150) {
                  updatedValue = "CAUTION";
                } else if (IAQIndex > 150 && IAQIndex <= 200) {
                  updatedValue = "DANGER";
                } else if (IAQIndex > 200 && IAQIndex <= 300) {
                  updatedValue = "EXTREME";
                } else if (IAQIndex > 300 && IAQIndex <= 500) {
                  updatedValue = "HAZARDOUS";
                } else {
                  updatedValue = "OUT OF RANGE"; // Handle cases where IAQIndex is <= 0 or > 500
                }

                updatedBarValue = IAQIndex; // Keep the bar value as the IAQIndex
                break;

              case 'Temperature':
                const heatIndex = latestData.temperature.toFixed(2); // Assuming latestData has temperature

                // Classify temperature based on heatIndex
                if (heatIndex <= 27) {
                  updatedValue = "NORMAL";
                } else if (heatIndex >= 28 && heatIndex <= 35) {
                  updatedValue = "GOOD";
                } else if (heatIndex >= 36 && heatIndex <= 41) {
                  updatedValue = "CAUTION";
                } else if (heatIndex >= 42 && heatIndex <= 51) {
                  updatedValue = "DANGER";
                } else if (heatIndex > 51) {
                  updatedValue = "CATASTROPHE";
                }

                updatedBarValue = heatIndex; // Keep the bar value as the heatIndex
                break;

              case 'Light':
                updatedValue = (latestData.lighting > 300 && latestData.lighting < 500) ? 'GOOD' : 'BAD';
                updatedBarValue = latestData.lighting.toFixed(2);
                break;

              case 'Volcanic Smog':
                // Use PM2.5 data from the vog API
                updatedValue = latestVogData.pm10 > 50 ? 'GOOD' : 'BAD'; // Check the PM2.5 value
                updatedBarValue = latestVogData.pm10.toFixed(2); // Use PM2.5 for the bar value
                
                break;
              // case 'Volcanic Smog':
              //   // Use PM2.5 data from the vog API
              //   updatedValue = latestVogData.pm10 > 50 ? 'GOOD' : 'BAD'; // Check the PM2.5 value
              //   updatedBarValue = latestVogData.pm10.toFixed(2); // Use PM2.5 for the bar value
              //   break;
                

              default:
                break;
            }

            return {
              ...card,
              value: updatedValue,
              barValue: updatedBarValue,
            };
          });

          setCardData(updatedCards);
          setLastUpdated(latestData._id); // Update the last updated ID or timestamp
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data initially and set an interval for periodic updates
    fetchCardData();
    const intervalId = setInterval(fetchCardData, 60000); // Fetch data every minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [lastUpdated]);

  return (
    <div className="Cards">
      {cardData.map((card, id) => (
        <div className="parentContainer" key={id}>
          <DashboardCard
            title={card.title}
            color={card.color}
            barValue={card.barValue}
            value={card.value}
            png={card.png}
            series={card.series}
          />
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
