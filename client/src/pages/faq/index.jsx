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
      <Header title="FAQ" subtitle="Frequently Asked Questions Page" />
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
          This system is designed to track and analyze environmental conditions in real time using various sensors. 
          It measures key factors such as heat index, temperature, lighting, smog levels, air quality, and humidity. 
          By continuously collecting and displaying this data, the system helps users make informed decisions regarding safety, comfort, and potential environmental risks.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What are we monitoring? 
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          We are monitoring various environmental factors, including heat index, temperature, lighting, and smog levels. 
          Additionally, the system tracks air quality, humidity, and other relevant parameters to provide real-time insights into environmental conditions. 
          This data helps assess safety, comfort, and potential hazards in a given area.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          Placeholer
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          Placeholer
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
            {/* makikita ng user pag nag learn more sa text holder ng monitor -params- <br/>ilagay yung nasa RRL. */}
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          Placeholer
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
            {/* makikita ng user pag nag learn more sa text holder ng monitor -params- <br/>ilagay yung nasa RRL. */}
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      </Box>
    </Box>
  );
};

export default FAQ;
