import { Box, Button, IconButton, Typography, useTheme, Card, CardContent, CardActions, CardMedia } from "@mui/material";
import Header from "../../../components/Header";
import Grid from '@mui/material/Grid2';
import { tokens } from "../../../theme";
import StatBox from "../../../components/StatBox";
import Co2Icon from '@mui/icons-material/Co2';

import HeatIndexCards from "../../../components/ChartCards/HeatIndex/HeatIndexCards";
import ExpandedCard from "../../../components/ChartCards/AirQuality/CO2Cards";
import HeatIndexRecordTable from "../../../components/RecordTables/HeatIndexRecordTable";
const HeatIndexMonitor = () => {
  
  return (
    <Box m="0 3px 0 15px" height="100vh" overflow="auto">
      {/* HEADER */}
      <Box 
      display="flex" 
      justifyContent="center"
      //  alignItems="center"
       textAlign="center  "
       sx={{
        flexDirection: { xs: 'column', sm: 'row', md: "column", lg: "row" }
      }}>   
        <Header title="Heat Index" subtitle="Monitoring the Heat Index" />
      </Box>   
    {/* GRID & CHARTS */}
    <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows={{ xs: "30.5%", lg: "50%" }}
        gap="15px"
        mt="5px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn={{ xs: "span 12", sm: "span 6" }}
          gridRow="span 2"
          // backgroundColor={colors.greenAccent[900]}
          padding="5px"
        > 
          <HeatIndexCards/>
        </Box>
        <Box
          gridColumn={{ xs: "span 12", sm: "span 6" }}
          gridRow="span 2"
          // backgroundColor={colors.greenAccent[900]}
          padding="5px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "5px" }}
            display="flex"
            justifyContent="center"
            color="white"
          >
            Heat Index
          </Typography>
          <Box >
            <HeatIndexRecordTable/>
            <Card width="300px">
                <CardMedia component='img' height='240vh'
                // image="../../../assets/iaq.png"
                alt='img'/>   
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Ideal IAQ
                  </Typography>
                  <Typography variant='body2' color="red">
                    The ideal IAQ range is 1-5. <br/>
                    Status: Good / Bad. <br/>
                    Formula:
                  </Typography>
                </CardContent>
                {/* dapat ma redirect sa faq page --> learn more button */}
                <CardActions>
                  <Button size='small'>Learn more</Button>
                </CardActions>
              </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default HeatIndexMonitor;