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
        <Header title="Indoor Air Quality (IAQ)" subtitle="Monitoring the IAQ" />
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
          <Box >
            <AirQualityRecordTable/>
            <Card width="300px">
                <CardMedia component='img' height='240vh'
                // image="../../../assets/iaq.png"
                alt='img'/>   
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  Indoor Air Quality (IAQ) Details <br/>
                  </Typography>
                  <Typography variant='body2' color="green">
                    Ideal Air Quality Ranges:  <br/>
                    Ideal IAQ Range: Below 100 index <br/>
                    Ideal Air Threshold: line anywhere below 100 is good <br/>

                  </Typography>
                  <Typography variant='body2' color="blue">
                  Ideal Air Threshold <br/>
                    Bad Range: above 100 <br/>
                    Bad Threshold: Line above 100 <br/>
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