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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            const data = await httpGetAllReadouts(); // Fetch data from API
            const formattedData = data.map(readout => ({
                id: readout._id,
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
        { id: "id", label: "ID", minWidth: 150, },
        { id: "date", label: "Date", minWidth: 150, },
        { id: "time", label: "Time", minWidth: 150, },
        { id: "pm25", label: "PM 2.5", minWidth: 150, cellClassName: "role-column--cell" },
        { id: "pm10", label: "PM 10.0", minWidth: 150, cellClassName: "role-column--cell" },
        { id: "OAQIndex", label: "OAQ Index", minWidth: 150, cellClassName: "role-column--cell" },
        { id: "level", label: "Concern Level", minWidth: 150, cellClassName: "role-column--cell" },

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
            <Header title="VOG Records" subtitle="Managing the VOG Records" />
            <Box mt="40px">
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: "65vh" }}>
                        <Table stickyHeader>
                        <caption>Record for Volcanic Smog Parameter</caption>

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

export default DBVOGRecords;
