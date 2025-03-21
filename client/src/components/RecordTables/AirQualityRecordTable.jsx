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
                indoorAir: readout.IAQIndex < 100 ? "GOOD" : "BAD",
                temp: readout.temp,
            }));
            setRows(formattedData);
        };

        fetchData();
    }, []);

    const columns = [
        { field: "classroom", headerName: "Room", width: 100, },  // Updated header to Classroom
        { field: "date", headerName: "Date", width: 100, },
        { field: "time", headerName: "Time", width: 100, },
        { field: "IAQIndex", headerName: "IAQ Index", minWidth: 120, flex:1 },
        // { field: "indoorAir", headerName: "IAQ Stat", width: 100, },
        {
            field: "indoorAir",
            headerName: "IAQ Status",
            minWidth: 150,
            flex: 1,
            renderCell: ({ row: { indoorAir } }) => {
              return (
                <Box
                //   width="60%"
                  m="8px auto"
                  p="5px"
                  display="flex"
                  justifyContent="center"
                  backgroundColor={
                    indoorAir === "GOOD"
                      ? colors.greenAccent[600]
                      : indoorAir === "BAD"
                      ? colors.redAccent[700]
                      : colors.redAccent[700]
                  }
                  borderRadius="4px"
                >
                  {indoorAir === "GOOD" }
                  {indoorAir === "BAD" }
                  <Typography color={"white"} >
                    {indoorAir}
                  </Typography>
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
