import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px" height="100%" overflow="auto">
      <Header title="FAQ" subtitle="Frequently Asked Questions Page for the System" />
      <Box sx={{ height: {xs:"130%", md:"100%"}
    }} >
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What is this monitoring system?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          This system is designed to read and capture environmental parameters using various sensors. 
          It measures key factors such as heat index, lighting, volcanic smog levels, and indoor air quality. 
          The system helps users make informed decisions regarding safety, comfort, and potential environmental risks.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          What sensors are used in the system to measure the environmental factors?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          The system utilizes three sensors: the BH1750, BME680, and PMS5003. The BH1750 is used for measuring ambient light intensity. The BME680 monitors temperature, humidity, and air quality, including volatile organic compounds (VOCs). Lastly, the PMS5003 detects airborne particulate matter, making it suitable for monitoring volcanic smog and air pollution levels.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          How does the monitoring system help improve classroom conditions?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          By monitoring air quality and environmental conditions, the system helps identify issues that could affect health or comfort, allowing timely corrective actions.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          Can the monitoring system operate without internet access?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          No, the web based monitoring system requires network access to operate.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      </Box>
    </Box>
  );
};

export default FAQ;
