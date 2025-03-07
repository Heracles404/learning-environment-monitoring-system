import { Box, Button, Typography, Card, CardContent, CardActions, CardMedia } from "@mui/material";
import Header from "../../../components/Header";

import HeatIndexCards from "../../../components/ChartCards/HeatIndex/HeatIndexCards";
import HeatIndexRecordTable from "../../../components/RecordTables/HeatIndexRecordTable";
const HeatIndexMonitor = () => {
  return (
    <Box m="0 1px 0 1px" height="95vh" overflow="auto">
      {/* HEADER */}
      <Box 
      display="flex" 
      justifyContent="center"
      //  alignItems="center"
       textAlign="center  "
       sx={{
        flexDirection: { xs: 'column', sm: 'row', md: "column", lg: "row" }
      }}>   
        <Header title="HEAT INDEX" subtitle="Monitoring the Heat Index" />
      </Box>   
    {/* GRID & CHARTS */}
    <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows={{ xs: "30.5%", lg: "50%" }}
        gap="3px"
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
                <CardMedia component='img' height='210vh'
                // image="../../../assets/iaq.png"
                alt='img'/>   
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  HEAT INDEX DETAILS <br/>
                  </Typography>
                  <Typography variant='body2' color="black">
                  Ideal Heat Index Ranges <br/>
                  </Typography>
                  <Typography variant='body2' color="green">
                  Good Heat Index Range: Values between 27°C - 32°C = GOOD <br/>
                  </Typography>
                  <Typography variant='body2' color="red">
                  Bad Heat Index Range: Values above 32°C, below 27°C = BAD <br/>
                  <br/>
                  </Typography>
                  <Typography variant='body2' color="black">
                  Heat Index Threshold <br/>
                  </Typography>
                  <Typography variant='body2' color="green">
                  Good Heat Index Threshold: Line in (Chart), values below 27°C = GOOD <br/>
                  </Typography>
                  <Typography variant='body2' color="red">
                  Bad Heat Index Threshold: Line in (Chart), values above 41°C = BAD <br/>
                  </Typography>
                </CardContent>
                {/* dapat ma redirect sa faq page --> learn more button */}
                {/* <CardActions>
                  <Button size='small'>Learn more</Button>
                </CardActions> */}
              </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default HeatIndexMonitor;