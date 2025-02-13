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
    const [rows, setRows] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const data = await httpGetAllReadouts();
            // console.log(data);

            const updatedData = { ...rows };
            data.forEach((readout) => {
                updatedData["Outdoor"] = {
                    id: "Outdoor",
                    classroom: "Outdoor",
                    currentPM25: readout.pm25,
                    currentPM10: readout.pm10,
                    concernLevel: (readout.pm25 > 30 || readout.pm10 > 50) ? "Bad" : "Good",
                };
            });

            setRows(updatedData);
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // Update every 5 seconds
        return () => clearInterval(interval);
    }, [rows]);

    const columns = [
        { field: "classroom", headerName: "Outdoor", minWidth: 100, flex: 1 },
        { field: "currentPM25", headerName: "Latest PM 2.5", minWidth: 100, flex: 1 },
        { field: "currentPM10", headerName: "Latest PM 10.0", minWidth: 100, flex: 1 },
        // { field: "concernLevel", headerName: "VOG Status", minWidth: 100, flex: 1 },
        {
                    field: "concernLevel",
                    headerName: "VOG Status",
                    flex: 1,
                    renderCell: ({ row: { concernLevel } }) => {
                      return (
                        <Box
                        //   width="60%"
                          m="8px auto"
                          p="5px"
                          display="flex"
                          justifyContent="center"
                          backgroundColor={
                            concernLevel === "Good"
                              ? colors.greenAccent[600]
                              : concernLevel === "Bad"
                              ? colors.redAccent[700]
                              : colors.redAccent[700]
                          }
                          borderRadius="4px"
                        >
                          {concernLevel === "Good" }
                          {concernLevel === "Bad" }
                          <Typography color={"white"} >
                            {concernLevel}
                          </Typography>
                        </Box>
                      );
                    },
                },
    ];

    return (
        <Box m="5px">
            <Header title="Latest VOG Records" subtitle="Monitoring the Latest VOG Records" />
            <Box>
                <Paper sx={{ maxHeight: "65vh", width: "100%", overflow: "hidden" }}>
                    <Typography variant="caption" sx={{ ml: 2 }}>
                        Latest Records for Volcanic Smog Parameters
                    </Typography>
                    <DataGrid
                        rows={Object.values(rows)}
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
