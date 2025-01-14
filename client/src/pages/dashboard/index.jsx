import { Box, Grid, useTheme } from "@mui/material";
import React, { useState, useEffect } from "react"; 
import { tokens } from "../../theme";
import { httpGetActive, httpGetAllDevices } from "../../hooks/devices.requests";  
import StatBox from "../../components/StatBox";
import RssFeedOutlinedIcon from "@mui/icons-material/RssFeedOutlined";
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import Header from "../../components/Header";  

import DashboardCards from "../../components/DashboardCards/DashboardCards"; 
import DBRecords from "../../components/DashboardTables/DBRecords"; 
import DBVog from "../../components/DashboardTables/DBVog"; 

import LineChart from "../../components/LineChart"; 
import BarChart from "../../components/BarChart"; 

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
        <Grid container display='flex' justifyContent="space-between" alignContent="space-between" pr="120px" ml="4px" rowSpacing={1} columnSpacing={{ xs: 1, sm: 3, md: 3 }} mb="30px">
          <Grid item size={{ xs: 12, sm: 4, md: 4, lg: 2 }}>
            <Box
              backgroundColor={colors.greenAccent[600]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                borderRadius: '12px',
                height: '62px',
                width: { xs: 136, sm: 130, md: 136, lg: 136, xl: 136 },
              }}
            >
              <StatBox
                title="ONLINE"
                subtitle={`Device ${activeDevices}`}
                icon2={
                  <RssFeedOutlinedIcon sx={{ color: "#00cc00", fontSize: "46px" }} />
                }
              />
            </Box>
          </Grid>

          <Grid item size={{ xs: 12, sm: 4, md: 4, lg: 2 }}>
            <Box
              backgroundColor={colors.greenAccent[600]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              mr="5px"
              sx={{
                borderRadius: '12px',
                height: '62px',
                width: { xs: 136, sm: 130, md: 136, lg: 136, xl: 136 },
              }}
            >
              <StatBox
                title="OFFLINE"
                subtitle={`Device ${totalDevices - activeDevices}`}  /* Showing raw data for offline devices */
                icon2={
                  <WarningAmberOutlinedIcon sx={{ color: colors.redAccent[600], fontSize: "46px" }} />
                }
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Dashboard Cards */}
      <DashboardCards />
      
      {/* Dashboard Tables */}
      <DBRecords />
      <DBVog />
      
      {/* Charts */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={6}>
          <LineChart />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <BarChart />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
