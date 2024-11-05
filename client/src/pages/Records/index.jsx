import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";

const Records = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/httpGetAllReadouts');
        const data = await response.json();
        // Add a unique id property to each row
        const rowsWithId = data.map((item, index) => ({ ...item, id: index + 1 }));
        setRows(rowsWithId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.2 },
    { field: "date", headerName: "Date", flex: 2 },
    { field: "time", headerName: "Time", flex: 2 },
    { field: "temperature", headerName: "Temperature", flex: 2, cellClassName: "role-column--cell" },
    { field: "humidity", headerName: "Humidity", flex: 2, cellClassName: "role-column--cell" },
    { field: "heatIndex", headerName: "Heat Index", flex: 2, cellClassName: "role-column--cell" },
    { field: "lighting", headerName: "Lighting", flex: 2, cellClassName: "role-column--cell" },
    { field: "headCount", headerName: "Head Count", flex: 2, cellClassName: "role-column--cell" },
    { field: "oxygen", headerName: "Oxygen", flex: 2, cellClassName: "role-column--cell" },
    { field: "carbonDioxide", headerName: "Carbon Dioxide", flex: 2, cellClassName: "role-column--cell" },
    { field: "sulfurDioxide", headerName: "Sulfur Dioxide", flex: 2, cellClassName: "role-column--cell" },
    { field: "particulateMatter", headerName: "Particulate Matter", flex: 2, cellClassName: "role-column--cell" },
    { field: "indoorAir", headerName: "Indoor Air", flex: 2, cellClassName: "role-column--cell" },
    { field: "outdoorAir", headerName: "Outdoor Air", flex: 2, cellClassName: "role-column--cell" },
    { field: "temp", headerName: "Temp", flex: 2, cellClassName: "role-column--cell" },
    { field: "remarks", headerName: "Remarks", flex: 2, cellClassName: "role-column--cell" },
  ];

  return (
    <Box m="20px">
      <Header title="Records" subtitle="Managing the Records" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeader": { backgroundColor: colors.greenAccent[700], borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.greenAccent[700] },
          "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": { color: `${colors.grey[100]} !important` },
        }}
      >
        <DataGrid rows={rows} 
        columns={columns} 
        components={{ Toolbar: GridToolbar }} />
      </Box>
    </Box>
  );
};

export default Records;
