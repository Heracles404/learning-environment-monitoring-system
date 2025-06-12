import React, { useState, useEffect } from "react";
import { httpGetAllReadouts, httpDeleteReadout } from "../../hooks/sensors.requests";
import { Box, Button, Paper, Typography, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from "dayjs";

const Records = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        const data = await httpGetAllReadouts();
        const formattedData = data.map((readout, index) => {
            let iaqStatus = "INACTIVE";
            if (readout.IAQIndex !== undefined && readout.IAQIndex !== null) {
                if (readout.IAQIndex <= 150) iaqStatus = "GOOD";
                else if (readout.IAQIndex <= 300) iaqStatus = "CRITICAL";
                else if (readout.IAQIndex <= 500) iaqStatus = "BAD";
                else iaqStatus = "INACTIVE";
            }

            let lightingStatus = "INACTIVE";
            if (readout.lighting !== undefined && readout.lighting !== null) {
                if (readout.lighting === -1) lightingStatus = "NIGHT";
                else if (readout.lighting <= 20) lightingStatus = "DARK";
                else if (readout.lighting >= 300) lightingStatus = "GOOD";
                else if (readout.lighting <= 299) lightingStatus = "DIM";
                else if (readout.lighting <= 150) lightingStatus = "BAD";
            }

            let tempStatus = "INACTIVE";
            if (readout.heatIndex !== undefined && readout.heatIndex !== null) {
                if (readout.heatIndex <= 27) tempStatus = "GOOD";
                else if (readout.heatIndex <= 35) tempStatus = "CRITICAL";
                else if (readout.heatIndex >= 36) tempStatus = "BAD";
            }

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
                let bgColor = "#ccc";
                let textColor = "black";

                switch (indoorAir) {
                    case "GOOD": bgColor = colors.greenAccent[600]; textColor = "white"; break;
                    case "BAD": bgColor = "#990000"; textColor = "white"; break;
                    case "CRITICAL": bgColor = colors.redAccent[700]; textColor = "white"; break;
                    case "INACTIVE": default: bgColor = "#999999"; textColor = "white"; break;
                }

                return (
                    <Box m="8px auto" p="5px" display="flex" justifyContent="center" backgroundColor={bgColor} borderRadius="4px">
                        <Typography color={textColor}>{indoorAir}</Typography>
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
                let bgColor = "#ccc";
                let textColor = "black";

                switch (temp) {
                    case "GOOD": bgColor = colors.greenAccent[600]; textColor = "white"; break;
                    case "CRITICAL": bgColor = colors.redAccent[700]; textColor = "white"; break;
                    case "BAD": bgColor = "#990000"; textColor = "white"; break;
                    case "INACTIVE": default: bgColor = "#999999"; textColor = "white"; break;
                }

                return (
                    <Box m="8px auto" p="5px" display="flex" justifyContent="center" backgroundColor={bgColor} borderRadius="4px">
                        <Typography color={textColor}>{temp}</Typography>
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
                let bgColor = "#ccc";
                let textColor = "black";

                switch (lightRemarks) {
                    case "GOOD": bgColor = colors.greenAccent[600]; textColor = "white"; break;
                    case "DIM": bgColor = "#ff9933"; textColor = "white"; break;
                    case "BAD": bgColor = colors.redAccent[700]; textColor = "white"; break;
                    case "DARK": bgColor = "#666666"; textColor = "white"; break;
                    case "NIGHT": bgColor = "#333333"; textColor = "white"; break;
                    case "INACTIVE": default: bgColor = "#999999"; textColor = "white"; break;
                }

                return (
                    <Box m="8px auto" p="5px" display="flex" justifyContent="center" backgroundColor={bgColor} borderRadius="4px">
                        <Typography color={textColor}>{lightRemarks}</Typography>
                    </Box>
                );
            },
        },
        { field: "IAQIndex", headerName: "IAQ Index", width: 115.5 },
        { field: "heatIndex", headerName: "Heat Index", width: 121.5 },
        { field: "lighting", headerName: "Lighting", width: 105 },
    ];

    const timeToMinutes = (timeStr) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
    };

    const filteredRows = rows.filter(row => {
        if (!startTime || !endTime) return true;
        const rowMinutes = timeToMinutes(row.time);
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        const startTotal = startHours * 60 + startMinutes;
        const endTotal = endHours * 60 + endMinutes;
        return rowMinutes >= startTotal && rowMinutes <= endTotal;
    });

    const handleDeleteSelected = async () => {
        if (selectedRows.length === 0) return;
        setLoading(true);
        try {
            for (const id of selectedRows) {
                const result = await httpDeleteReadout(id);
                if (result.ok) {
                    setRows(prevRows => prevRows.filter(row => row.id !== id));
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
        const filteredForDownload = rows.filter((row) => {
            const rowDate = dayjs(row.date, "MM/DD/YYYY");
            const start = dayjs(startDate, "YYYY-MM-DD");
            const end = dayjs(endDate, "YYYY-MM-DD");
            return rowDate.isAfter(start.subtract(1, "day")) && rowDate.isBefore(end.add(1, "day"));
        });

        const csvHeaders = columns.map(col => col.headerName).join(",");
        const csvRows = filteredForDownload.map(row => columns.map(col => row[col.field] || "").join(","));
        const csvContent = [csvHeaders, ...csvRows].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "filtered_records_report.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setOpenDownloadDialog(false);
    };

    return (
        <Box m="5px 25px" height="100%">
            <Box display="flex" justifyContent="space-between" sx={{ flexDirection: { xs: "column", sm: "row" } }}>
                <Header title="RECORDS" subtitle="Managing the Records" />
                <Box>
                    <TextField
                        label="Start Time"
                        type="time"
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ margin: 1 }}
                    />
                    <TextField
                        label="End Time"
                        type="time"
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ margin: 1 }}
                    />
                    <Button onClick={() => setOpenDialog(true)} sx={{ backgroundColor: colors.redAccent[500], color: "white", fontWeight: "bold", margin: 1 }}>
                        <DeleteIcon sx={{ mr: "10px" }} /> Delete Selected Rows
                    </Button>
                    <Button onClick={() => setOpenDownloadDialog(true)} sx={{ backgroundColor: colors.greenAccent[400], color: "white", fontWeight: "bold", margin: 1 }}>
                        <DownloadIcon sx={{ mr: "10px" }} /> Download Reports
                    </Button>
                </Box>
            </Box>

            <Paper sx={{ height: { xs: "60vh", md: "70vh" }, width: "100%" }}>
                <Typography variant="caption" sx={{ ml: 2 }}>Indoor Air Quality (IAQ), Heat Index, Light</Typography>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    disableSelectionOnClick
                    components={{ Toolbar: GridToolbar }}
                    initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                    pageSizeOptions={[5, 10, 15]}
                    checkboxSelection
                    onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
                    sx={{
                        "& .MuiDataGrid-row:hover": { backgroundColor: colors.greenAccent[500] },
                        "& .MuiDataGrid-columnHeader": { backgroundColor: colors.greenAccent[700] },
                        "& .MuiDataGrid-footerContainer": { backgroundColor: colors.greenAccent[700] },
                        "& .MuiDataGrid-root": { border: "none", tableLayout: "auto" }
                    }}
                />
            </Paper>

            <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Delete Record</DialogTitle>
                <DialogContent><DialogContentText>Are you sure you want to delete?</DialogContentText></DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleDeleteSelected} color="primary" variant="contained" disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete Record'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDownloadDialog} onClose={() => setOpenDownloadDialog(false)}>
                <DialogTitle>Select Date Range</DialogTitle>
                <DialogContent>
                    <TextField type="date" label="Start Date" fullWidth margin="dense" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
                    <TextField type="date" label="End Date" fullWidth margin="dense" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: startDate }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDownloadDialog(false)}>Cancel</Button>
                    <Button onClick={handleDownload} color="primary">Download</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Records;
