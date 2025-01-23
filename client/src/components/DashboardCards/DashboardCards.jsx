import React, { useState, useEffect } from "react";
import './DashboardCards.css';
import DashboardCard from '../DashboardCard/DashboardCard';
import { fetchCardData } from "../../data/mockChartData"; // Import the fetchCardData function

const DashboardCards = () => {
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    fetchCardData(setCardData); // Fetch data on component mount
  }, []);

  // Function to categorize the values as "Good" or "Bad"
  const getCategory = (value, type) => {
    if (type === "IAQ Index") {
      return value <= 50 ? "Good" : "Bad"; // Example: IAQ Index <= 50 is "Good"
    } else if (type === "Temperature") {
      return value <= 25 ? "Good" : "Bad"; // Example: Temperature <= 25Â°C is "Good"
    } else if (type === "Lighting") {
      return value >= 300 ? "Good" : "Bad"; // Example: Lighting >= 300 lux is "Good"
    }
    return "Unknown"; // Default case
  };

  return (
    <div className="Cards">
      {cardData.map((card, index) => {
        const category = getCategory(card.value, card.title); // Get category (Good/Bad)

        return (
          <div className="parentContainer" key={index}>
            <DashboardCard
              cardData={cardData} // Pass data as prop to each card
              title={card.title}
              color={card.color}
              barValue={card.barValue}
              value={category} // Display "Good" or "Bad" instead of the value
              png={card.png}
              series={card.series}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;