import React, { useState, useEffect } from "react"; 
import './DashboardCards.css';
import DashboardCard from '../DashboardCard/DashboardCard';
import { fetchCardData } from "../../data/mockChartData";
import { Snackbar, Alert, Button } from "@mui/material";
import { Link } from "react-router-dom";

const DashboardCards = () => {
  const [cardData, setCardData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    // Fetch data initially
    fetchCardData(setCardData);

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      fetchCardData(setCardData);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-check for bad values whenever cardData updates
    const hasBadValue = cardData.some((card) => {
      const category = getCategory(card.value, card.title);
      return category === "BAD";
    });

    setSnackbarOpen(hasBadValue);
  }, [cardData]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const getCategory = (value, type) => {
    if (type === "IAQ Index") {
      if (value <= 150) return "GOOD";
      if (value <= 300) return "CRITICAL";
      if (value >= 301) return "BAD";
    }

    if (type === "Heat Index") {
      if (value <= 27) return "GOOD";
      if (value <= 35) return "CRITICAL";
      if (value >= 36) return "BAD";
    }

    if (type === "Lighting") {
      if (value === -1) return "NIGHT";
      if (value <= 20) return "DARK";
      if (value >= 300) return "GOOD";
      if (value <= 299) return "DIM";
      if (value <= 150) return "BAD";
    }

    if (type === "Volcanic Smog") {
      const level = Number(value);
      if (level === 1) return "GOOD";
      if (level === 2 || level === 3) return "CRITICAL";
      if (level === 4) return "BAD";
      return "INACTIVE";
    }

    return "INACTIVE";
  };

  const getTextColor = (category) => {
    switch (category) {
      case "GOOD": return "#33FF7A";
      case "CRITICAL": return "#FF0A0A";
      case "BAD": return "#F50000";
      case "DIM": return "#ff9933";
      case "DARK": return "#333333";
      case "NIGHT": return "#141414";
      case "INACTIVE": return "#999999";
      default: return "#000000";
    }
  };

  const ViewStatus = (
    <Link to="/ViewNotification" style={{ textDecoration: 'none', color:"white" }}>
      <Button color="white" size="small">
        View Status
      </Button>
    </Link>
  );

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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
          action={ViewStatus}
        >
          Parameters are in BAD/DANGER level.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DashboardCards;
