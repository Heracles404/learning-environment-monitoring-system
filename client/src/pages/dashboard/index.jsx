import { Box, Typography, useTheme } from "@mui/material";
import Grid from '@mui/material/Grid2';

import { tokens } from "../../theme";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";

import DashboardCards from "../../components/DashboardCards/DashboardCards";
import DBRecords from "../../components/DashboardTables/DBRecords";

import RssFeedOutlinedIcon from '@mui/icons-material/RssFeedOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import SensorsIcon from '@mui/icons-material/Sensors';

import DBVog from "../../components/DashboardTables/DBVog";
import { httpGetActive, httpGetAllDevices } from "../../hooks/devices.requests";  
import React, { useState, useEffect } from "react"; 

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";

import TemperaturePieChart from "../../components/DashboardPieChart/TemperaturePieChart";
import AirQualityPieChart from "../../components/DashboardPieChart/AirQualityPieChart";
import VOGPieChart from "../../components/DashboardPieChart/VOGPieChart";
import LightingPieChart from "../../components/DashboardPieChart/LightingPieChart";

const Dashboard = () => {
  const theme = useTheme();
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
          if (device.bh1750 === "inactive") {
            inactive.bh1750 += 1;
            inactiveRooms.bh1750Rooms[device.classroom] = (inactiveRooms.bh1750Rooms[device.classroom] || 0) + 1;
          }
          if (device.bme680 === "inactive") {
            inactive.bme680 += 1;
            inactiveRooms.bme680Rooms[device.classroom] = (inactiveRooms.bme680Rooms[device.classroom] || 0) + 1;
          }
          if (device.pms5003 === "inactive") {
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
                xs: '140%', // 0
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
                xs: '140%', // 0
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
            INDOOR AIR QUALITY
          </Typography>
          {Object.entries(inactiveDevices.bme680Rooms).map(([room, count]) => (
            <Typography key={room}>Room {room}: {count} inactive sensor(s)</Typography>
          ))}
          <Box height="300px">
            <AirQualityPieChart />
          </Box>
        </Box>

        <Box gridColumn={{ xs: "span 12", sm: "span 6" }} gridRow="span 2" backgroundColor={colors.greenAccent[500]} padding="5px">
          <Typography variant="h4" fontWeight="700" display="flex" justifyContent="center" color="white">
            LIGHT
          </Typography>
          {Object.entries(inactiveDevices.bh1750Rooms).map(([room, count]) => (
            <Typography key={room}>Room {room}: {count} inactive sensor(s)</Typography>
          ))}
          <Box height="300px">
            <LightingPieChart />
          </Box>
        </Box>

        {/* ROW 3 */}
        <Box gridColumn={{ xs: "span 12", sm: "span 6" }} gridRow="span 2" backgroundColor={colors.greenAccent[500]} padding="5px">
          <Typography variant="h4" fontWeight="700" display="flex" justifyContent="center" color="white">
            TEMPERATURE
          </Typography>
          {Object.entries(inactiveDevices.bme680Rooms).map(([room, count]) => (
            <Typography key={room}>Room {room}: {count} inactive sensor(s)</Typography>
          ))}
          <Box height="300px">
            <TemperaturePieChart />
          </Box>
        </Box>

        <Box gridColumn={{ xs: "span 12", sm: "span 6" }} gridRow="span 2" backgroundColor={colors.greenAccent[500]} padding="5px">
          <Typography variant="h4" fontWeight="700" display="flex" justifyContent="center" color="white">
            VOG
          </Typography>
          {Object.entries(inactiveDevices.pms5003Rooms).map(([room, count]) => (
            <Typography key={room}>Room {room}: {count} inactive sensor(s)</Typography>
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
    </Box>
  );
};

export default Dashboard;
