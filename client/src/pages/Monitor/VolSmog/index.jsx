import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../../../components/Header";
import CarbonDioxideChart from "../../../components/LineCharts/CarbonDioxide";
import Grid from '@mui/material/Grid2';
import { tokens } from "../../../theme";
import StatBox from "../../../components/StatBox";
import Co2Icon from '@mui/icons-material/Co2';

import VolcanicSmogCards from "../../../components/ChartCards/VolcanicSmog/VolcanicSmogCards";
import ExpandedCard from "../../../components/ChartCards/AirQuality/CO2Cards";
const VolSmogMonitor = () => {
  return (
    <div className="MainContainer">
      <div className="MainDash">
        <h1>Volcanic Smog</h1>
        <VolcanicSmogCards/>
      </div>
    </div>
  )
}

export default VolSmogMonitor;