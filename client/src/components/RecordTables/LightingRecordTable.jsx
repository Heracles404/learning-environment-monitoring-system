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
    const formattedData = data.map((readout, index) => {
      let LightStatus;

      if (readout.lighting === -1) {
        LightStatus = "NIGHT";
      } else if (readout.lighting <= 30) {
        LightStatus = "CLOSED";
      } else if (readout.lighting > 30 && readout.lighting <= 150) {
        LightStatus = "GOOD";
      } else if (readout.lighting > 150 && readout.lighting <= 500) {
        LightStatus = "WARNING";
      } else if (readout.lighting > 500) {
        LightStatus = "BAD";
      } else {
        LightStatus = "UNKNOWN";
      }

      return {
        id: readout._id || index,
        classroom: readout.classroom,
        date: readout.date,
        time: readout.time,
        lighting: readout.lighting,
        LightStatus,
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
  { field: "lighting", headerName: "Lighting (lx)", width: 110 },
  {
    field: "LightStatus",
    headerName: "Light Status",
    flex: 1,
    minWidth: 150,
    renderCell: ({ row: { LightStatus } }) => {
      let bgColor;
      let textColor = "white";

      switch (LightStatus) {
        case "GOOD":
          bgColor = colors.greenAccent[600];
          break;
        case "WARNING":
          bgColor = "#ff9933"; // yellow/orange for warning
          textColor = "black";
          break;
        case "BAD":
          bgColor = colors.redAccent[700];
          break;
        case "CLOSED":
          bgColor = "#666666"; // dark grey for closed
          break;
        case "NIGHT":
          bgColor = "#222222"; // very dark for night
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
          <Typography color={textColor}>{LightStatus}</Typography>
        </Box>
      );
    },
  },
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
