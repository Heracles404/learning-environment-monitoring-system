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
import DBAccounts from "../../components/DashboardTables/DBAccounts";

import DevicesIcon from '@mui/icons-material/Devices';
import RssFeedOutlinedIcon from '@mui/icons-material/RssFeedOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

import OxygenChart from "../../components/LineCharts/Oxygen";
import CarbonDioxideChart from "../../components/LineCharts/CarbonDioxide";
import VolSmogChart from "../../components/LineCharts/VolSmog";
import HeatIndexChart from "../../components/LineCharts/HeatIndex";
import LightingChart from "../../components/LineCharts/Lighting";
import HeadCountChart from "../../components/LineCharts/HeadCount";
import DBVog from "../../components/DashboardTables/DBVog";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="0 5px 0 25px">
      {/* HEADER */}
      <Box 
      display="flex" 
      justifyContent="space-between"
       alignItems="space-between">
        <Header title="DASHBOARD" subtitle="Welcome to Edilberto S. Legaspi Integrated High School Dashboard
        " />
  
      </Box>

      <DashboardCards/>
      <DBRecords/>
      {/* <DBAccounts/> */}
      <DBVog/>
      
       
    </Box>
  );
};

export default Dashboard;