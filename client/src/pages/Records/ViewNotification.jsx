import React, { useState, useEffect } from "react";
import { httpGetAllReadouts, httpDeleteReadout, httpDeleteAllReadouts } from "../../hooks/sensors.requests";
import { Box, Button, Paper, Typography, Snackbar, Alert, Dialog, DialogActions, DialogContent,DialogContentText, DialogTitle, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from "dayjs";
import { Link } from 'react-router-dom';

const ViewNotification = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]); // Store selected rows
    const [openDialog, setOpenDialog] = useState(false); // State for confirmation dialog
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [openDownloadDialog, setOpenDownloadDialog] = useState(false); // For download confirmation
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // Revision Number 5
    useEffect(() => {
        setSnackbarOpen(true);
      }
    );
    // 3. Add a handler for closing the snackbar
    const handleSnackbarClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setSnackbarOpen(false);
    };
    const ViewSuggestion = (
    <Link to="/Suggestion" style={{ textDecoration: 'none', color:"white" }}>
      <Button color="white" size="small">
        View Suggestions
      </Button>
    </Link>
    );

   
const fetchData = async () => {
    const data = await httpGetAllReadouts();
    const formattedData = data.map((readout, index) => {
        // --- IAQ status logic ---
        let iaqStatus = "INACTIVE";
        if (readout.IAQIndex <= 150) iaqStatus = "GOOD";
        else if (readout.IAQIndex <= 300) iaqStatus = "BAD";
        else if (readout.IAQIndex <= 500) iaqStatus = "DANGER";

        // --- Lighting logic ---
        let lightingStatus = "INACTIVE";
        if (readout.lighting !== undefined && readout.lighting !== null) {
            if (readout.lighting === -1) lightingStatus = "INOPERATIVE";
            else if (readout.lighting <= 20) lightingStatus = "CLOSED";
            else if (readout.lighting >= 300) lightingStatus = "GOOD";
            else if (readout.lighting <= 299) lightingStatus = "DIM";
            else if (readout.lighting <= 150) lightingStatus = "BAD";
        }

        // --- Heat Index logic ---
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
            let bgColor = "#ccc";
            let textColor = "black";

            switch (indoorAir) {
                case "GOOD":
                    bgColor = colors.greenAccent[600];
                    textColor = "white";
                    break;
                case "BAD":
                     bgColor = colors.redAccent[700]; 
                    textColor = "white";
                    break;
                case "DANGER":
                    bgColor = "#990000"
                    textColor = "white";
                    break;
                default:
                    bgColor = "#ccc";
                    textColor = "black";
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
                case "GOOD":
                    bgColor = colors.greenAccent[600];
                    textColor = "white";
                    break;
                case "BAD":
                    bgColor = colors.redAccent[700];
                    textColor = "white";
                    break;
                case "DANGER":
                    bgColor = "#990000"
                    textColor = "white";
                    break;
                default:
                    bgColor = "#ccc";
                    textColor = "black";
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
                case "GOOD":
                    bgColor = colors.greenAccent[600];
                    textColor = "white";
                    break;
                case "DIM":
                    bgColor = "#ff9933";
                    textColor = "black";
                    break;
                case "BAD":
                    bgColor = colors.redAccent[700];
                    textColor = "white";
                    break;
                case "CLOSED":
                    bgColor = "#666666";
                    textColor = "white";
                    break;
                case "INOPERATIVE":
                    bgColor = colors.greenAccent[600];
                    textColor = "white";
                    break;
                default:
                    bgColor = "#ccc";
                    textColor = "black";
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
                    <Typography color={textColor}>{lightRemarks}</Typography>
                </Box>
            );
        },
    },
    // Optional extra columns
    // { field: "IAQIndex", headerName: "IAQ Index", width: 115 },
    // { field: "heatIndex", headerName: "Heat Index", width: 121 },
    // { field: "lighting", headerName: "Lighting", width: 105 },
];




    const handleDeleteSelected = async () => { 
        if (selectedRows.length === 0) {
            return;
        }
        setLoading(true); // Set loading to true when deletion starts
        try {
            for (const id of selectedRows) {
                const result = await httpDeleteReadout(id);
                if (result.ok) {
                    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
                } else {
                    console.error(`Failed to delete record with id: ${id}`);
                }
            }
            setSelectedRows([]); // Clear selection after deletion
            setSnackbar({ open: true, message: 'Row Deleted Successfully!', severity: 'success' });
        } catch (error) {
            console.error("Error during deletion:", error);
        }
        setLoading(false); // Set loading to false when deletion ends
        setOpenDialog(false); // Close dialog after deletion 
    };
    

    const handleDownload = () => {
        // Filter rows based on date range
        const filteredRows = rows.filter((row) => {
            const rowDate = dayjs(row.date, "MM/DD/YYYY");
            const start = dayjs(startDate, "YYYY-MM-DD");
            const end = dayjs(endDate, "YYYY-MM-DD");
            return rowDate.isAfter(start.subtract(1, "day")) && rowDate.isBefore(end.add(1, "day"));
        });

        // Convert filtered rows to CSV format
        const csvHeaders = columns.map((col) => col.headerName).join(",");
        const csvRows = filteredRows.map((row) =>
            columns.map((col) => row[col.field] || "").join(",")
        );
        const csvContent = [csvHeaders, ...csvRows].join("\n");

        // Create a blob and trigger download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "filtered_records_report.csv";
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Close the dialog after download
        setOpenDownloadDialog(false); // Close download dialog
    };


    return (
        <Box m="5px 25px" height="100%">
            <Box display="flex" justifyContent="space-between" alignItems="space-between" sx={{ flexDirection: { xs: "column", sm: "row" } }}>
                <Header title="Status Notification" subtitle="Monitoring the Parameter Status Notif" />
                <Box>
                    {/* <Button
                        onClick={() => setOpenDialog(true)}
                        sx={{
                            backgroundColor: colors.redAccent[500],
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                            margin: "5px",
                        }}
                    >
                        <DeleteIcon sx={{ mr: "10px" }} />
                        Delete Selected Rows
                    </Button> */}
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
                        rows={rows}
                        columns={columns}
                        disableSelectionOnClick
                        components={{ Toolbar: GridToolbar }}
                        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                        pageSizeOptions={[5, 10, 15]}
                        checkboxSelection
                        onRowSelectionModelChange={(ids) => setSelectedRows(ids)} // Update selected rows
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
            {/* ----------------SNACKBAR FOR ALERT - REVISIONS---------------- */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}         
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }} > 
              <Alert
                onClose={handleSnackbarClose}
                severity="info"
                variant="filled"
                sx={{ width: '100%' }}
                action={ViewSuggestion}
              >
                INFO: Keep Optimal Conditions
              </Alert>
            </Snackbar>
            {/* Snackbar Alerts */}
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
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? 'Deleting...' : 'Delete Record'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Date Range Dialog */}
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
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        type="date"
                        label="End Date"
                        fullWidth
                        margin="dense"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            min: startDate,
                        }}
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