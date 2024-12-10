import React, { useState, useEffect } from "react";
import {httpGetAllReadouts} from "../../hooks/sensors.requests";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const DBRecords = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await httpGetAllReadouts(); // Fetch data from API
            const formattedData = data.map(readout => ({
              id: readout._id,
              date: readout.date,
              time: readout.time,
              temperature: readout.temperature,
              humidity: readout.humidity,
              heatIndex: readout.heatIndex,
              lighting: readout.lighting,
              voc: readout.voc,
              IAQIndex: readout.IAQIndex,
              pm25: readout.pm25,
              pm10: readout.pm10,
              OAQIndex: readout.OAQIndex,
              indoorAir: readout.indoorAir,
              outdoorAir: readout.outdoorAir,
              temp: readout.temp,
              remarks: readout.remarks,
            }));
            setRows(formattedData); // Set the formatted data to state
        };

        fetchData(); // Call the fetch function
    }, []); // Empty dependency array to run only once on mount

  const columns = [
    { field: "id", headerName: "ID", flex: 0.2 },
    { field: "date", headerName: "Date", flex: 2 },
    { field: "time", headerName: "Time", flex: 2 },
    { field: "temperature", headerName: "Temperature", flex: 2, cellClassName: "role-column--cell" },
    { field: "humidity", headerName: "Humidity", flex: 2, cellClassName: "role-column--cell" },
    { field: "heatIndex", headerName: "Heat Index", flex: 2, cellClassName: "role-column--cell" },
    { field: "lighting", headerName: "Lighting", flex: 2, cellClassName: "role-column--cell" },
    { field: "voc", headerName: "Voc", flex: 2, cellClassName: "role-column--cell" },
    { field: "IAQIndex", headerName: "IAQ Index", flex: 2, cellClassName: "role-column--cell" },
    { field: "indoorAir", headerName: "IAQ Stat", flex: 2, cellClassName: "role-column--cell" },
    { field: "temp", headerName: "Temperature Stat", flex: 2, cellClassName: "role-column--cell" },

  ];

  return (
    <Box m="3px">
      <Header title="Paramaters"/>
      <Box
        m="5px 0 0 0"
        height="25vh"
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
        <DataGrid 
        // checkboxSelection
        rows={rows} 
        columns={columns} 
        components={{ Toolbar: GridToolbar }} />
      </Box>
    </Box>
  );
};

export default DBRecords;
