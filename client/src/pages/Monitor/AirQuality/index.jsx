import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../../../components/Header";
import CarbonDioxideChart from "../../../components/LineCharts/CarbonDioxide";
import Grid from '@mui/material/Grid2';
import { tokens } from "../../../theme";
import StatBox from "../../../components/StatBox";
import Co2Icon from '@mui/icons-material/Co2';

import CO2Cards from "../../../components/ChartCards/AirQuality/CO2Cards";
import ExpandedCard from "../../../components/ChartCards/AirQuality/CO2Cards";
const CarbonDioxideMonitor = () => {
  return (
        <Box m="0 5px 0 5px" height="100vh" overflow="auto">
      {/* HEADER */}
      <Box 
      display="flex" 
      justifyContent="center"
       alignItems="center"
       textAlign="center"
       >
        <Header title="Air Quality" subtitle="Monitoring the Air Quality" />
      </Box>
      <CO2Cards/>
    </Box> 
  )
}

export default CarbonDioxideMonitor;