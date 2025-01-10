import React, { useState, useEffect } from "react";
import { httpGetAllReadouts } from "../../hooks/sensors.requests";
import { Box,Button, Paper, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";


const Records = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await httpGetAllReadouts();
            const formattedData = data.map((readout, index) => ({
                id: readout._id || index, // Ensure `id` is unique
                classroom: readout.classroom,
                date: readout.date,
                time: readout.time,
                temperature: readout.temperature,
                humidity: readout.humidity,
                heatIndex: readout.heatIndex,
                lighting: readout.lighting,
                voc: readout.voc,
                IAQIndex: readout.IAQIndex,
                indoorAir: readout.indoorAir,
                temp: readout.temp,
            }));
            setRows(formattedData);
        };

        fetchData();
    }, []);

    const columns = [
        { field: "classroom", headerName: "Room", minWidth: 100, flex: 1 },
        { field: "date", headerName: "Date", minWidth: 100, flex: 1 },
        { field: "time", headerName: "Time", minWidth: 100, flex: 1 },
        { field: "temperature", headerName: "Temperature", minWidth: 100, flex: 1 },
        { field: "humidity", headerName: "Humidity", minWidth: 100, flex: 1 },
        { field: "heatIndex", headerName: "Heat Index", minWidth: 100, flex: 1 },
        { field: "lighting", headerName: "Lighting", minWidth: 100, flex: 1 },
        { field: "voc", headerName: "VOC", minWidth: 100, flex: 1 },
        { field: "IAQIndex", headerName: "IAQ Index", minWidth: 100, flex: 1 },
        { field: "indoorAir", headerName: "IAQ Stat", minWidth: 100, flex: 1 },
        { field: "temp", headerName: "Temperature Stat", minWidth: 100, flex: 1 },
    ];

    return (
        <Box m="5px 25px">
            {/* HEADER */}
      <Box 
      display="flex" 
      justifyContent="space-between"
       alignItems="space-between"
       sx={{
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <Header title="Records" subtitle="Managing the Records" />
            
        <Box>
          <Button
            sx={{
              backgroundColor: colors.greenAccent[700],
              // color: colors.grey[100],
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>

       </Box>
       
            
            <Box mt="1px">
                <Paper sx={{ height: "70vh", width: "100%", overflow: "hidden" }}>
                    <Typography variant="caption" sx={{ ml: 2 }}>
                        Records for Environmental Parameters
                    </Typography>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        // disableSelectionOnClick

                        components={{
                            Toolbar: GridToolbar,
                        }}
                        pageSize={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        // checkboxSelection
                        sx={{
                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: colors.greenAccent[500],
                            },
                            
                            "& .MuiDataGrid-row": {
                                // backgroundColor: colors.greenAccent[500],
                                pointerEvents: "none",
  
                            },
                            "& .MuiDataGrid-row.Mui-selected": {
                                backgroundColor: colors.greenAccent[500],

                            },
                            "& .MuiDataGrid-row.Mui-selected:hover": {
                                backgroundColor: colors.greenAccent[500],
                            },
                            
                            "& .MuiDataGrid-toolbarContainer": {
                                backgroundColor: colors.greenAccent[500],
                                // color: colors.grey[100],
                            },
                            "& .MuiDataGrid-root": {
                            border: "none",
                            },
                            "& .MuiDataGrid-cell": {
                                borderBottom: "none",
                            },
                            "& .name-column--cell": {
                                color: colors.greenAccent[300],
                            },
                            "& .MuiDataGrid-columnHeader": {
                                backgroundColor: colors.greenAccent[700],
                                borderBottom: "none",
                            },
                            "& .MuiDataGrid-virtualScroller": {
                                // backgroundColor: colors.primary[400],
                            },
                            "& .MuiDataGrid-footerContainer": {
                                borderTop: "none",
                                backgroundColor: colors.greenAccent[700],
                            },
                            "& .MuiCheckbox-root": {
                                color: `${colors.greenAccent[200]} !important`,
                            },
                        }}
                    />
                </Paper>
            </Box>
        </Box>
    );
};

export default Records;
