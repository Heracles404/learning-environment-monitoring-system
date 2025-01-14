import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../../../components/Header";
import CarbonDioxideChart from "../../../components/LineCharts/CarbonDioxide";
import Grid from '@mui/material/Grid2';
import { tokens } from "../../../theme";
import StatBox from "../../../components/StatBox";
import Co2Icon from '@mui/icons-material/Co2';

import CO2Cards from "../../../components/ChartCards/AirQuality/CO2Cards";
import ExpandedCard from "../../../components/ChartCards/AirQuality/CO2Cards";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DBRecords from "../../../components/DashboardTables/DBRecords";
import AirQualityRecordTable from "../../../components/RecordTables/AirQualityRecordTable";
const CarbonDioxideMonitor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
      <Box>
        
      
      <Box 
            display="flex" 
            // justifyContent="space-between"
            //  alignItems="space-between"
             sx={{
              flexDirection: { xs: 'column', sm: 'row', md: "column", lg: "row" }
            }}>
      {/* <DBRecords/> */}
      <AirQualityRecordTable/>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.greenAccent[500]} variant="h5">
              Ideal Range for IAQ
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem .
            </Typography>
          </AccordionDetails>
        </Accordion>
        </Box>
      <CO2Cards/>
      </Box>
      
      
    </Box> 
  )
}

export default CarbonDioxideMonitor;