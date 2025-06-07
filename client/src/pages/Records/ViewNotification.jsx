import React, { useState, useEffect } from "react";
import { httpGetAllReadouts, httpDeleteReadout } from "../../hooks/sensors.requests";
import { Box, Button, Paper, Typography, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import dayjs from "dayjs";
import { Link } from 'react-router-dom';

const ViewNotification = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        setSnackbarOpen(true);
    }, []);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    const ViewSuggestion = (
        <Link to="/Suggestion" style={{ textDecoration: 'none', color:"white" }}>
            <Button color="white" size="small">View Suggestions</Button>
        </Link>
    );

    const fetchData = async () => {
        const data = await httpGetAllReadouts();
        const formattedData = data.map((readout, index) => {
            let iaqStatus = "INACTIVE";
            if (readout.IAQIndex <= 150) iaqStatus = "GOOD";
            else if (readout.IAQIndex <= 300) iaqStatus = "BAD";
            else if (readout.IAQIndex <= 500) iaqStatus = "DANGER";

            let lightingStatus = "INACTIVE";
            if (readout.lighting !== undefined && readout.lighting !== null) {
                if (readout.lighting === -1) lightingStatus = "NIGHT";
                else if (readout.lighting <= 20) lightingStatus = "DARK";
                else if (readout.lighting >= 300) lightingStatus = "GOOD";
                else if (readout.lighting <= 299) lightingStatus = "DIM";
                else if (readout.lighting <= 150) lightingStatus = "BAD";
            }

            let tempStatus = "INACTIVE";
            if (readout.heatIndex <= 27) tempStatus = "GOOD";
            else if (readout.heatIndex <= 35) tempStatus = "BAD";
            else if (readout.heatIndex >= 36) tempStatus = "DANGER";

            return {
                id: readout._id || index,
                classroom: readout.classroom,
                date: readout.date,
                time: readout.time,
                temperature: readout.temperature,
                humidity: readout.humidity,
                heatIndex: readout.heatIndex,
                lighting: readout.lighting,
                voc: readout.voc,
                IAQIndex: readout.IAQIndex,
                indoorAir: iaqStatus,
                temp: tempStatus,
                lightRemarks: lightingStatus,
            };
        });

        setRows(formattedData);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            void fetchData();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const columns = [
        { field: "classroom", headerName: "Room", width: 98 },
        { field: "date", headerName: "Date", width: 91 },
        { field: "time", headerName: "Time", width: 94 },

        {
            field: "indoorAir",
            headerName: "IAQ Status",
            minWidth: 120,
            flex: 1,
            renderCell: ({ row: { indoorAir } }) => {
                if (indoorAir !== "BAD" && indoorAir !== "DANGER") return null;

                const bgColor = indoorAir === "BAD" ? colors.redAccent[700] : "#990000";

                return (
                    <Box
                        m="8px auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        backgroundColor={bgColor}
                        borderRadius="4px"
                    >
                        <Typography color="white">{indoorAir}</Typography>
                    </Box>
                );
            },
        },
        {
            field: "temp",
            headerName: "Heat Index Status",
            minWidth: 170,
            flex: 1,
            renderCell: ({ row: { temp } }) => {
                if (temp !== "BAD" && temp !== "DANGER") return null;

                const bgColor = temp === "BAD" ? colors.redAccent[700] : "#990000";

                return (
                    <Box
                        m="8px auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        backgroundColor={bgColor}
                        borderRadius="4px"
                    >
                        <Typography color="white">{temp}</Typography>
                    </Box>
                );
            },
        },
        {
            field: "lightRemarks",
            headerName: "Lighting Status",
            minWidth: 145,
            flex: 1,
            renderCell: ({ row: { lightRemarks } }) => {
                if (lightRemarks !== "BAD" && lightRemarks !== "DANGER") return null;

                const bgColor = lightRemarks === "BAD" ? colors.redAccent[700] : "#990000";

                return (
                    <Box
                        m="8px auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        backgroundColor={bgColor}
                        borderRadius="4px"
                    >
                        <Typography color="white">{lightRemarks}</Typography>
                    </Box>
                );
            },
        },
    ];

    // FILTER rows to only show BAD or DANGER statuses in any of the three columns
    const filteredRows = rows.filter(row =>
        row.indoorAir === "BAD" || row.indoorAir === "DANGER" ||
        row.temp === "BAD" || row.temp === "DANGER" ||
        row.lightRemarks === "BAD" || row.lightRemarks === "DANGER"
    );

    const handleDeleteSelected = async () => {
        if (selectedRows.length === 0) return;
        setLoading(true);
        try {
            for (const id of selectedRows) {
                const result = await httpDeleteReadout(id);
                if (result.ok) {
                    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
                } else {
                    console.error(`Failed to delete record with id: ${id}`);
                }
            }
            setSelectedRows([]);
            setSnackbar({ open: true, message: 'Row Deleted Successfully!', severity: 'success' });
        } catch (error) {
            console.error("Error during deletion:", error);
        }
        setLoading(false);
        setOpenDialog(false);
    };

    const handleDownload = () => {
        const filteredRowsForDownload = rows.filter((row) => {
            const rowDate = dayjs(row.date, "MM/DD/YYYY");
            const start = dayjs(startDate, "YYYY-MM-DD");
            const end = dayjs(endDate, "YYYY-MM-DD");
            return rowDate.isAfter(start.subtract(1, "day")) && rowDate.isBefore(end.add(1, "day"));
        });

        const csvHeaders = columns.map((col) => col.headerName).join(",");
        const csvRows = filteredRowsForDownload.map((row) =>
            columns.map((col) => row[col.field] || "").join(",")
        );
        const csvContent = [csvHeaders, ...csvRows].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "filtered_records_report.csv";
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setOpenDownloadDialog(false);
    };

    return (
        <Box m="5px 25px" height="100%">
            <Box display="flex" justifyContent="space-between" alignItems="space-between" sx={{ flexDirection: { xs: "column", sm: "row" } }}>
                <Header title="Status Notification" subtitle="Monitoring the Parameter Status Notif" />
                <Box>
                    <Button
                        onClick={() => setOpenDownloadDialog(true)}
                        sx={{
                            backgroundColor: colors.greenAccent[400],
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                            margin: "5px",
                        }}
                    >
                        <DownloadIcon sx={{ mr: "10px" }} />
                        Download Reports
                    </Button>
                </Box>
            </Box>

            <Box mt="1px">
                <Paper sx={{ height: {xs:"60vh", md: "70vh"}, width: "100%", overflow: "hidden" }}>
                    <Typography variant="caption" sx={{ ml: 2 }}>
                        Indoor Air Quality (IAQ), Heat Index, Light
                    </Typography>
                    <DataGrid
                        rows={filteredRows} // <-- use filteredRows here
                        columns={columns}
                        disableSelectionOnClick
                        components={{ Toolbar: GridToolbar }}
                        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                        pageSizeOptions={[5, 10, 15]}
                        checkboxSelection
                        onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
                        sx={{
                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: colors.greenAccent[500],
                            },
                            "& .MuiDataGrid-columnHeader": {
                                backgroundColor: colors.greenAccent[700],
                            },
                            "& .MuiDataGrid-footerContainer": {
                                backgroundColor: colors.greenAccent[700],
                            },
                            "& .MuiTablePagination-toolbar": {
                                paddingBottom:"5px",
                            },
                            "& .MuiTablePagination-root .MuiTablePagination-input": {
                                display: "flex"
                            },
                            "& .MuiTablePagination-root .MuiTablePagination-selectLabel": {
                                display: "flex"
                            },
                            "& .MuiDataGrid-root": {
                                border: "none",
                                tableLayout: "auto",
                            },
                        }}
                    />
                </Paper>
            </Box>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleSnackbarClose} severity="info" variant="filled" sx={{ width: '100%' }} action={ViewSuggestion}>
                    INFO: Keep Optimal Conditions
                </Alert>
            </Snackbar>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Delete Record</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        sx={{ backgroundColor: '#4cceac', height: '30px', borderRadius: '25px', fontWeight: 'bold' }}
                        onClick={handleDeleteSelected}
                        color="primary"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : 'Delete Record'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDownloadDialog} onClose={() => setOpenDownloadDialog(false)}>
                <DialogTitle>Select Date Range</DialogTitle>
                <DialogContent>
                    <TextField
                        type="date"
                        label="Start Date"
                        fullWidth
                        margin="dense"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        type="date"
                        label="End Date"
                        fullWidth
                        margin="dense"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: startDate }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDownloadDialog(false)}>Cancel</Button>
                    <Button onClick={handleDownload} color="primary">Download</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ViewNotification;
