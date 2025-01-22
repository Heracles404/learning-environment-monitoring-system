import { Box, Typography, useTheme } from "@mui/material";
import Grid from '@mui/material/Grid2';

import { tokens } from "../../theme";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";

import DashboardCards from "../../components/DashboardCards/DashboardCards";
import DBRecords from "../../components/DashboardTables/DBRecords";

import RssFeedOutlinedIcon from '@mui/icons-material/RssFeedOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

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
  const [totalDevices, setTotalDevices] = useState(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const active = await httpGetActive();
        const allDevices = await httpGetAllDevices();

        // Debugging: Check the structure of the data
        console.log("Active Devices Data:", active);
        console.log("All Devices Data:", allDevices);

        // Assuming 'active' is an object with 'count' indicating the number of active devices
        setActiveDevices(active.count || 0);
        setTotalDevices(allDevices.length || 0);
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
    <Box m="0 3px 0 15px" height="100vh" overflow="auto">
      {/* HEADER */}
      <Box 
      display="flex" 
      justifyContent="space-between"
       alignItems="space-between"
       sx={{
        flexDirection: { xs: 'column', sm: 'row', md: "column", lg: "row" }
      }}>
        
        <Header title="DASHBOARD" subtitle="Welcome to Edilberto S. Legaspi Integrated High School Dashboard" />
    <Grid container
    display='flex'
    justifyContent ="space-between"
    alignContent="space-between"
    pr="120px"
    ml="4px"
    rowSpacing={1}
    columnSpacing={{ xs: 1, sm: 3, md: 3 }}
    
    mb="30px">
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
            subtitle2={`Inactive: ${activeDevices}`}
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
            subtitle2={`Inactive: ${totalDevices - activeDevices}`}
            icon2={
              <WarningAmberOutlinedIcon
                sx={{ color: colors.redAccent[600], fontSize: "46px" }}
              />
            }
          />
        </Box>
        </Grid>
      </Grid>
      </Box>
      <Box>
        <DashboardCards/>
      </Box>
        
{/* GRID & CHARTS */}
<Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows={{ xs: "10.5%", sm: "22%", md:"22%", lg: "21%" }}
        gap="15px"
        mt="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn={{ xs: "span 12", sm: "span 6" }}
          gridRow="span 2"
          backgroundColor={colors.greenAccent[700]}
          padding="5px"
        > 
          <Typography
            variant="h5"
            fontWeight="600"
            display="flex"
            justifyContent="center"
            color="white"
            // sx={{ marginBottom: "5px" }}
            // color={colors.greenAccent[300]}
          >
            INDOOR AIR QUALITY
          </Typography>
          <Typography>
            Inactive: 
          </Typography>
          <Box height="300px">
          {/* <Box height={{ xs: "300px", sm: "300px", md:"300px"}}> */}
          {/* // width={{xs:"110%", sm:"120%", md:"150%"}}> */}
            {/* <GeographyChart isDashboard={true} /> */}
            <AirQualityPieChart/>
            
          </Box>
          
        </Box>
        <Box
          gridColumn={{ xs: "span 12", sm: "span 6" }}
          gridRow="span 2"
          backgroundColor={colors.greenAccent[700]}
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
            LIGHT
          </Typography>
          <Typography>
            Inactive
          </Typography>
          <Box height="300px">
            {/* <GeographyChart isDashboard={true} /> */}
            <LightingPieChart/>
          </Box>
        </Box>

        
        {/* ROW 3 */}
        <Box
          gridColumn={{ xs: "span 12", sm: "span 6" }}
          gridRow="span 2"
          backgroundColor={colors.greenAccent[700]}
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
            TEMPERATURE
          </Typography>
          <Typography>
            Inactive
          </Typography>
          <Box height="300px">
            {/* <GeographyChart isDashboard={true} /> */}
            <TemperaturePieChart/>
          </Box>
        </Box>
        <Box
          gridColumn={{ xs: "span 12", sm: "span 6" }}
          gridRow="span 2"
          backgroundColor={colors.greenAccent[700]}
          padding="5px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
            display="flex"
            justifyContent="center"
            color="white"
          >
            VOG
          </Typography>
          <Typography>
            Inactive
          </Typography>
          <Box height="300px">
            {/* <GeographyChart isDashboard={true} /> */}
            <VOGPieChart/>
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default Dashboard;