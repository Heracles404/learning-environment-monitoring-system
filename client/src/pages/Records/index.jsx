import React, { useState, useEffect } from "react";
import {httpGetAllReadouts} from "../../hooks/sensors.requests";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const Records = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            const data = await httpGetAllReadouts(); // Fetch data from API
            const formattedData = data.map(readout => ({
                id: readout._id,
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
            }));
            setRows(formattedData); // Set the formatted data to state
        };

        fetchData(); // Call the fetch function
    }, []); // Empty dependency array to run only once on mount

    const columns = [
        { id: "id", label: "ID", minWidth: 100, },
        { id: "date", label: "Date", minWidth: 100, },
        { id: "time", label: "Time", minWidth: 100, },
        { id: "temperature", label: "Temperature", minWidth: 100, cellClassName: "role-column--cell" },
        { id: "humidity", label: "Humidity", minWidth: 100, cellClassName: "role-column--cell" },
        { id: "heatIndex", label: "Heat Index", minWidth: 100, cellClassName: "role-column--cell" },
        { id: "lighting", label: "Lighting", minWidth: 100, cellClassName: "role-column--cell" },
        { id: "voc", label: "Voc", minWidth: 100, cellClassName: "role-column--cell" },
        { id: "IAQIndex", label: "IAQ Index", minWidth: 100, cellClassName: "role-column--cell" },
        { id: "indoorAir", label: "IAQ Stat", minWidth: 100, cellClassName: "role-column--cell" },
        { id: "temp", label: "Temperature Stat", minWidth: 100, cellClassName: "role-column--cell" },

    ];
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Box m="20px">
            <Header title="Records" subtitle="Managing the Records" />
            <Box mt="40px">
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer sx={{ height: "65vh" }}>
                        <Table stickyHeader>
                        <caption>Record for Environmental Parameters</caption>

                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align || "left"}
                                            style={{
                                                minWidth: column.minWidth,
                                                fontWeight: "bold",
                                                backgroundColor: colors.greenAccent[700],
                                                color: colors.grey[100],
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <TableRow hover key={row.id}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align || "left"}
                                                        sx={{
                                                            color:
                                                                column.cellClassName === "name-column--cell"
                                                                    ? colors.greenAccent[300]
                                                                    : column.cellClassName === "role-column--cell"
                                                                    ? colors.greenAccent[500]
                                                                    : "inherit",
                                                        }}
                                                    >
                                                        {column.renderCell
                                                            ? column.renderCell(row)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            backgroundColor: colors.greenAccent[700],
                            color: colors.grey[100],
                        }}
                    />
                    
                </Paper>
                
            </Box>
        </Box>
    );
};

export default Records;
