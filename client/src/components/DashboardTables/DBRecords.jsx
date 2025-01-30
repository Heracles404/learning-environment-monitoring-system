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
            const formattedData = Object.values(classroomData).map((classroom) => {
                const aveHeatIndex = (classroom.heatIndex.reduce((a, b) => a + b, 0) / classroom.heatIndex.length).toFixed(2) || 0;
                const aveIAQIndex = (classroom.IAQIndex.reduce((a, b) => a + b, 0) / classroom.IAQIndex.length).toFixed(2) || 0;
                const aveLighting = (classroom.lighting.reduce((a, b) => a + b, 0) / classroom.lighting.length).toFixed(2) || 0;

                // Step 3: Determine the concern level based on averages
                // Define threshold values for each parameter (adjustable)
                const heatIndexThreshold = 29; // Example threshold for heat index
                const IAQIndexThreshold = 60; // Example threshold for IAQ index
                const lightingThreshold = 200; // Example threshold for lighting

                // Logic to determine concern level
                const concernLevel = (aveHeatIndex > heatIndexThreshold || aveIAQIndex > IAQIndexThreshold || aveLighting > lightingThreshold)
                    ? "Bad"
                    : "Good";

                return {
                    id: classroom.classroom, // Use classroom name as ID
                    classroom: classroom.classroom,
                    aveHeatIndex,
                    aveIAQIndex,
                    aveLighting,
                    concernLevel,
                };
            });

            // Step 4: Set the rows state with the formatted data
            setRows(formattedData);
        };

        fetchData();
    }, []);

    const columns = [
        { field: "classroom", headerName: "Classroom", minWidth: 100, flex: 1 },
        { field: "aveHeatIndex", headerName: "Current Heat Index", minWidth: 100, flex: 1 },
        { field: "aveIAQIndex", headerName: "Current IAQ Index", minWidth: 100, flex: 1 },
        { field: "aveLighting", headerName: "Current Light Level", minWidth: 100, flex: 1 },
        { field: "concernLevel", headerName: "Current Status", minWidth: 100, flex: 1 },
    ];

    return (
        <Box m="5px">
            <Header title="Records" subtitle="Monitoring the Current Records" />
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
