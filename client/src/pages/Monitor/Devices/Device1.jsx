import React, { useEffect, useState } from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer,Snackbar, Alert, TableHead, TableRow, TablePagination, Typography, useTheme, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
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
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

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
                setSnackbar({ open: true, message: 'Device Deleted Successfully!', severity: 'success' });
            } else {
                alert("Failed to delete device. Please try again.");
            }
        }
        handleCloseDeleteDialog();
    };

    const role = localStorage.getItem("role");
    const columns = [
        { id: "classroom", label: "Classroom", minWidth: 150 },
        // { id: "status", label: "Device Status", minWidth: 150 },
        {
            id: "status",
            label: "Device Status",
            minWidth: 150,
            renderCell: (row) => {
              const status = row.status || "Unknown";
              const bgColor =
                status === "ACTIVE"
                  ? colors.greenAccent[600]
                  : status === "INACTIVE"
                  ? colors.redAccent[700]
                  : colors.grey[600];
        
              return (
                <Box
                  m="5px auto"
                  p="5px"
                  display="flex"
                  justifyContent="center"
                  backgroundColor={bgColor}
                  borderRadius="4px"
                >
                  <Typography color="white" fontWeight="bold">
                    {status}
                  </Typography>
                </Box>
              );
            },
          },
        // { id: "bh1750", label: "Light Sensor", minWidth: 150 },
        {
            id: "bh1750",
            label: "Light Sensor",
            minWidth: 150,
            renderCell: (row) => {
              const bh1750 = row.bh1750 || "Unknown";
              const bgColor =
                bh1750 === "ACTIVE"
                  ? colors.greenAccent[600]
                  : bh1750 === "INACTIVE"
                  ? colors.redAccent[700]
                  : colors.grey[600];
        
              return (
                <Box
                  m="5px auto"
                  p="5px"
                  display="flex"
                  justifyContent="center"
                  backgroundColor={bgColor}
                  borderRadius="4px"
                >
                  <Typography color="white" fontWeight="bold">
                    {bh1750}
                  </Typography>
                </Box>
              );
            },
          },
        // { id: "bme680", label: "Air Quality, Heat Index Sensor", minWidth: 150 },
        {
            id: "bme680",
            label: "Air Quality",
            minWidth: 150,
            renderCell: (row) => {
              const bme680 = row.bme680 || "Unknown";
              const bgColor =
                bme680 === "ACTIVE"
                  ? colors.greenAccent[600]
                  : bme680 === "INACTIVE"
                  ? colors.redAccent[700]
                  : colors.grey[600];
        
              return (
                <Box
                  m="5px auto"
                  p="5px"
                  display="flex"
                  justifyContent="center"
                  backgroundColor={bgColor}
                  borderRadius="4px"
                >
                  <Typography color="white" fontWeight="bold">
                    {bme680}
                  </Typography>
                </Box>
              );
            },
          },
        // { id: "pms5003", label: "Volcanic Smog Sensor", minWidth: 150 },
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
                    <DeleteIcon style={{ color: "red", fontSize: "20px" }} />
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
            {/* Snackbar Alerts */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={2000} 
                onClose={() => setSnackbar({ ...snackbar, open: false })} 
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
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
                    <Button sx={{backgroundColor: '#4cceac',height: '30px', borderRadius: '25px', fontWeight: 'bold',}}
                        onClick={handleConfirmDelete} color="primary" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Device1;
