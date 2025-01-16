import React, { useEffect, useState } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Typography, useTheme } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { tokens } from "../../../theme";
import { httpGetAllDevices, httpDeleteDevice } from "../../../hooks/devices.requests";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";

const Device1 = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [columns, setColumns] = useState([
        { id: "id", label: "ID", minWidth: 60 },
        { id: "classroom", label: "Classroom", minWidth: 150 },
        { id: "status", label: "Status", minWidth: 150 },
        { id: "bh1750", label: "BH1750", minWidth: 150 },
        { id: "bme680", label: "BME680", minWidth: 150 },
        { id: "pms680", label: "PMS5003", minWidth: 150 },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await httpGetAllDevices(); // Fetch data from API
            console.log("API Response:", data); // Log the API response
            if (data && data.length > 0) {
                const formattedData = data.map(device => ({
                    id: device._id,
                    status: device.status,
                    classroom: device.classroom,
                    bh1750: device.bh1750,
                    bme680: device.bme680,
                    pms5003: device.pms5003,
                }));
                console.log("Formatted Data:", formattedData); // Log the formatted data
                setRows(formattedData);
            } else {
                console.warn("No devices found in the API response.");
            }
        };

        fetchData(); // Fetch data when component mounts
    }, []);

    useEffect(() => {
        const role = localStorage.getItem("role");
        const newColumns = [
            { id: "id", label: "ID", minWidth: 60 },
            { id: "status", label: "Status", minWidth: 150 },
            { id: "classroom", label: "Classroom", minWidth: 150 },
            { id: "bh1750", label: "BH1750", minWidth: 150 },
            { id: "bme680", label: "BME680", minWidth: 150 },
            { id: "pms5003", label: "PMS5003", minWidth: 150 },
        ];

        if (role.toUpperCase() === "PRINCIPAL" || role.toUpperCase() === "ADMIN") {
            newColumns.push(
                {
                    id: "delete",
                    label: "Delete",
                    minWidth: 80,
                    align: "center",
                    renderCell: (row) => (
                        <button
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                            onClick={async () => {
                                const confirmed = window.confirm(`Are you sure you want to delete the device with ID ${row.id}?`);
                                if (confirmed) {
                                    const response = await httpDeleteDevice(row.id);
                                    if (response.ok) {
                                        // Update the rows state to remove the deleted device
                                        setRows((prevRows) => prevRows.filter((device) => device.id !== row.id));
                                    } else {
                                        alert("Failed to delete device. Please try again.");
                                    }
                                }
                            }}
                        >
                            <DeleteOutlineIcon style={{ color: "red", fontSize: "20px" }} />
                        </button>
                    ),
                }
            );
        }

        setColumns(newColumns);
    }, []); // Run this effect only once when the component mounts

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Box m="5px 25px">
            <Header title="DEVICES" subtitle="Managing the Device" />
            <Box mt="1px"> {/* Corrected this line */}
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <Typography variant="caption" sx={{ ml: 2 }}>
                        Device Information
                    </Typography>
                    <TableContainer sx={{ height: "65vh" }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            style={{
                                                minWidth: column.minWidth,
                                                backgroundColor: colors.greenAccent[700],
                                                color: colors.grey[100],
                                            }}
                                            align={column.align || "left"}
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
                                                                column.id === "role"
                                                                    ? colors.greenAccent[300]
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

export default Device1;