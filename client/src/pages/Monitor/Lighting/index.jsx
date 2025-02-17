import { Box, Button, Typography, Card, CardContent, CardActions, CardMedia } from "@mui/material";
import Header from "../../../components/Header";

import LightingCards from "../../../components/ChartCards/Lighting/LightingCards";
import LightingRecordTable from "../../../components/RecordTables/LightingRecordTable";
const LightingMonitor = () => {
  
  return (
    <Box m="0 1px 0 1px" height="100vh" overflow="auto">
      {/* HEADER */}
      <Box 
      display="flex" 
      justifyContent="center"
      //  alignItems="center"
       textAlign="center  "
       sx={{
        flexDirection: { xs: 'column', sm: 'row', md: "column", lg: "row" }
      }}>   
        <Header title="Lighting" subtitle="Monitoring the Lighting" />
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
          <Box >
            <LightingRecordTable/>
            <Card width="300px">
                <CardMedia component='img' height='240vh'
                // image="../../../assets/iaq.png"
                alt='img'/>   
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  Light Details <br/>
                  </Typography>
                  <Typography variant='body2' color="green">
                  Ideal Light Range: 300-500 lux <br/>
                  Bad Range: above 500 <br/>
                  </Typography>
                  <Typography variant='body2' color="blue">
                  Ideal Light Threshold: line  anywhere  between 300-500 <br/>
                  Bad Threshold: Line above 500 <br/>
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