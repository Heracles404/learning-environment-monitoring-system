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
  <Box height="100vh" overflow="auto">
  {/* HEADER */}
      <Box 
      display="flex" 
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      overflow="auto"
      >
        <Header title="Heat Index" subtitle="Monitoring the Heat Index" />
      </Box>
    <Box sx={{ pl: 2 }}>
    <Grid container>
      <Grid item xs={12} >
        <Box width="620px" mt={{xs:'300px', md: '1px'}}>
        {/* <Box m="0 5px 0 5px" height="100vh" width="750px"
        // overflow="auto"
        > */}
          <HeatIndexCards/>  
        </Box> 
      </Grid>
    <Grid item xs={12} >
      <Box width='500px' sx={{ pl: 2 }}>
          <HeatIndexRecordTable/>
          <Card width="300px">
            <CardMedia component='img' height='240vh'
            image="../../../assets/iaq.png" alt='img'/>
            
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
      </Grid>
    </Grid>
    </Box>
</Box>
  )
}
export default HeatIndexMonitor;