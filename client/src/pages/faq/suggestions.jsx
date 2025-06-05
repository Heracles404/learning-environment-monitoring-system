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
          Lighting - How to maintain and what to do with Bad/Danger Levels?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
How to achieve optimal levels? Ensure all light fittings function correctly, replace any burnt-out bulbs, and optimize natural light by opening curtains or blinds. Clean fixtures on a regular basis.

What to do with poor levels? If the lighting is poor, ensure faulty bulbs and fittings are checked. Rearrange workstations to optimize light exposure and add desk lamps or extra fittings as a last resort.

What to do with danger levels? When lighting is at critically low levels, inspect for electrical problems immediately. Be prepared with emergency lighting or flashlights, and leave the room if visibility is so poor that safety will be in jeopardy.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          Volcanic Smog - How to maintain and what to do with Bad/Danger Levels?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
How to maintain optimal levels? Windows and doors should be kept closed in cases of volcanic smog. Check air quality levels constantly.

What to do with poor levels? If smog levels deteriorate, seal all openings, use masks indoors, and restrict outdoor movements. Enhance ventilation effectiveness.

What to do with hazard levels? In case volcanic smog hits maximum levels, move to a safer indoor environment. Supply masks to all, adhere to health advice, and call emergency services in case of breathing problems.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          Heat Index - How to maintain and what to do with Bad/Danger Levels?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
How to ensure optimal levels? Utilize fans or air conditioning, ventilate rooms well, and make sure students drink water. Reduce direct sunlight exposure.

What to do for bad levels? When temperature increases considerably, make students consume more water and stop physical exercises. Move to a cooler region.

What to do with danger levels? If the heat index is getting to dangerous levels, relocate students to an adequately cooled area. Monitor for symptoms of heat exhaustion and seek medical care if necessary.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          Indoor Air Quality - How to maintain and what to do with Bad/Danger Levels?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
How to maintain optimal levels? Let windows remain open when air quality is healthy, stay clear of indoor pollutants, and frequently clean to avoid dust accumulation.

What to do with bad levels? If air quality worsens, boost ventilation, clear out likely pollutants. Cut down on activities that produce dust or fumes.

What to do with danger levels? If indoor air is hazardous, clear the building, use protective masks. Get medical help if breathing problems occur.          </Typography>
        </AccordionDetails>
      </Accordion>

      
      

      
      </Box>
    </Box>
  );
};

export default Suggestion;
