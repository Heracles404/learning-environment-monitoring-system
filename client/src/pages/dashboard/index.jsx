import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, useTheme } from "@mui/material";
import Grid from '@mui/material/Grid2';

import { tokens } from "../../theme";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";

import DashboardCards from "../../components/DashboardCards/DashboardCards";
import DBRecords from "../../components/DashboardTables/DBRecords";

import SensorsIcon from '@mui/icons-material/Sensors';
import HelpIcon from '@mui/icons-material/Help';

import DBVog from "../../components/DashboardTables/DBVog";
import { httpGetActive, httpGetAllDevices } from "../../hooks/devices.requests";  
import React, { useState, useEffect } from "react"; 

import TemperaturePieChart from "../../components/DashboardPieChart/TemperaturePieChart";
import AirQualityPieChart from "../../components/DashboardPieChart/AirQualityPieChart";
import VOGPieChart from "../../components/DashboardPieChart/VOGPieChart";
import LightingPieChart from "../../components/DashboardPieChart/LightingPieChart";
const CustomDialog = ({ open, onClose, title, content1, content2, content3, content4, content5, content6, content7,content8 }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
      <Typography variant="h5" fontWeight="bold" color="#3da58a">
        {title}
        </Typography>
        </DialogTitle>
      <DialogContent >
        <Typography display="flex" justifyContent="center" variant="h5" fontWeight="bold" color="green">{content6}</Typography>
        <Typography>{content1}</Typography>
        <Typography>{content3}</Typography>
        

        {/* <Typography>{content5}</Typography> */}

        <Typography display="flex" justifyContent="center" variant="h5" fontWeight="bold" color="red">{content7}</Typography>
        <Typography display="flex" justifyContent="center" variant="h5" fontWeight="bold" color="blue">{content8}</Typography>
        <Typography>{content2}</Typography>
        <Typography>{content4}</Typography>
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
  const [inactiveDevices, setInactiveDevices] = useState({
    bh1750: 0,
    bme680: 0,
    pms5003: 0,
    bh1750Rooms: {},
    bme680Rooms: {},
    pms5003Rooms: {}
  });
  const [totalDevices, setTotalDevices] = useState(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const active = await httpGetActive();
        const allDevices = await httpGetAllDevices();

        console.log("Active Devices Data:", active);
         console.log("All Devices Data:", allDevices);

        setActiveDevices(active.count || 0);
        setTotalDevices(allDevices.length || 0);

        // Calculate inactive devices for each sensor type and store rooms with count
        let inactive = { bh1750: 0, bme680: 0, pms5003: 0 };
        let inactiveRooms = { bh1750Rooms: {}, bme680Rooms: {}, pms5003Rooms: {} };

        allDevices.forEach(device => {
          if (device.bh1750 === "INACTIVE") {
            inactive.bh1750 += 1;
            inactiveRooms.bh1750Rooms[device.classroom] = (inactiveRooms.bh1750Rooms[device.classroom] || 0) + 1;
          }
          if (device.bme680 === "INACTIVE") {
            inactive.bme680 += 1;
            inactiveRooms.bme680Rooms[device.classroom] = (inactiveRooms.bme680Rooms[device.classroom] || 0) + 1;
          }
          if (device.pms5003 === "INACTIVE") {
            inactive.pms5003 += 1;
            inactiveRooms.pms5003Rooms[device.classroom] = (inactiveRooms.pms5003Rooms[device.classroom] || 0) + 1;
          }
        });

        setInactiveDevices({ ...inactive, ...inactiveRooms });
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
        <Header title="DASHBOARD" subtitle="Welcome to Edilberto S. Legaspi Integrated High School Dashboard" />
        <Grid container
        display='flex'
        justifyContent="space-between"
        alignContent="space-between"
        pr="120px"
        ml="4px"
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 3, md: 3 }}
        mb="30px"
      >
        <Grid item size={{ xs: 12, sm: 4, md: 4, lg: 2 }}>
          <Box
            backgroundColor={colors.greenAccent[600]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              borderRadius: '12px',
              height: '82px', 
              width: {
                xs: '130%', // 0
                sm: 150, // 600
                md: 156, // 900
                lg: 156, // 1200
                xl: 156, // 1536
              },
            }}
          >
            <StatBox
              title="INDOOR"
              subtitle={`Active: ${activeDevices}`}
              subtitle2={`Inactive: ${inactiveDevices.bme680}`}
              icon2={<SensorsIcon sx={{ color: "#0AFFBE", fontSize: "46px" }} />}
            />
          </Box>
        </Grid>
        <Grid item size={{ xs: 12, sm: 4, md: 4, lg: 2 }} >
          <Box
            backgroundColor={colors.greenAccent[600]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            mr="5px"
            sx={{
              borderRadius: '12px',
              height: '82px', 
              width: {
                xs: '130%', // 0
                sm: 150, // 600
                md: 156, // 900
                lg: 156, // 1200
                xl: 156, // 1536
              },
            }}
          >
            <StatBox
              title="OUTDOOR"
              subtitle={`Active: ${totalDevices - activeDevices}`}
              subtitle2={`Inactive: ${inactiveDevices.pms5003}`}
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
            <Typography color="white" key={room}>Room {room}: {count} inactive sensor(s)</Typography>
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
            <Typography color="white" key={room}>Room {room}: {count} inactive sensor(s)</Typography>
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
            <Typography color="white" key={room}>Room {room}: {count} inactive sensor(s)</Typography>
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
            <Typography color="white" key={room}>Room {room}: {count} inactive sensor(s)</Typography>
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
      <CustomDialog 
            open={openDialog === "iaq"} 
            onClose={() => setOpenDialog(null)} 
            title="Indoor Air Quality (IAQ) Details - DESIGN 1"
            content6="Ideal Air Quality Ranges: "
            content1="Ideal IAQ Range: Below 100 index"
            content2="Ideal Air Threshold: line anywhere below 100 is good"

            content8="Ideal Air Threshold"
            content3="Bad Range: above 100"

            content4="Bad Threshold: Line above 100"
            content5="----"
            />
      
          <CustomDialog 
            open={openDialog === "light"} 
            onClose={() => setOpenDialog(null)} 
            title="Light Details - DESIGN 2"
            content1="Ideal Light Range: 300-500 lux"
            content2="Bad Range: above 500"
            content3="Ideal Light Threshold: line  anywhere  between 300-500"
            content4="Bad Threshold: Line above 500 "
            content5="----"
            />
          
          <CustomDialog 
            open={openDialog === "heat"} 
            onClose={() => setOpenDialog(null)} 
            title="HEAT INDEX DETAILS - DESIGN 3"
            content6="Good Heat Index Ranges: "
            content1="Good Heat Index Range: 27°C - 41°C"
            content2="Bad Heat IndexRange: above 41°C"

            content5="----"

            content7="Bad Heat Index Ranges:"
            content3="Good Heat Index Threshold: 27°C"
            content4="Bad Heat Index Threshold: above 41°C"
            />
          
          <CustomDialog 
            open={openDialog === "vog"} 
            onClose={() => setOpenDialog(null)} 
            title="Volcanic Smog (VOG) Ideal Range"
            content1="Level 1 - PPM 0-50 "
            content2="Level 2 - PPM 50-150 "
            content3="Level 3 - PPM 100-250 "
            content4="Level 4 - PPM 250+ "
            content5=""
            content6="Concern Levels"
           />
    </Box>
  );
};

export default Dashboard;
