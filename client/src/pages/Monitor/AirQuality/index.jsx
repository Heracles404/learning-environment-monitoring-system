import { Box, Button, Typography, Card, CardContent, CardActions, CardMedia } from "@mui/material";
import Header from "../../../components/Header";

import CO2Cards from "../../../components/ChartCards/AirQuality/CO2Cards";
import AirQualityRecordTable from "../../../components/RecordTables/AirQualityRecordTable";
const CarbonDioxideMonitor = () => {
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
        <Header title="INDOOR AIR QUALITY (IAQ)" subtitle="Monitoring the IAQ" />
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
          <CO2Cards/>
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
            INDOOR AIR QUALITY
          </Typography>
          <Box 
          paddingTop={{xs: "90px"}}
          >
            <AirQualityRecordTable/>
            <Card width="300px">
                {/* <CardMedia component='img' 
                height='210vh'
                image="../../../params/iaq.png"
                alt='img'/>    */}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  INDOOR AIR QUALITY (IAQ) DETAILS <br/>
                  </Typography>
                  <Typography variant='body2' color="black">
                  Ideal Air Quality Ranges:  <br/>
                    </Typography>
                  <Typography variant='body2' justifyContent="center" color="green">
                  Good IAQ Range: Values below 100 index = GOOD" <br/>
                  </Typography>
                  <Typography variant='body2' color="red">
                  Bad IAQ Range: Values above 100 = BAD <br/>
                  <br/>
                  </Typography>
                  <Typography variant='body2' justifyContent="center" color="black">
                  Indoor Air Quality Threshold: <br/>
                  </Typography>
                  <Typography variant='body2' color="green">
                  Good IAQ Threshold: Line in (Chart), below 100 = GOOD <br/>
                  </Typography>
                  <Typography variant='body2' color="red">
                  Bad IAQ Threshold: Line in (Chart), above 100 = BAD <br/>
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
export default CarbonDioxideMonitor;