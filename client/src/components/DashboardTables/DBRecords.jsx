import React, { useState, useEffect } from "react";
import { httpGetAllReadouts } from "../../hooks/sensors.requests";
import { Box, Typography, Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";

const DBRecords = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await httpGetAllReadouts();
            console.log(data);

            // Step 1: Group by classroom
            const classroomData = data.reduce((acc, readout) => {
                const classroom = readout.classroom;
                if (!acc[classroom]) {
                    acc[classroom] = {
                        classroom: classroom,
                        heatIndex: [],
                        IAQIndex: [],
                        lighting: [],
                    };
                }
                acc[classroom].heatIndex.push(readout.heatIndex);
                acc[classroom].IAQIndex.push(readout.IAQIndex);
                acc[classroom].lighting.push(readout.lighting);
                return acc;
            }, {});

            // Step 2: Calculate averages
            const formattedData = Object.values(classroomData).map((classroom) => ({
                id: classroom.classroom, // Use classroom name as ID
                classroom: classroom.classroom,
                aveHeatIndex: (classroom.heatIndex.reduce((a, b) => a + b, 0) / classroom.heatIndex.length) || 0,
                aveIAQIndex: (classroom.IAQIndex.reduce((a, b) => a + b, 0) / classroom.IAQIndex.length) || 0,
                aveLighting: (classroom.lighting.reduce((a, b) => a + b, 0) / classroom.lighting.length) || 0,
            }));

            // Step 3: Set the rows state
            setRows(formattedData);
        };

        fetchData();
    }, []);

    const columns = [
        { field: "classroom", headerName: "Classroom", minWidth: 100, flex: 1 },  // Updated header to Classroom
        { field: "aveHeatIndex", headerName: "Average Heat Index", minWidth: 100, flex: 1 },
        // { field: "temp", headerName: "Temperature Stat", minWidth: 100, flex: 1 },
        { field: "aveIAQIndex", headerName: "Average IAQ Index", minWidth: 100, flex: 1 },
        // { field: "indoorAir", headerName: "IAQ Stat", minWidth: 100, flex: 1 },
        { field: "aveLighting", headerName: "Average Light Level", minWidth: 100, flex: 1 },
        // { field: "lightRemarks", headerName: "Light Stat", minWidth: 100, flex: 1 },
        { field: "concernLevel", headerName: "Concern Level", minWidth: 100, flex: 1 },
    ];

    return (
        <Box m="5px">
            <Header title="Records" subtitle="Managing the Records" />
            <Box>
                <Paper sx={{ maxHeight: "65vh", width: "100%", overflow: "hidden" }}>
                    <Typography variant="caption" sx={{ ml: 2 }}>
                        Records for Environmental Parameters
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
                          pageSizeOptions={[3, 5, 10, 15]}
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

export default DBRecords;
