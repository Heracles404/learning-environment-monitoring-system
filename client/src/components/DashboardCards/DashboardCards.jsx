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
      return value <= 100 ? "GOOD" : "BAD";
    } else if (type === "Heat Index") {
      return value <= 32 ? "GOOD" : "BAD";
    } else if (type === "Lighting") {
      return value < 300 || value > 500 ? "BAD" : "GOOD"; // < 300 and > 500
    } else if (type === "Volcanic Smog") {
      return value <= 50 ? "GOOD" : "BAD"; // 100
    }
    return "Unknown";
  };
  

  return (
    <div className="Cards">
      {cardData.map((card, index) => {
        const category = getCategory(card.value, card.title);
        const textColor = category === "GOOD" ? "#33FF7A" : "#FF0A0A"; // Set text color

        return (
          <div className="parentContainer" key={index}>
            <DashboardCard
              cardData={cardData}
              title={card.title}
              // titleColor={card.titleColor}
              color={card.color}
              barValue={card.barValue}
              value={<span style={{ color: textColor }}>{category}</span>} // Apply color
              png={card.png}
              // iconColor={card.iconColor}
              series={card.series}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
