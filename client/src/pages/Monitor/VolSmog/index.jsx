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
  <Box m="0 5px 0 5px" height="100vh" overflow="auto">
    {/* HEADER */}
    <Box 
    display="flex" 
    justifyContent="center"
    alignItems="center"
    textAlign="center"
    >
      <Header title="Volcanic Smog" subtitle="Monitoring the Volcanic Smog" />
    </Box>
      <VolcanicSmogCards/>
    </Box> 
    )
}

export default VolSmogMonitor;