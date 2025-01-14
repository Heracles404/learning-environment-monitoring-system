import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Grid from '@mui/material/Grid2';

import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import GppGoodIcon from '@mui/icons-material/GppGood';

import AirIcon from '@mui/icons-material/Air';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import WbIncandescentIcon from '@mui/icons-material/WbIncandescent';
import VolcanoIcon from '@mui/icons-material/Volcano';
import Co2Icon from '@mui/icons-material/Co2';

import DashboardCards from "../../components/DashboardCards/DashboardCards";
import DBRecords from "../../components/DashboardTables/DBRecords";

import DevicesIcon from '@mui/icons-material/Devices';
import RssFeedOutlinedIcon from '@mui/icons-material/RssFeedOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

import DBVog from "../../components/DashboardTables/DBVog";
import { httpGetActive, httpGetAllDevices } from "../../hooks/devices.requests";  
import React, { useState, useEffect } from "react"; 

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [activeDevices, setActiveDevices] = useState(null);  // Initially set to null to check if data is being fetched
  const [totalDevices, setTotalDevices] = useState(null);  // Initially set to null to check if data is being fetched

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const active = await httpGetActive();
        const allDevices = await httpGetAllDevices();

        // Debugging: Check the structure of the data
        console.log("Active Devices Data:", active);
        console.log("All Devices Data:", allDevices);

        // Assuming 'active' is an object with 'count' indicating the number of active devices
        setActiveDevices(active.count || 0); // Access 'count' from the object
        setTotalDevices(allDevices.length || 0); // Use length for all devices
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, []);

  // If state is null, it means data hasn't been fetched yet
  if (activeDevices === null || totalDevices === null) {
    return <Box>Loading...</Box>;  // Show loading state while fetching
  }
  return (
    <Box m="0 5px 0 25px" height="100vh" overflow="auto">
      {/* HEADER */}
      <Box 
      display="flex" 
      justifyContent="space-between"
       alignItems="space-between"
       sx={{
        flexDirection: { xs: 'column', sm: 'row', md: "column", lg: "row" }
      }}>
        
        <Header title="DASHBOARD" subtitle="Welcome to Edilberto S. Legaspi Integrated High School Dashboard" />
      {/* STATUS */}
    <Grid container 
    display='flex'
    justifyContent ="space-between"
    alignContent="space-between"
    pr="120px"
    ml="4px"
    rowSpacing={1}
    columnSpacing={{ xs: 1, sm: 3, md: 3 }}
    
    // pr="50px"
    mb="30px">
      <Grid item size={{ xs: 12, sm: 4, md: 4, lg: 2 }}>
        <Box
          // gridColumn="span 2"        
          backgroundColor={colors.greenAccent[600]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            borderRadius: '12px',
            height: '62px', 
            width: {
              xs: 136, // 0
              sm: 130, // 600
              md: 136, // 900
              lg: 136, // 1200
              xl: 136, // 1536
          },
          }}
        >
          <StatBox
            title="ONLINE"
            subtitle={`Devices: ${activeDevices}`}
            // progress="0.75"
            // increase="+14%"
            // icon={
            //   <DevicesIcon
            //     sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            //   />
            // }
            icon2={
              <RssFeedOutlinedIcon 
                sx={{ color: "#00cc00 " , fontSize: "46px" }}
              />
            }
          />
        </Box>
        </Grid>
        <Grid item size={{ xs: 12, sm: 4, md: 4, lg: 2 }} >
        <Box
          // gridColumn="span 2"
          backgroundColor={colors.greenAccent[600]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          mr="5px"
          sx={{
            borderRadius: '12px',
            height: '62px', 
            width: {
              xs: 136, // 0
              sm: 130, // 600
              md: 136, // 900
              lg: 136, // 1200
              xl: 136, // 1536
          },
          }}

        >
          <StatBox
            title="OFFLINE"
            subtitle={`Devices: ${totalDevices - activeDevices}`}
            // progress="0.50"
            // increase="+21%"
            // icon={
            //   <DevicesIcon
            //     sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            //   />
            // }
            icon2={
              <WarningAmberOutlinedIcon
                sx={{ color: colors.redAccent[600], fontSize: "46px" }}
              />
            }
          />
        </Box>
        </Grid>
      </Grid>

        {/* <Box>
          <Button
            sx={{
              backgroundColor: colors.greenAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box> */}
      </Box>
      
        <DashboardCards/>
        <DBRecords />
        <DBVog/>    
    </Box>
  );
};

export default Dashboard;