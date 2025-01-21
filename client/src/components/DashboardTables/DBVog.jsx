import React, { useState, useEffect } from "react";
import { httpGetAllReadouts } from "../../hooks/vog.requests";
import { Box, Typography, Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";

const DBVOGRecords = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await httpGetAllReadouts(); // Fetch data from API

            // Step 1: Calculate averages
            const total = data.reduce((acc, readout) => {
                acc.pm25 += readout.pm25 || 0;
                acc.pm10 += readout.pm10 || 0;
                acc.count += 1; // Count the number of records
                return acc;
            }, { pm25: 0, pm10: 0, count: 0 });

            // Step 2: Calculate average values for PM 2.5 and PM 10.0
            const averageData = {
                id: "average", // Unique ID for the average row
                pm25: ((total.pm25 / total.count) || 0).toFixed(2), // Limit to two decimal places
                pm10: ((total.pm10 / total.count) || 0).toFixed(2), // Limit to two decimal places
            };
            

            // Step 3: Determine the concern level based on the averages
            // Formula for concern level:
            // If either PM 2.5 or PM 10.0 exceeds threshold, it's 'Bad'
            // Otherwise, it's 'Good'
            const thresholdPM25 = 30; // Example threshold for PM 2.5 (adjustable)
            const thresholdPM10 = 50; // Example threshold for PM 10.0 (adjustable)

            const concernLevel = (averageData.pm25 > thresholdPM25 || averageData.pm10 > thresholdPM10) 
                ? "Bad" 
                : "Good";

            // Add concern level to the average data
            averageData.concernLevel = concernLevel;

            // Step 4: Set the rows state with the average data
            setRows([averageData]); // Set the average data as the only row
        };

        fetchData(); // Call the fetch function
    }, []); // Empty dependency array to run only once on mount

    const columns = [
        { field: "pm25", headerName: "Average PM 2.5", minWidth: 100, flex: 1 },
        { field: "pm10", headerName: "Average PM 10.0", minWidth: 100, flex: 1 },
        { field: "concernLevel", headerName: "Concern Level", minWidth: 100, flex: 1 },
    ];

    return (
        <Box m="5px">
            <Header title="VOG Records" subtitle="Managing the VOG Records" />
            <Box>
                <Paper sx={{ maxHeight: "65vh", width: "100%", overflow: "hidden" }}>
                    <Typography variant="caption" sx={{ ml: 2 }}>
                        Records for Volcanic Smog Parameters
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

export default DBVOGRecords;
