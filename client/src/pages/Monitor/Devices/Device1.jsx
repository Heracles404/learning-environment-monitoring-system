import React, { useEffect, useState } from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Typography, useTheme, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { tokens } from "../../../theme";
import { httpGetAllDevices, httpDeleteDevice } from "../../../hooks/devices.requests";
import Header from "../../../components/Header";

const Device1 = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await httpGetAllDevices();
            if (data && data.length > 0) {
                const formattedData = data.map(device => ({
                    id: device._id,
                    status: device.status,
                    classroom: device.classroom,
                    bh1750: device.bh1750,
                    bme680: device.bme680,
                    pms5003: device.pms5003,
                }));
                setRows(formattedData);
            } else {
                console.warn("No devices found in the API response.");
            }
        };

        fetchData();
    }, []);

    const handleOpenDeleteDialog = (id) => {
        setSelectedDeviceId(id);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedDeviceId(null);
    };

    const handleConfirmDelete = async () => {
        if (selectedDeviceId) {
            const response = await httpDeleteDevice(selectedDeviceId);
            if (response.ok) {
                setRows(prevRows => prevRows.filter(device => device.id !== selectedDeviceId));
            } else {
                alert("Failed to delete device. Please try again.");
            }
        }
        handleCloseDeleteDialog();
    };

    const role = localStorage.getItem("role");
    const columns = [
        { id: "classroom", label: "Classroom", minWidth: 150 },
        { id: "status", label: "Status", minWidth: 150 },
        { id: "bh1750", label: "Light Sensor", minWidth: 150 },
        { id: "bme680", label: "Air Quality, Heat Index Sensor", minWidth: 150 },
    ];

    if (role.toUpperCase() === "PRINCIPAL" || role.toUpperCase() === "ADMIN") {
        columns.push({
            id: "delete",
            label: "Delete",
            minWidth: 80,
            align: "center",
            renderCell: (row) => (
                <button
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                    onClick={() => handleOpenDeleteDialog(row.id)}
                >
                    <DeleteOutlineIcon style={{ color: "red", fontSize: "20px" }} />
                </button>
            ),
        });
    }

    return (
        <Box m="5px 25px">
            <Header title="DEVICES" subtitle="Managing the Device" />
            <Box mt="1px">
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
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <TableRow hover key={row.id}>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align || "left"}
                                                sx={{ color: column.id === "role" ? colors.greenAccent[300] : "inherit" }}
                                            >
                                                {column.renderCell ? column.renderCell(row) : row[column.id]}
                                            </TableCell>
                                        ))}
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
                        onPageChange={(event, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(+event.target.value);
                            setPage(0);
                        }}
                        sx={{ backgroundColor: colors.greenAccent[700], color: colors.grey[100] }}
                    />
                </Paper>
            </Box>
            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this device?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Device1;
