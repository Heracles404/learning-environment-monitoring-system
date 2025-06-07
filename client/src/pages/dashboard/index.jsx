import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, useTheme } from "@mui/material";
import Grid from '@mui/material/Grid2';

import { tokens } from "../../theme";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";

import DashboardCards from "../../components/DashboardCards/DashboardCards";
import DBRecords from "../../components/DashboardTables/DBRecords";

import SensorsIcon from '@mui/icons-material/Sensors';
import HelpIcon from '@mui/icons-material/Help';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';

import DBVog from "../../components/DashboardTables/DBVog";
import { httpGetActive, httpGetAllDevices } from "../../hooks/devices.requests";  
import React, { useState, useEffect } from "react"; 

import TemperaturePieChart from "../../components/DashboardPieChart/TemperaturePieChart";
import AirQualityPieChart from "../../components/DashboardPieChart/AirQualityPieChart";
import VOGPieChart from "../../components/DashboardPieChart/VOGPieChart";
import LightingPieChart from "../../components/DashboardPieChart/LightingPieChart";
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import Alert from '@mui/material/Alert';
import { Link } from 'react-router-dom';

const CustomDialog = ({ open, onClose, title, content1, content2, content3, content4, content5, content6, content7,content8,content9,content10,content11,content12,content13,content14,content15, }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
      <Typography variant="h5" fontWeight="bold" color="#3da58a">
        {title}
        </Typography>
        </DialogTitle>
      <DialogContent >
      <Typography display="flex"  variant="h7"  >{content14}</Typography>
      <Typography display="flex"  variant="h7"  >{content15}</Typography>
        <Typography display="flex" justifyContent="center" variant="h5" fontWeight="bold" >{content1}</Typography>
        <Typography color="green">{content2}</Typography>
        <Typography color="red">{content3}</Typography>
        

        <Typography display="flex" justifyContent="center" variant="h5" fontWeight="bold" >{content4}</Typography>
        <Typography color="green">{content5}</Typography>
        <Typography color="red">{content6}</Typography>



        {/* for VOG */}
        <Typography display="flex" justifyContent="center"  >{content13}</Typography>
        <Typography display="flex" justifyContent="center" variant="h5" fontWeight="bold" >{content12}</Typography>
        <Typography display="flex" justifyContent="center" color="green" >{content7}</Typography>
        <Typography display="flex" justifyContent="center" color="red" >{content8}</Typography>
        <Typography display="flex" justifyContent="center" color="red" >{content9}</Typography>
        <Typography display="flex" justifyContent="center" color="red" >{content10}</Typography>
        <Typography display="flex" justifyContent="center"  >{content11}</Typography>

      </DialogContent>
      <DialogActions>
          <Button sx={{backgroundColor: '#0ECCFB',height: '30px', borderRadius: '25px', fontWeight: 'bold',}}
            onClick={onClose} color="primary" variant="contained">          
            Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const Dashboard = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(null);
  const colors = tokens(theme.palette.mode);
  const [activeDevices, setActiveDevices] = useState(null);
  const [activePMS, setActivePMS] = useState(0);
  const [inactiveDevices, setInactiveDevices] = useState({
    bh1750: 0,
    bme680: 0,
    pms5003: 0,
    bh1750Rooms: [],
    bme680Rooms: [],
    pms5003Rooms: [],
    inactiveRooms: [] // Store rooms labeled as inactive here
  });
  const [totalDevices, setTotalDevices] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Revision Number 5
  // 2. Add useEffect to watch inactiveDevices and show snackbar if inactive devices present
  useEffect(() => {
    if (inactiveDevices.inactiveRooms && inactiveDevices.inactiveRooms.length > 0) {
      setSnackbarOpen(true);
    }
  }, [inactiveDevices]);
  // 3. Add a handler for closing the snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
const ViewRooms = (
  <Link to="/DeviceStatus" style={{ textDecoration: 'none', color:"white" }}>
    <Button color="white" size="small">
      View Rooms
    </Button>
  </Link>
);
const ViewStatus = (
  <Link to="/ViewNotification" style={{ textDecoration: 'none', color:"white" }}>
    <Button color="white" size="small">
      View Status
    </Button>
  </Link>
);
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const active = await httpGetActive();
        const allDevices = await httpGetAllDevices();
  
        console.log("Active Devices Data:", active);
        console.log("All Devices Data:", allDevices);
  
        setActiveDevices(active.count || 0);
        setTotalDevices(allDevices.length || 0);
  
        // Initialize inactive devices and rooms counters
        let inactive = { bh1750: 0, bme680: 0, pms5003: 0 };
        let inactiveRooms = { bh1750Rooms: [], bme680Rooms: [], pms5003Rooms: [], inactiveRooms: [] }; // Track inactive rooms
        let activePMSCount = 0;
  
        // Iterate through devices and check for inactive rooms
        allDevices.forEach(device => {
          // Track rooms labeled as "INACTIVE"
          if (device.status === "INACTIVE") {
            inactiveRooms.inactiveRooms.push(device.classroom); // Add the classroom to the inactiveRooms list
          }
  
          // Track inactive bh1750 rooms
          if (device.bh1750 === "INACTIVE") {
            inactive.bh1750 += 1;
            inactiveRooms.bh1750Rooms.push(device.classroom); // Add bh1750 rooms
          }
  
          // Track inactive bme680 rooms
          if (device.bme680 === "INACTIVE") {
            inactive.bme680 += 1;
            inactiveRooms.bme680Rooms.push(device.classroom); // Add bme680 rooms
          }
  
          // Track active PMS5003 devices
          if (device.pms5003 === "ACTIVE") {
            activePMSCount += 1;
          }
          
          // Track inactive PMS5003 rooms
          if (device.pms5003 === "INACTIVE") {
            inactive.pms5003 += 1;
            inactiveRooms.pms5003Rooms.push(device.classroom); // Add pms5003 rooms
          }
        });
  
        setInactiveDevices({ ...inactive, ...inactiveRooms });
        setActivePMS(activePMSCount);
  
        // Log the count of inactive rooms
        console.log("Inactive Rooms:", inactiveRooms.inactiveRooms);
        console.log("Inactive Rooms Count:", inactiveRooms.inactiveRooms.length);
  
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };
  
    fetchDevices();
  }, []);

  if (activeDevices === null || totalDevices === null) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box m="0 3px 0 15px" height="96vh" overflow="auto">
      {/* HEADER */}
      <Box 
        display="flex" 
        justifyContent="space-between"
        alignItems="space-between"
        sx={{
          flexDirection: { xs: 'column', sm: 'row', md: "column", lg: "row" }
        }}
      >
        <Header title="DASHBOARD" subtitle="Welcome to Edilberto S. Legaspi Integrated High School Dashboard"
        />
        <Grid container
          display='flex'
          justifyContent={{xs:"space-around", sm:"space-between", lg:"space-around"}}
          alignContent={{xs:"space-around", sm:"space-between", lg:"space-around"}}
          pr="120px"
          ml="4px"
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 3, md: 3 }}
          mb="30px"
        >
          {/* Indoor Device Stat */}
          <Grid item size={{ xs: 12, sm: 4, md: 4, lg: 2 }}>
            <Box
              backgroundColor={colors.greenAccent[600]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                borderRadius: '12px',
                height: '102px', 
                width: { xs: '140%', sm: 166, md: 166, lg: 166, xl: 166 }
              }}
            >
            <StatBox
              title="INDOOR"
              title2="DEVICE"
              subtitle={`Active: ${activeDevices}`}
              subtitle2={`Inactive: ${inactiveDevices.inactiveRooms.length}`} 
              subtitle3={`Status`}
              icon2={<SensorsIcon sx={{ color: "#0AFFBE", fontSize: "46px" }} />}
            />
            
            </Box>
          </Grid>
          
          {/* Outdoor Device Stat */}
          <Grid item size={{ xs: 12, sm: 4, md: 4, lg: 2 }}>
            <Box
              backgroundColor={colors.greenAccent[600]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              mr="5px"
              sx={{
                borderRadius: '12px',
                height: '102px', 
                width: { xs: '140%', sm: 166, md: 166, lg: 166, xl: 166 }
              }}
            >
              <StatBox
                title="OUTDOOR"
                title2="DEVICE"
                subtitle={`Active: ${activePMS}`}
                subtitle2={`Inactive: ${inactiveDevices.pms5003}`}
                subtitle3={`Status`}
                icon2={<SensorsIcon sx={{ color: "#0AFFBE", fontSize: "46px" }} />}
              />
            </Box>
          </Grid>
        </Grid>
        </Box>
      <Box>
        <DashboardCards />
        {/* <DBRecords/> */}
        {/* <DBVog/> */}
      </Box>

      {/* GRID & CHARTS */}
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows={{ xs: "10.5%", sm: "22%", md:"22%", lg: "21%" }} gap="15px" mt="20px">
        
        {/* ROW 1 */}
        <Box gridColumn={{ xs: "span 12", sm: "span 6" }} gridRow="span 2" backgroundColor={colors.greenAccent[500]} padding="5px">
          <Typography variant="h4" fontWeight="700" display="flex" justifyContent="center" color="white">
            INDOOR AIR QUALITY (IAQ)
          </Typography>
          <Box display="flex" justifyContent="center">
           <Button 
            variant="contained" 
            // color="#0ECCFB" 
            onClick={() => setOpenDialog("iaq")}
            sx={{
              backgroundColor: '#0ECCFB', 
              // height: '50px',  
              // borderRadius: '15px', 
              fontWeight: 600,
              mt: 1
          }}
          startIcon={<HelpIcon />} // Add the HelpOutlineOutlined icon here
          >
            View IAQ Details
          </Button> 
          </Box>
          
          {Object.entries(inactiveDevices.bme680Rooms).map(([room, count]) => (
            <Box backgroundColor="#d8708b" display="inline-flex" pr="10px" borderRadius='15px' mt="5px">
            <CrisisAlertIcon sx={{ fontSize: 21, color: 'white', mr: 1 }}/>
          <Typography color="white" key={room}>'{count}' Inactive IAQ Sensor</Typography>
          </Box>
        ))}
          <Box height="300px">
            <AirQualityPieChart />
          </Box>
        </Box>

        <Box gridColumn={{ xs: "span 12", sm: "span 6" }} gridRow="span 2" backgroundColor={colors.greenAccent[500]} padding="5px">
          <Typography variant="h4" fontWeight="700" display="flex" justifyContent="center" color="white">
            LIGHT
          </Typography>
          <Box display="flex" justifyContent="center">
           <Button 
            variant="contained" 
            // color="#0ECCFB" 
            onClick={() => setOpenDialog("light")}
            sx={{
              backgroundColor: '#0ECCFB', 
              // height: '50px',  
              // borderRadius: '15px', 
              fontWeight: 600,
              mt: 1
          }}
          startIcon={<HelpIcon />} // Add the HelpOutlineOutlined icon here
          >
            View Light Details
          </Button>  
          </Box>
          
          {Object.entries(inactiveDevices.bh1750Rooms).map(([room, count]) => (
            <Box backgroundColor="#d8708b" display="inline-flex" pr="10px" borderRadius='15px' mt="5px">
              <CrisisAlertIcon sx={{ fontSize: 21, color: 'white', mr: 1 }}/>
            <Typography color="white" key={room}>'{count}' Inactive Light Sensor</Typography>
            </Box>
          ))}
          <Box height="300px">
            <LightingPieChart />
          </Box>
        </Box>

        {/* ROW 3 */}
        <Box gridColumn={{ xs: "span 12", sm: "span 6" }} gridRow="span 2" backgroundColor={colors.greenAccent[500]} padding="5px">
          <Typography variant="h4" fontWeight="700" display="flex" justifyContent="center" color="white">
            HEAT INDEX
          </Typography>

          <Box display="flex" justifyContent="center">
           <Button 
            variant="contained" 
            // color="#0ECCFB" 
            onClick={() => setOpenDialog("heat")}
            sx={{
              backgroundColor: '#0ECCFB', 
              // height: '50px',  
              // borderRadius: '15px', 
              fontWeight: 600,
              mt: 1
          }}
          startIcon={<HelpIcon />} // Add the HelpOutlineOutlined icon here
          >
            View Heat Index Details
          </Button>  
          
          </Box>
          
          {Object.entries(inactiveDevices.bme680Rooms).map(([room, count]) => (
            <Box backgroundColor="#d8708b" display="inline-flex" pr="10px" borderRadius='15px' mt="5px">
            <CrisisAlertIcon sx={{ fontSize: 21, color: 'white', mr: 1 }}/>
          <Typography color="white" key={room}>'{count}' Inactive Heat Index Sensor</Typography>
          </Box>
        ))}
          <Box height="300px">
            <TemperaturePieChart />
          </Box>
        </Box>

        <Box gridColumn={{ xs: "span 12", sm: "span 6" }} gridRow="span 2" backgroundColor={colors.greenAccent[500]} padding="5px">
          <Typography variant="h4" fontWeight="700" display="flex" justifyContent="center" color="white">
            VOLCANIC SMOG (VOG)
          </Typography>
          <Box display="flex" justifyContent="center">
           <Button 
            variant="contained" 
            // color="#0ECCFB" 
            onClick={() => setOpenDialog("vog")}
            sx={{
              backgroundColor: '#0ECCFB', 
              // height: '50px',  
              // borderRadius: '15px', 
              fontWeight: 600,
              mt: 1
          }}
          startIcon={<HelpIcon />} // Add the HelpOutlineOutlined icon here
          >
            View VOG Details
          </Button> 
          
          </Box>
          {Object.entries(inactiveDevices.pms5003Rooms).map(([room, count]) => (
            <Box backgroundColor="#d8708b" display="inline-flex" pr="10px" borderRadius='15px' mt="5px">
            <CrisisAlertIcon sx={{ fontSize: 21, color: 'white', mr: 1 }}/>
          <Typography color="white" key={room}>Room {room}: '{count}' Inactive VOG Sensor</Typography>
          </Box>
        ))}
          
          <Box height="300px">
            <VOGPieChart />
          </Box>
        </Box>
        {/* TABLE ROW */}
        <Box gridColumn={{ xs: "span 12", sm: "span 6" }} gridRow="span 2" padding="5px">
          <Box height="30px">
            <DBRecords />
          </Box>
        </Box>
        <Box gridColumn={{ xs: "span 12", sm: "span 6" }} gridRow="span 2" padding="5px">
          <Box height="30px">
            <DBVog />
          </Box>
        </Box>
      </Box>

      {/* ----------------SNACKBAR FOR ALERT - REVISIONS---------------- */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}         
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }} > 
        <Alert
          onClose={handleSnackbarClose}
          severity="warning"
          variant="filled"
          sx={{ width: '100%' }}
          action={ViewRooms}
        >
          WARNING: {inactiveDevices.inactiveRooms.length} devices are INACTIVE.
        </Alert>
      </Snackbar>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}         
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }} > 
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
          action={ViewStatus}
        >
           Parameters are in BAD/DANGER level.
        </Alert>
      </Snackbar>
      
      {/* <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000} // snackbar will auto-close after 5 seconds
        onClose={handleSnackbarClose}
        message={`Warning: ${inactiveDevices.inactiveRooms.length} devices are INACTIVE.`}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        
      /> */}  
      <CustomDialog 
            open={openDialog === "iaq"} 
            onClose={() => setOpenDialog(null)} 
            title="Indoor Air Quality (IAQ) Details"
            content1="Ideal Air Quality Ranges: "
            content2="Good IAQ Range: Values below 100 index = GOOD"
            content3="Bad IAQ Range: Values above 100 = BAD"

            content4="Indoor Air Quality Threshold"
            content5="Good IAQ Threshold: Line in (Parameters), below 100 = GOOD"
            content6="Bad IAQ Threshold: Line in (Parameters), above 100 = BAD"
            content14="(1) Displays the number of Rooms that are Good/Bad when 'HOVERED' in PieChart below."
            content15="(2) Displays which Rooms are Good/Bad when PieChart below is 'CLICKED'."     
            />
      
          <CustomDialog 
            open={openDialog === "light"} 
            onClose={() => setOpenDialog(null)} 
            title="Light Details"
            content1="Ideal Light Ranges: "
            content2="Good Light Range: Values between 300-500 lux = GOOD"
            content3="Bad Light Range: Values below 300 & above 500 lux = BAD"

            content4="Light Threshold"
            content5="Good Light Threshold: Line in (Parameters), values between 300-500 lux = GOOD"
            content6="Bad Light Threshold: Line in (Parameters), values above 500 lux = BAD"
            
            content14="(1) Displays the number of Rooms that are Good/Bad when 'HOVERED' in PieChart below."
            content15="(2) Displays which Rooms are Good/Bad when PieChart below is 'CLICKED'."          
            />
          
          <CustomDialog 
            open={openDialog === "heat"} 
            onClose={() => setOpenDialog(null)} 
            title="HEAT INDEX DETAILS"
            content1="Ideal Heat Index Ranges: "
            content2="Good Heat Index Range: Values between 27°C - 32°C = GOOD"
            content3="Bad Heat Index Range: Values above 32°C, below 27°C = BAD"

            content4="Heat Index Threshold"
            content5="Good Heat Index Threshold: Line in (Parameters), values below 27°C = GOOD"
            content6="Bad Heat Index Threshold: Line in (Parameters), values above 41°C = BAD"
            
            content14="(1) Displays the number of Rooms that are Good/Bad when 'HOVERED' in PieChart below."
            content15="(2) Displays which Rooms are Good/Bad when PieChart below is 'CLICKED'."           
            />
          
          <CustomDialog 
            open={openDialog === "vog"} 
            onClose={() => setOpenDialog(null)} 
            title="Volcanic Smog (VOG) Ideal Range"
            content7="Level 1 - PPM 0-50 = GOOD"
            content8="Level 2 - PPM 50-150 = BAD "
            content9="Level 3 - PPM 100-250 = BAD"
            content10="Level 4 - PPM 250 and above = BAD" 
            content11=""
            content12="Concern Levels"
            content13="When the Particulate Matter (PPM) reaches a certain concern level, it is considered to be bad for individuals. The circle displays the current concern level for visualization. "
           />
    </Box>
  );
};

export default Dashboard;
