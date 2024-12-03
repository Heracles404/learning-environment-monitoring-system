import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../../../components/Header";
import CarbonDioxideChart from "../../../components/LineCharts/CarbonDioxide";
import Grid from '@mui/material/Grid2';
import { tokens } from "../../../theme";
import StatBox from "../../../components/StatBox";
import Co2Icon from '@mui/icons-material/Co2';

import LightingCards from "../../../components/ChartCards/Lighting/LightingCards";
import ExpandedCard from "../../../components/ChartCards/AirQuality/CO2Cards";
const LightingMonitor = () => {
  return (
    <div className="MainContainer">
      <div className="MainDash">
        <h1>Lighting</h1>
        <LightingCards/>
      </div>
    </div>
  )
}

export default LightingMonitor;