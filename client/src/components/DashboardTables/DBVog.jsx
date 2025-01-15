import React, { useState, useEffect } from "react";
import {httpGetAllReadouts} from "../../hooks/vog.requests";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const DBVOGRecords = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await httpGetAllReadouts(); // Fetch data from API
            const formattedData = data.map((readout, index) => ({
                id: readout._id || index, // Ensure `id` is unique
                date: readout.date,
                time: readout.time,
                pm25: readout.pm25,
                pm10: readout.pm10,
                OAQIndex: readout.OAQIndex,
                level: readout.level,
            }));
            setRows(formattedData); // Set the formatted data to state
        };

        fetchData(); // Call the fetch function
    }, []); // Empty dependency array to run only once on mount

    const columns = [
        { field: "id", headerName: "ID", minWidth: 100, flex: 1  },
        { field: "date", headerName: "Date", minWidth: 100, flex: 1 },
        { field: "time", headerName: "Time", minWidth: 100, flex: 1 },
        { field: "pm25", headerName: "PM 2.5", minWidth: 100, flex: 1 },
        { field: "pm10", headerName: "PM 10.0", minWidth: 100, flex: 1 },
        { field: "OAQIndex", headerName: "OAQ Index", minWidth: 100, flex: 1 },
        { field: "level", headerName: "Concern Level", minWidth: 100, flex: 1 },

    ];
    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };

    // const handleChangeRowsPerPage = (event) => {
    //     setRowsPerPage(+event.target.value);
    //     setPage(0);
    // };
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
                        // disableSelectionOnClick

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
                        // checkboxSelection
                        sx={{
                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: colors.greenAccent[500],
                            },
                            
                            "& .MuiDataGrid-row": {
                                // backgroundColor: colors.greenAccent[500],
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
                                // color: colors.grey[100],
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

export default DBVOGRecords;
