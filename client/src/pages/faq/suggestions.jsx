import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";

const Suggestion = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px" height="100%" overflow="auto">
      <Header title="FAQ" subtitle="How To Improve The Environmental Parameters Of The Classroom?" />
      <Box sx={{ height: {xs:"130%", md:"100%"}
    }} >
        <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          Lighting - What to do with Bad/Danger Levels?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          No, the web based monitoring system requires network access to operate.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          Volcanic Smog - What to do with Bad/Danger Levels?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          No, the web based monitoring system requires network access to operate.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          Heat Index - What to do with Bad/Danger Levels?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          No, the web based monitoring system requires network access to operate.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          Indoor Air Quality - What to do with Bad/Danger Levels?
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

export default Suggestion;
