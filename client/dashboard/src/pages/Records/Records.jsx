import { Box, Typography, colors } from "@mui/material";
import React from 'react'
import { DataGrid } from "@mui/x-data-grid";
import { readout } from '../../Data/Data'
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
// import Header from "../../components/Header";

const Records = () => {
  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", 
      headerName: "ID",
      flex: .2,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 2,
    },
    {
      field: "time",
      headerName: "Time",
      flex: 2,
    },
    // Monitors
    {
      field: "temperature",
      headerName: "Temperature",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "humidity",
      headerName: "humidity",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "heatIndex",
      headerName: "heatIndex",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "lighting",
      headerName: "lighting",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "headCount",
      headerName: "headCount",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "oxygen",
      headerName: "oxygen",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "carbonDioxide",
      headerName: "carbonDioxide",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "sulfurDioxide",
      headerName: "sulfurDioxide",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "particulateMatter",
      headerName: "particulateMatter",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    // set conditions in arduino
    {
      field: "indoorAir",
      headerName: "indoorAir",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "outdoorAir",
      headerName: "outdoorAir",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "temp",
      headerName: "temp",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "remarks",
      headerName: "remarks",
      flex: 2,
      cellClassName: "role-column--cell", 
    },

  ];

  return (
    <Box m="20px">
      <div>
        <h1>Records</h1>
        <h3>Managing the Records</h3>
      </div>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          // "& .name-column--cell": {
          //   color: 'red',
          // },
          "& .role-column--cell": {
            color: 'orange',
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: '#ffe1bc',
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: 'white',
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: '#ffe1bc',
          },
          "& .MuiCheckbox-root": {
            color: '#00F5B4',
          },
        }}
      >
        <DataGrid rows={readout} columns={columns} />
      </Box>
    </Box>
  );
};

export default Records;