import React, { useEffect, useState } from 'react';
import './DashboardCards.css';
import { CardsData } from '../../data/chartData';
import DashboardCard from '../DashboardCard/DashboardCard';
import { httpGetAllReadouts } from "../../hooks/sensors.requests.js";
import { httpGetAllReadouts as httpGetVogReadouts } from '../../hooks/vog.requests.js';  // Keeping this for the PM2.5 data

const DashboardCards = () => {
  const [cardData, setCardData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null); // Track the latest data's timestamp or unique ID

  // Function to classify remarks as 'Good' or 'Bad' based on majority
  const classifyRemarks = (remarksArray) => {
    const goodCount = remarksArray.filter(remark => remark === 'Good').length;
    const badCount = remarksArray.filter(remark => remark === 'Bad').length;

    return goodCount >= badCount ? 'Good' : 'Bad';
  };

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
                // Fetch all remarks for Air Quality and classify as Good/Bad
                const airQualityRemarks = response.map(item => item.indoorAir);  // Fetch indoor air quality remarks

                updatedValue = classifyRemarks(airQualityRemarks);
                updatedBarValue = (latestData.IAQIndex).toFixed(2); // Keep the bar value as IAQIndex and limit to 2 decimals
                break;

              case 'Temperature':
                // Fetch all remarks for Temperature and classify as Good/Bad
                const tempRemarks = response.map(item => item.temp);  // Fetch temperature remarks

                updatedValue = classifyRemarks(tempRemarks);
                updatedBarValue = (latestData.temperature).toFixed(2); // Bar value remains as Temperature and limit to 2 decimals
                break;

              case 'Light':
                // Fetch all remarks for Light and classify as Good/Bad
                const lightRemarks = response.map(item => item.remarks);  // Fetch lighting remarks

                updatedValue = classifyRemarks(lightRemarks);
                updatedBarValue = (latestData.lighting).toFixed(2); // Bar value remains as Lighting and limit to 2 decimals
                break;

              case 'Volcanic Smog':
                // Use PM2.5 data from the vog API and classify as Good/Bad
                const vogRemark = latestVogData.pm10 <= 50 ? "Good" : "Bad";
                updatedValue = vogRemark;
                updatedBarValue = (latestVogData.pm10).toFixed(2); // Bar value remains as PM2.5 data and limit to 2 decimals
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
