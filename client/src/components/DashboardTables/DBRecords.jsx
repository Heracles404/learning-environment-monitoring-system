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

            const updatedData = {};
            data.forEach((readout) => {
                updatedData[readout.classroom] = {
                    id: readout.classroom,
                    classroom: readout.classroom,
                    currentHeatIndex: readout.heatIndex,
                    currentIAQIndex: readout.IAQIndex,
                    currentLighting: readout.lighting,
                    concernLevel: (readout.heatIndex > 29 || readout.IAQIndex > 60 || readout.lighting > 200) ? "BAD" : "GOOD",
                    IAQStatus: readout.IAQIndex > 100 ? "BAD" : "GOOD", // Adjust the threshold as needed
                    LightStatus: readout.lighting > 300 ? "BAD" : "GOOD", // Adjust the threshold as needed
                };
            });

            setRows(Object.values(updatedData));
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // Update every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const columns = [
        { field: "classroom", headerName: "Classroom", minWidth: 100, flex: 1 },
        { field: "currentHeatIndex", headerName: "Latest Heat Index", minWidth: 100, flex: 1 },
        { field: "currentIAQIndex", headerName: "Latest IAQ Index", minWidth: 100, flex: 1 },
        { field: "currentLighting", headerName: "Latest Light Level", minWidth: 100, flex: 1 },
        // { field: "concernLevel", headerName: "Heat Index Status", minWidth: 100, flex: 1 },
        {
            field: "concernLevel",
            headerName: "Heat Index Status",
            flex: 1,
            renderCell: ({ row: { concernLevel } }) => {
              return (
                <Box
                //   width="100%"
                  m="8px auto"
                  p="5px"
                  display="flex"
                  justifyContent="center"
                  backgroundColor={
                    concernLevel === "GOOD"
                      ? colors.greenAccent[600]
                      : concernLevel === "BAD"
                      ? colors.redAccent[700]
                      : colors.redAccent[700]
                  }
                  borderRadius="4px"
                >
                  {concernLevel === "GOOD" }
                  {concernLevel === "BAD" }
                  <Typography color={"white"} >
                    {concernLevel}
                  </Typography>
                </Box>
              );
            },
        },
        // { field: "IAQStatus", headerName: "IAQ Status", minWidth: 100, flex: 1 },
        {
            field: "IAQStatus",
            headerName: "IAQ Stat",
            flex: 1,
            renderCell: ({ row: { IAQStatus } }) => {
              return (
                <Box
                  width="120%"
                  m="8px auto"
                  p="5px"
                  display="flex"
                  justifyContent="center"
                  backgroundColor={
                    IAQStatus === "GOOD"
                      ? colors.greenAccent[600]
                      : IAQStatus === "BAD"
                      ? colors.redAccent[700]
                      : colors.redAccent[700]
                  }
                  borderRadius="4px"
                >
                  {IAQStatus === "GOOD" }
                  {IAQStatus === "BAD" }
                  <Typography color={"white"} >
                    {IAQStatus}
                  </Typography>
                </Box>
              );
            },
        },
        // { field: "LightStatus", headerName: "Light Status", minWidth: 100, flex: 1 },
        {
                    field: "LightStatus",
                    headerName: "Light Status",
                    flex: 1,
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
    ];

    return (
        <Box m="5px">
            <Header title="Latest Records" subtitle="Monitoring the Latest Records" />
            <Box>
                <Paper sx={{ maxHeight: "65vh", width: "100%", overflow: "hidden" }}>
                    <Typography variant="caption" sx={{ ml: 2 }}>
                        Latest Records for Environmental Parameters
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

export default DBRecords;
