import React, { useEffect, useState } from 'react';
import './DashboardCards.css';
import { CardsData } from '../../data/chartData';
import DashboardCard from '../DashboardCard/DashboardCard';
import { httpGetAllReadouts } from "../../hooks/sensors.requests.js";

const DashboardCards = () => {
  const [cardData, setCardData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null); // Track the latest data's timestamp or unique ID

  useEffect(() => {
    const fetchCardData = async () => {
      try {
         const response = await httpGetAllReadouts();
        // Get the latest data (assuming the last item in the array is the newest)
        const latestData = response[response.length - 1];

        // Check if the latest data is new (based on unique `_id` or timestamp)
        if (!lastUpdated || latestData._id !== lastUpdated) {
          const updatedCards = CardsData.map(card => {
            let updatedValue = 'Unknown';
            let updatedBarValue = 0;

            switch (card.title) {
              case 'Air Quality':
                updatedValue = latestData.IAQIndex > 50 ? 'GOOD' : 'BAD';
                updatedBarValue = latestData.IAQIndex;
                break;
              case 'Temperature':
                updatedValue = latestData.temperature > 30 ? 'HOT' : 'NORMAL';
                updatedBarValue = latestData.temperature;
                break;
              case 'Light':
                updatedValue = latestData.lighting > 100 ? 'BRIGHT' : 'DIM';
                updatedBarValue = latestData.lighting;
                break;
              case 'Volcanic Smog':
                updatedValue = latestData.voc > 50 ? 'HIGH' : 'LOW';
                updatedBarValue = latestData.voc;
                break;
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
