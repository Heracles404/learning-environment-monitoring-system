import React, { useState, useEffect } from "react";
import { httpGetAllReadouts } from "../../hooks/sensors.requests";
import { Box, Typography, Paper, Snackbar, Alert, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { Link } from "react-router-dom";

const DBRecords = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const ViewStatus = (
        <Link to="/ViewNotification" style={{ textDecoration: 'none', color:"white" }}>
            <Button color="white" size="small">
                View Status
            </Button>
        </Link>
    );

    const isToday = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    };

    const checkForBadOrDangerToday = (data) => {
        return data.some((readout) => {
            if (!isToday(readout.timestamp)) {
                return false;
            }

            let concernLevel;
            if (readout.heatIndex === undefined || readout.heatIndex === null) {
                concernLevel = "INACTIVE";
            } else if (readout.heatIndex <= 27) {
                concernLevel = "GOOD";
            } else if (readout.heatIndex <= 35) {
                concernLevel = "CRITICAL";
            } else if (readout.heatIndex >= 36) {
                concernLevel = "BAD";
            }

            let IAQStatus;
            if (readout.IAQIndex === undefined || readout.IAQIndex === null) {
                IAQStatus = "INACTIVE";
            } else if (readout.IAQIndex <= 100) {
                IAQStatus = "GOOD";
            } else if (readout.IAQIndex <= 300) {
                IAQStatus = "CRITICAL";
            } else if (readout.IAQIndex <= 500) {
                IAQStatus = "BAD";
            } else {
                IAQStatus = "INACTIVE";
            }

            let LightStatus;
            if (readout.lighting === undefined || readout.lighting === null) {
                LightStatus = "INACTIVE";
            } else if (readout.lighting === -1) {
                LightStatus = "NIGHT";
            } else if (readout.lighting <= 20) {
                LightStatus = "DARK";
            } else if (readout.lighting >= 300) {
                LightStatus = "GOOD";
            } else if (readout.lighting <= 299) {
                LightStatus = "DIM";
            } else if (readout.lighting <= 150) {
                LightStatus = "BAD";
            } else {
                LightStatus = "INACTIVE";
            }

            return (
                concernLevel === "BAD" || concernLevel === "DANGER" ||
                IAQStatus === "BAD" || IAQStatus === "DANGER" ||
                LightStatus === "BAD" || LightStatus === "DANGER"
            );
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await httpGetAllReadouts();
            console.log(data);

            const updatedData = {};
            data.forEach((readout) => {
                let concernLevel;
                if (readout.heatIndex === undefined || readout.heatIndex === null) {
                    concernLevel = "INACTIVE";
                } else if (readout.heatIndex <= 27) {
                    concernLevel = "GOOD";
                } else if (readout.heatIndex <= 35) {
                    concernLevel = "CRITICAL";
                } else if (readout.heatIndex >= 36) {
                    concernLevel = "BAD";
                }

                let IAQStatus;
                if (readout.IAQIndex === undefined || readout.IAQIndex === null) {
                    IAQStatus = "INACTIVE";
                } else if (readout.IAQIndex <= 100) {
                    IAQStatus = "GOOD";
                } else if (readout.IAQIndex <= 300) {
                    IAQStatus = "CRITICAL";
                } else if (readout.IAQIndex <= 500) {
                    IAQStatus = "BAD";
                } else {
                    IAQStatus = "INACTIVE";
                }

                let LightStatus;
                if (readout.lighting === undefined || readout.lighting === null) {
                    LightStatus = "INACTIVE";
                } else if (readout.lighting === -1) {
                    LightStatus = "NIGHT";
                } else if (readout.lighting <= 20) {
                    LightStatus = "DARK";
                } else if (readout.lighting >= 300) {
                    LightStatus = "GOOD";
                } else if (readout.lighting <= 299) {
                    LightStatus = "DIM";
                } else if (readout.lighting <= 150) {
                    LightStatus = "BAD";
                } else {
                    LightStatus = "INACTIVE";
                }

                updatedData[readout.classroom] = {
                    id: readout.classroom,
                    classroom: readout.classroom,
                    currentHeatIndex: readout.heatIndex,
                    currentIAQIndex: readout.IAQIndex,
                    currentLighting: readout.lighting,
                    concernLevel,
                    IAQStatus,
                    LightStatus,
                };
            });

            setRows(Object.values(updatedData));

            // Call alert detection function
            const badFound = checkForBadOrDangerToday(data);
            setSnackbarOpen(badFound);
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const columns = [
        { field: "classroom", headerName: "Room", width: 123 },
        {
            field: "IAQStatus",
            headerName: "IAQ Stat",
            minWidth: 130,
            flex: 1,
            renderCell: ({ row: { IAQStatus } }) => {
                let bgColor = "#999999";
                if (IAQStatus === "GOOD") bgColor = colors.greenAccent[600];
                else if (IAQStatus === "BAD" || IAQStatus === "DANGER") bgColor = "#990000";
                else if (IAQStatus === "CRITICAL") bgColor = colors.redAccent[700];

                return (
                    <Box width="120%" m="8px auto" p="5px" display="flex" justifyContent="center" backgroundColor={bgColor} borderRadius="4px">
                        <Typography color="white">{IAQStatus}</Typography>
                    </Box>
                );
            },
        },
        {
            field: "concernLevel",
            headerName: "Heat Index Status",
            minWidth: 157,
            flex: 1,
            renderCell: ({ row: { concernLevel } }) => {
                let bgColor = "#999999";
                if (concernLevel === "GOOD") bgColor = colors.greenAccent[600];
                else if (concernLevel === "CRITICAL") bgColor = colors.redAccent[700];
                else if (concernLevel === "BAD" || concernLevel === "DANGER") bgColor = "#990000";

                return (
                    <Box m="8px auto" p="5px" display="flex" justifyContent="center" backgroundColor={bgColor} borderRadius="4px">
                        <Typography color="white">{concernLevel}</Typography>
                    </Box>
                );
            },
        },
        {
            field: "LightStatus",
            headerName: "Light Status",
            minWidth: 130,
            flex: 1,
            renderCell: ({ row: { LightStatus } }) => {
                let bgColor = "#999999";
                if (LightStatus === "GOOD") bgColor = colors.greenAccent[600];
                else if (LightStatus === "DIM") bgColor = "#ff9933";
                else if (LightStatus === "BAD" || LightStatus === "DANGER") bgColor = colors.redAccent[700];
                else if (LightStatus === "DARK") bgColor = "#666666";
                else if (LightStatus === "NIGHT") bgColor = "#333333";

                return (
                    <Box m="8px auto" p="5px" display="flex" justifyContent="center" backgroundColor={bgColor} borderRadius="4px">
                        <Typography color="white">{LightStatus}</Typography>
                    </Box>
                );
            },
        },
        { field: "currentHeatIndex", headerName: "Heat Index", width: 130 },
        { field: "currentIAQIndex", headerName: "IAQ Index", width: 130 },
        { field: "currentLighting", headerName: "Light Level", width: 130 },
    ];

    return (
        <Box m="5px">
            <Header title="Latest Records" subtitle="Monitoring the Latest Captured Value" />
            <Box>
                <Paper sx={{ maxHeight: "65vh", width: "100%", overflow: "hidden" }}>
                    <Typography variant="caption" sx={{ ml: 2 }}>
                        Indoor Air Quality (IAQ), Heat Index, Light
                    </Typography>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        components={{ Toolbar: GridToolbar }}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 3 } },
                        }}
                        pageSizeOptions={[3, 5, 10, 15]}
                        sx={{
                            "& .MuiDataGrid-row:hover": { backgroundColor: colors.greenAccent[500] },
                            "& .MuiDataGrid-row": { pointerEvents: "none" },
                            "& .MuiDataGrid-row.Mui-selected": { backgroundColor: colors.greenAccent[500] },
                            "& .MuiDataGrid-toolbarContainer": { backgroundColor: colors.greenAccent[500] },
                            "& .MuiDataGrid-root": { border: "none", tableLayout: "auto" },
                            "& .MuiDataGrid-cell": { borderBottom: "none" },
                            "& .MuiDataGrid-columnHeader": { backgroundColor: colors.greenAccent[700], borderBottom: "none" },
                            "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.greenAccent[700] },
                            "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
                        }}
                    />
                </Paper>
            </Box>

            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={6000} 
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                    action={ViewStatus}
                >
                    Parameters are in BAD/DANGER level.
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default DBRecords;
