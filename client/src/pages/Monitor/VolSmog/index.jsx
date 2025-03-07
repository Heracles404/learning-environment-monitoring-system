import { Box, Button, Typography, Card, CardContent, CardActions, CardMedia } from "@mui/material";
import Header from "../../../components/Header";

import VolcanicSmogCards from "../../../components/ChartCards/VolcanicSmog/VolcanicSmogCards";
import VolcanicSmogRecordTable from "../../../components/RecordTables/VolcanicSmogRecordTable";
const VolSmogMonitor = () => {
  
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
        <Header title="VOLCANIC SMOG" subtitle="Monitoring the Volcanic Smog" />
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
          <VolcanicSmogCards/>
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
            <VolcanicSmogRecordTable/>
            <Card width="300px">
                <CardMedia component='img' height='240vh'
                // image="../../../assets/iaq.png"
                alt='img'/>   
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  Volcanic Smog (VOG) Ideal Range <br/>
                  </Typography>
                  <Typography variant='body2' color="green">
                  Concern Levels <br/>
                  Level 1 - PPM 0-50 <br/>
                  Level 2 - PPM 50-150 <br/>
                  Level 3 - PPM 100-250 <br/>
                  Level 4 - PPM 250+ <br/>
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
export default VolSmogMonitor;