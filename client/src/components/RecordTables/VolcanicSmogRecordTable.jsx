import React, { useState, useEffect } from "react";
import { httpGetAllReadouts } from "../../hooks/vog.requests";
import { Box, Typography, Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const VolcanicSmogRecordTable = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);

useEffect(() => {
    const fetchData = async () => {
        const data = await httpGetAllReadouts();
        const formattedData = data.map((readout, index) => {
            const level = Number(readout.level);
            let vogStatus = "INACTIVE";

            if (level === 1) {
                vogStatus = "GOOD";
            } else if (level === 2 || level === 3) {
                vogStatus = "BAD";
            } else if (level === 4) {
                vogStatus = "DANGER";
            }

            return {
                id: readout._id || index,
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
                pm25: readout.pm25,
                pm10: readout.pm10,
                OAQ: Number(readout.OAQIndex),
                level: level,
                vogStatus,
            };
        });
        setRows(formattedData);
    };

    fetchData();
}, []);


const columns = [
    { field: "classroom", headerName: "Device", width: 100 },
    { field: "date", headerName: "Date", width: 100 },
    { field: "time", headerName: "Time", width: 100 },
    { field: "pm25", headerName: "PM2.5", width: 120 },
    { field: "pm10", headerName: "PM10", width: 120 },
    { field: "OAQ", headerName: "OAQ Index", width: 120 },
    { field: "level", headerName: "Level of Concern", width: 120 },
    {
        field: "vogStatus",
        headerName: "VOG Status",
        minWidth: 150,
        flex: 1,
        renderCell: ({ row: { vogStatus } }) => {
            let bgColor = colors.grey[500];
            let textColor = "white";

            switch (vogStatus) {
                case "GOOD":
                    bgColor = colors.greenAccent[600];
                    break;
                case "BAD":
                    bgColor = colors.redAccent[700];
                    break;
                case "DANGER":
                    bgColor = colors.redAccent[900] ?? "#8B0000"; // fallback
                    break;
                case "INACTIVE":
                default:
                    bgColor = colors.grey[500];
                    textColor = "black";
                    break;
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
                    <Typography color={textColor}>{vogStatus}</Typography>
                </Box>
            );
        },
    },
];




    return (
        <Box m="5px" mt="12.5px">
            {/* <Header title="Records" subtitle="Managing the Records" /> */}
            <Box>
                <Paper sx={{ maxHeight: "65vh", width: "100%", overflow: "hidden" }}>
                    <Typography variant="caption" sx={{ ml: 2 }}>
                        Records for Volcanic Smog (VOG) Parameters
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

export default VolcanicSmogRecordTable;
