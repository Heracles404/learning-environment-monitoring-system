import React, { useState, useEffect } from "react";
import { httpGetAllReadouts } from "../../hooks/sensors.requests";
import { Box, Typography, Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const LightingRecordTable = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await httpGetAllReadouts();
            const formattedData = data.map((readout, index) => ({
                id: readout._id || index, // Use `classroom` instead of `id`
                classroom: readout.classroom,   // Add classroom to the row data
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
                LightStatus: readout.lighting >= 300 && readout.lighting <= 500 ? "GOOD" : "BAD",
            }));
            setRows(formattedData);
        };

        fetchData();
    }, []);

    const columns = [
        { field: "classroom", headerName: "Room", width: 100, },  // Updated header to Classroom
        { field: "date", headerName: "Date", width: 100, },
        { field: "time", headerName: "Time", width: 100, },
        { field: "lighting", headerName: "Lighting", width: 110, },
        {
                    field: "LightStatus",
                    headerName: "Light Status",
                    flex: 1,
                    minWidth: 150,
                    renderCell: ({ row: { LightStatus } }) => {
                      return (
                        <Box
                        //   width="60%"
                          m="8px auto"
                          p="5px"
                          display="flex"
                          justifyContent="center"
                          backgroundColor={
                            LightStatus === "GOOD"
                              ? colors.greenAccent[600]
                              : LightStatus === "BAD"
                              ? colors.redAccent[700]
                              : colors.redAccent[700]
                          }
                          borderRadius="4px"
                        >
                          {LightStatus === "GOOD" }
                          {LightStatus === "BAD" }
                          <Typography color={"white"} >
                            {LightStatus}
                          </Typography>
                        </Box>
                      );
                    },
                },       
        // { field: "voc", headerName: "VOC", minWidth: 100, flex: 1 },
        // { field: "IAQIndex", headerName: "IAQ Index", minWidth: 100, flex: 1 },
        // { field: "indoorAir", headerName: "IAQ Stat", minWidth: 100, flex: 1 },
        // { field: "temp", headerName: "Temperature Stat", minWidth: 100, flex: 1 },
    ];

    return (
        <Box m="5px" mt="19px">
            {/* <Header title="Records" subtitle="Managing the Records" /> */}
            <Box>
                <Paper sx={{ maxHeight: "65vh", width: "100%", overflow: "hidden" }}>
                    <Typography variant="caption" sx={{ ml: 2 }}>
                        Records for Lighting Parameters
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
                        //   pageSizeOptions={[3, 5, 10, 15]}
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

export default LightingRecordTable;
