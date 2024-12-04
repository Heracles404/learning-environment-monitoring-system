import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Grid from '@mui/material/Grid2';

import { mockTransactions } from "../../../data/mockData";
import { tokens } from "../../../theme";

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../../components/Header";

import StatBox from "../../../components/StatBox";
import ProgressCircle from "../../../components/ProgressCircle";
import GppGoodIcon from '@mui/icons-material/GppGood';

import AirIcon from '@mui/icons-material/Air';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import WbIncandescentIcon from '@mui/icons-material/WbIncandescent';
import VolcanoIcon from '@mui/icons-material/Volcano';
import Co2Icon from '@mui/icons-material/Co2';

const Device1 = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="0 5px 0 25px"
    width="50%"
    >
      {/* HEADER */}
      <Box 
      display="flex" 
      // justifyContent="space-between"
       alignItems="center"
       mb="10px">
        <Header title="Device Status" subtitle="Sensors" />
      </Box>

    <Typography>
      Device 1
    </Typography>
    {/* STATUS */}
    <Grid container 
    display='flex'
    justifyContent ="center"
    alignContent="center"
    rowSpacing={2}
    // columnSpacing={{ xs: 1, sm: 3, md: 3 }}
    mb="40px"
    pl="5px">
      <Grid item size={{ xs: 12, sm: 4, md: 4, lg: 6 }}>
        <Box
          // gridColumn="span 2"        
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{height: '112px', 
            width: {
              xs: 136, // 0
              sm: 110, // 600
              md: 136, // 900
              lg: 236, // 1200
              xl: 136, // 1536
          },
          }}
        >
          <StatBox
            title="Active"
            subtitle="Device 1"
            progress="0.75"
            // increase="+14%"
            icon={
              <DeviceThermostatIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        </Grid>
        <Grid item size={{ xs: 12, sm: 4, md: 4, lg: 6 }}>
        <Box
          // gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{height: '112px', 
            width: {
              xs: 136, // 0
              sm: 110, // 600
              md: 136, // 900
              lg: 236, // 1200
              xl: 136, // 1536
          },
          }}

        >
          <StatBox
            title="Working"
            subtitle="PMS5003"
            progress="0.50"
            // increase="+21%"
            icon={
              <WbIncandescentIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        </Grid>
        <Grid item size={{ xs: 12, sm: 4, md: 4, lg: 6 }}>
        <Box
          // gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{height: '112px', 
            width: {
              xs: 136, // 0
              sm: 110, // 600
              md: 136, // 900
              lg: 236, // 1200
              xl: 136, // 1536
          },
          }}

        >
          <StatBox
            title="Working"
            subtitle="BME 680"
            progress="0.30"
            // increase="+5%"
            icon={
              <AirIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        </Grid>
        <Grid item size={{ xs: 12, sm: 4, md: 4, lg: 6 }}>
        <Box
          // gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{height: '112px', 
            width: {
              xs: 236, // 0
              sm: 110, // 600
              md: 136, // 900
              lg: 236, // 1200
              xl: 136, // 1536
          },
          }}

        >
          <StatBox
            title="Working"
            subtitle="GY-302"
            progress="0.80"
            // increase="+42%"
            icon={
              <Co2Icon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        </Grid>
      </Grid>

      <Typography>
      Device 2
    </Typography>
    {/* STATUS */}
    <Grid container 
    display='flex'
    justifyContent ="center"
    alignContent="center"
    rowSpacing={2}
    // columnSpacing={{ xs: 1, sm: 3, md: 3 }}
    mb="40px"
    pl="5px">
      <Grid item size={{ xs: 12, sm: 4, md: 4, lg: 6 }}>
        <Box
          // gridColumn="span 2"        
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{height: '112px', 
            width: {
              xs: 136, // 0
              sm: 110, // 600
              md: 136, // 900
              lg: 236, // 1200
              xl: 136, // 1536
          },
          }}
        >
          <StatBox
            title="Active"
            subtitle="Device 2"
            progress="0.75"
            // increase="+14%"
            icon={
              <DeviceThermostatIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        </Grid>
        <Grid item size={{ xs: 12, sm: 4, md: 4, lg: 6 }}>
        <Box
          // gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{height: '112px', 
            width: {
              xs: 136, // 0
              sm: 110, // 600
              md: 136, // 900
              lg: 236, // 1200
              xl: 136, // 1536
          },
          }}

        >
          <StatBox
            title="Working"
            subtitle="PMS5003"
            progress="0.50"
            // increase="+21%"
            icon={
              <WbIncandescentIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        </Grid>
        <Grid item size={{ xs: 12, sm: 4, md: 4, lg: 6 }}>
        <Box
          // gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{height: '112px', 
            width: {
              xs: 136, // 0
              sm: 110, // 600
              md: 136, // 900
              lg: 236, // 1200
              xl: 136, // 1536
          },
          }}

        >
          <StatBox
            title="Working"
            subtitle="BME 680"
            progress="0.30"
            // increase="+5%"
            icon={
              <AirIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        </Grid>
        <Grid item size={{ xs: 12, sm: 4, md: 4, lg: 6 }}>
        <Box
          // gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{height: '112px', 
            width: {
              xs: 236, // 0
              sm: 110, // 600
              md: 136, // 900
              lg: 236, // 1200
              xl: 136, // 1536
          },
          }}

        >
          <StatBox
            title="Working"
            subtitle="GY-302"
            progress="0.80"
            // increase="+42%"
            icon={
              <Co2Icon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        </Grid>
      </Grid>
        
    </Box>
  );
};

export default Device1;