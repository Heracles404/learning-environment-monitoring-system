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
import GeographyChart from "../../components/GeographyChart";
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

import OxygenChart from "../../components/LineCharts/Oxygen";
import CarbonDioxideChart from "../../components/LineCharts/CarbonDioxide";
import VolSmogChart from "../../components/LineCharts/VolSmog";
import HeatIndexChart from "../../components/LineCharts/HeatIndex";
import LightingChart from "../../components/LineCharts/Lighting";
import HeadCountChart from "../../components/LineCharts/HeadCount";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="0 5px 0 25px">
      {/* HEADER */}
      <Box 
      display="flex" 
      // justifyContent="space-between"
       alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to Edilberto S. Legaspi Integrated High School
        " />

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


      {/* STATUS */}
    <Grid container 
    display='flex'
    justifyContent ="space-evenly"
    alignContent="space-evenly"
    rowSpacing={1}
    columnSpacing={{ xs: 1, sm: 3, md: 3 }}>
      <Grid item size={{ xs: 6, sm: 4, md: 4, lg: 2 }}>
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
              lg: 136, // 1200
              xl: 136, // 1536
          },
          }}
        >
          <StatBox
            title="GOOD"
            subtitle="Heat Index"
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
        <Grid item size={{ xs: 6, sm: 4, md: 4, lg: 2 }}>
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
              lg: 136, // 1200
              xl: 136, // 1536
          },
          }}

        >
          <StatBox
            title="GOOD"
            subtitle="Lighting"
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
        <Grid item size={{ xs: 6, sm: 4, md: 4, lg: 2 }}>
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
              lg: 136, // 1200
              xl: 136, // 1536
          },
          }}

        >
          <StatBox
            title="GOOD"
            subtitle="Oxygen"
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
        <Grid item size={{ xs: 6, sm: 4, md: 4, lg: 2 }}>
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
              lg: 136, // 1200
              xl: 136, // 1536
          },
          }}

        >
          <StatBox
            title="BAD"
            subtitle="Carbon Dioxide"
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
        <Grid item size={{ xs: 6, sm: 4, md: 4, lg: 2 }}>
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
              lg: 136, // 1200
              xl: 136, // 1536
          },
          }}

        >
          <StatBox
            title="BAD"
            subtitle="Volcanic Smog"
            progress="0.80"
            // increase="+41%"
            icon={
              <VolcanoIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        </Grid>
        <Grid item size={{ xs: 6, sm: 4, md: 4, lg: 2 }}>

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
              lg: 136, // 1200
              xl: 136, // 1536
          },
          }}

        >
          <StatBox
            title="BAD"
            subtitle="Head Count"
            progress="0.90"
            // increase="+43%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        </Grid>
      </Grid>

      {/* Charts Container*/}
      <Grid container columnSpacing={{ xs: 1, sm: 1, md: 3 }}>
      <Grid>
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="15px" // margin
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
            sx={{width: '300px',  height: '70px'}} // charts
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Air Quality
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Oxygen
              </Typography>
            </Box>
            {/* <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box> */}
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        </Grid>
        <Grid>
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="15px" // margin
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
            sx={{width: '300px',  height: '70px'}} // charts
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Air Quality
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Carbon Dioxide
              </Typography>
            </Box>
            {/* <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box> */}
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        </Grid>
        <Grid>
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="15px" // margin
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
            sx={{width: '300px',  height: '70px'}} // charts

          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Volcanic Smog
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Particulate Matters 2.5, 5, 10
              </Typography>
            </Box>
            {/* <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box> */}
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        </Grid>
        <Grid>
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="15px" // margin
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
            sx={{width: '300px',  height: '70px'}} // charts

          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Heat Index
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Temperature, Humidity
              </Typography>
            </Box>
            {/* <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box> */}
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        </Grid>
        <Grid>
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="15px" // margin
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
            sx={{width: '300px',  height: '70px'}} // charts

          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Lighting
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Lux
              </Typography>
            </Box>
            {/* <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box> */}
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        </Grid>
        <Grid>
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="15px" // margin
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
            sx={{width: '300px',  height: '70px'}} // charts

          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Head Count
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Students Present in Room
              </Typography>
            </Box>
            {/* <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box> */}
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        </Grid>
      </Grid>

    </Box>
  );
};

export default Dashboard;