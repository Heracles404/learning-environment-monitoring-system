import React, { useState, useEffect } from "react";
import { httpGetAllReadouts } from "../../hooks/sensors.requests";
import { Box, Typography, Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const AirQualityRecordTable = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);

useEffect(() => {
    const fetchData = async () => {
        const data = await httpGetAllReadouts();
        const formattedData = data.map((readout, index) => {
            let indoorAir = "UNKNOWN";

            if (typeof readout.IAQIndex === "number") {
                if (readout.IAQIndex <= 100) {
                    indoorAir = "GOOD";
                } else if (readout.IAQIndex <= 300) {
                    indoorAir = "WARNING";
                } else if (readout.IAQIndex <= 500) {
                    indoorAir = "BAD";
                } else {
                    indoorAir = "UNKNOWN"; // Or handle >500 if needed
                }
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
                indoorAir,
                temp: readout.temp,
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
    { field: "IAQIndex", headerName: "IAQ Index", minWidth: 120, flex: 1 },
    {
        field: "indoorAir",
        headerName: "IAQ Status",
        minWidth: 150,
        flex: 1,
        renderCell: ({ row: { indoorAir } }) => {
            let bgColor = colors.grey[400];
            let textColor = "black";

            switch (indoorAir) {
                case "GOOD":
                    bgColor = colors.greenAccent[600];
                    textColor = "white";
                    break;
                case "WARNING":
                    bgColor = "#ffcc00"; // yellowish warning
                    textColor = "black";
                    break;
                case "BAD":
                    bgColor = colors.redAccent[700];
                    textColor = "white";
                    break;
                case "UNKNOWN":
                default:
                    bgColor = colors.grey[400];
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
                    <Typography color={textColor}>{indoorAir}</Typography>
                </Box>
            );
        },
    },
];



    return (
        <Box m="5px">
            {/* <Header title="Records" subtitle="Managing the Records" /> */}
            <Box>
                <Paper sx={{ maxHeight: "65vh", width: "100%", overflow: "hidden" }}>
                    <Typography variant="caption" sx={{ ml: 2 }}>
                        Records for Indoor Air Quality (IAQ) Parameters
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

export default AirQualityRecordTable;
