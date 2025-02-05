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
      return value <= 50 ? "Good" : "Bad";
    } else if (type === "Temperature") {
      return value <= 25 ? "Good" : "Bad";
    } else if (type === "Lighting") {
      return value >= 300 ? "Good" : "Bad";
    } else if (type === "Volcanic Smog") {
      return value <= 100 ? "Good" : "Bad";
    }
    return "Unknown";
  };

  return (
    <div className="Cards">
      {cardData.map((card, index) => {
        const category = getCategory(card.value, card.title);
        const textColor = category === "Good" ? "#4CAF50" : "#FF6F61"; // Set text color

        return (
          <div className="parentContainer" key={index}>
            <DashboardCard
              cardData={cardData}
              title={card.title}
              titleColor={card.titleColor}
              color={card.color}
              barValue={card.barValue}
              value={<span style={{ color: textColor }}>{category}</span>} // Apply color
              png={card.png}
              iconColor={card.iconColor}
              series={card.series}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
