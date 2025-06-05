import React, { useState, useEffect } from "react"; 
import './DashboardCards.css';
import DashboardCard from '../DashboardCard/DashboardCard';
import { fetchCardData } from "../../data/mockChartData";

const DashboardCards = () => {
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    fetchCardData(setCardData);
  }, []);

  const getCategory = (value, type) => {
    if (type === "IAQ Index") {
      if (value <= 150) return "GOOD";
      if (value <= 300) return "BAD";
      if (value <= 500) return "DANGER";
    }

    if (type === "Heat Index") {
      if (value <= 27) return "GOOD";
      if (value <= 35) return "BAD";
      if (value >= 36) return "DANGER";
    }

    if (type === "Lighting") {
      if (value === -1) return "NIGHT";
      if (value <= 20) return "CLOSED";
      if (value >= 300) return "GOOD";
      if (value <= 299) return "DIM";
      if (value <= 150) return "BAD";
    }

    if (type === "Volcanic Smog") {
      const level = Number(value);
      if (level === 1) return "GOOD";
      if (level === 2 || level === 3) return "BAD";
      if (level === 4) return "DANGER";
      return "UNKNOWN";
    }

    return "UNKNOWN";
  };

  const getTextColor = (category) => {
    switch (category) {
      case "GOOD":
        return "#33FF7A";
      case "BAD":
        return "#FF0A0A";
      case "DANGER":
        return "#990000";
      case "DIM":
        return "#ff9933";
      case "NIGHT":
        return "#333333";
      case "UNKNOWN":
        return "#999999";
      default:
        return "#000000"; // Fallback color
    }
  };

  return (
    <div className="Cards">
      {cardData.map((card, index) => {
        const category = getCategory(card.value, card.title);
        const textColor = getTextColor(category);

        return (
          <div className="parentContainer" key={index}>
            <DashboardCard
              cardData={cardData}
              title={card.title}
              color={card.color}
              barValue={card.barValue}
              value={<span style={{ color: textColor }}>{category}</span>}
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
