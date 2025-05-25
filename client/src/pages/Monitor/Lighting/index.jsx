import { Box, Button, Typography, Card, CardContent, CardActions, CardMedia } from "@mui/material";
import Header from "../../../components/Header";

import LightingCards from "../../../components/ChartCards/Lighting/LightingCards";
import LightingRecordTable from "../../../components/RecordTables/LightingRecordTable";
const LightingMonitor = () => {
  
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
        <Header title="LIGHTING" subtitle="Monitoring the Lighting" />
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
          <LightingCards/>
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
          <Box 
          paddingTop={{xs: "90px"}}
          >
            <LightingRecordTable/>
            <Card width="300px">
                {/* <CardMedia component='img' 
                height='200vh'
                image="../../../params/lux.png"

                alt='img'/>    */}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  LIGHT DETAILS <br/>
                  </Typography>
                  <Typography variant='body2' color="black">
                  Ideal Light Ranges <br/>
                  </Typography>
                  <Typography variant='body2' color="green">
                  Good Light Range: Values between 300-500 lux = GOOD <br/>
                  </Typography>
                  <Typography variant='body2' color="red">
                  Bad Light Range: Values below 300 & above 500 lux = BAD <br/>
                  <br/>
                  </Typography>
                  <Typography variant='body2' color="black">
                  Light Threshold <br/>
                  </Typography>
                  <Typography variant='body2' color="green">
                  Good Light Threshold: Line in (Chart), values between 300-500 lux = GOOD <br/>
                  </Typography>
                  <Typography variant='body2' color="red">
                  Bad Light Threshold: Line in (Chart), values above 500 lux = BAD <br/>
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
export default LightingMonitor;