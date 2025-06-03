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
    if (value >= 0 && value <= 100) return "GOOD";
    if (value > 100 && value <= 200) return "WARNING";
    if (value > 200) return "BAD";
  }

  if (type === "Heat Index") {
    if (value >= 27 && value <= 41) return "GOOD";
    if (value > 41 && value <= 51) return "WARNING";
    if (value > 51) return "BAD";
  }

  if (type === "Lighting") {
    if (value === -1) return "NIGHT";
    if (value >= 0 && value <= 30) return "CLOSED";
    if (value > 30 && value <= 150) return "GOOD";
    if (value > 150 && value <= 500) return "WARNING";
    if (value > 500) return "BAD";
  }

  if (type === "Volcanic Smog") {
    if (value >= 0 && value <= 100) return "GOOD";
    if (value > 100 && value <= 200) return "WARNING";
    if (value > 200 && value <= 300) return "BAD";
    if (value > 300 && value <= 500) return "EXTREME";
  }

  return "UNKNOWN";
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
