import React, { useState, useEffect } from "react";
import { httpGetAllReadouts } from "../../hooks/sensors.requests";
import { Box, Typography, Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const HeatIndexRecordTable = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const data = await httpGetAllReadouts();
        const formattedData = data.map((readout, index) => {
          let tempStatus;
    
          if (readout.heatIndex === undefined || readout.heatIndex === null) {
            tempStatus = "INACTIVE";
          } else if (readout.heatIndex <= 27) {
            tempStatus = "GOOD";
          } else if (readout.heatIndex <= 35) {
            tempStatus = "BAD";
          } else if (readout.heatIndex >= 36) {
            tempStatus = "DANGER";
          }
    
          return {
            id: readout._id || index,
            classroom: readout.classroom,
            date: readout.date,
            time: readout.time,
            temperature: readout.temperature,
            humidity: readout.humidity,
            heatIndex: readout.heatIndex,
            temp: tempStatus,
          };
        });
        setRows(formattedData);
      };
    
      fetchData();
    }, []);
    
    const columns = [
      { field: "classroom", headerName: "Room", width: 100 },
      { field: "date", headerName: "Date", width: 100 },
      { field: "time", headerName: "Time", width: 100 },
      { field: "temperature", headerName: "Temperature", width: 120 },
      { field: "humidity", headerName: "Humidity", width: 120 },
      { field: "heatIndex", headerName: "Heat Index", width: 120 },
      {
        field: "temp",
        headerName: "Heat Index Status",
        flex: 1,
        minWidth: 180,
        renderCell: ({ row }) => {
          const { heatIndex } = row;
          let bgColor = colors.grey[400];
          let textColor = "black";
          let label = "INACTIVE";
    
          if (heatIndex === undefined || heatIndex === null) {
            label = "INACTIVE";
            textColor = "white";
          } else if (heatIndex <= 27) {
            label = "GOOD";
            bgColor = colors.greenAccent[600];
            textColor = "white";
          } else if (heatIndex <= 35) {
            label = "BAD";
            bgColor = colors.redAccent[700];
            textColor = "white";
          } else if (heatIndex >= 36) {
            label = "DANGER";
            bgColor = "#990000"
            textColor = "white";
          } 
    
          return (
            <Box
              m="8px auto"
              p="5px"
              display="flex"
              justifyContent="center"
              backgroundColor={bgColor}
              borderRadius="4px"
            >
              <Typography color={textColor}>{label}</Typography>
            </Box>
          );
        },
      },
    ];
    

    return (
        <Box m="5px">
            <Box>
                <Paper sx={{ maxHeight: "65vh", width: "100%", overflow: "hidden" }}>
                    <Typography variant="caption" sx={{ ml: 2 }}>
                        Records for Heat Index Parameters
                    </Typography>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        components={{
                            Toolbar: GridToolbar,
                        }}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 3,
                                },
                            },
                        }}
                        sx={{
                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: colors.greenAccent[500],
                            },
                            "& .MuiDataGrid-row": {
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
                            },
                            "& .MuiDataGrid-root": {
                                border: "none",
                                tableLayout: "auto",
                            },
                            "& .MuiDataGrid-cell": {
                                borderBottom: "none",
                            },
                            "& .MuiDataGrid-columnHeader": {
                                backgroundColor: colors.greenAccent[700],
                                borderBottom: "none",
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

export default HeatIndexRecordTable;