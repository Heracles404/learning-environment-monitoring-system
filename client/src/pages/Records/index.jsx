import React, { useState, useEffect } from "react";
import { httpGetAllReadouts, httpDeleteReadout, httpDeleteAllReadouts } from "../../hooks/sensors.requests";
import { Box, Button, Paper, Typography, Dialog, DialogActions, DialogContent,DialogContentText, DialogTitle, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import dayjs from "dayjs";

const Records = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]); // Store selected rows
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [openDialog, setOpenDialog] = useState(false); // State for confirmation dialog

    useEffect(() => {
        const fetchData = async () => {
            const data = await httpGetAllReadouts();
            const formattedData = data.map((readout, index) => ({
                id: readout._id || index, // Ensure `id` is unique
                classroom: readout.classroom,
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
            setRows(formattedData);
        };

        fetchData();
    }, []);

    const columns = [
        { field: "classroom", headerName: "Room", minWidth: 98, flex: 1 },
        { field: "date", headerName: "Date", minWidth: 91, flex: 1 },
        { field: "time", headerName: "Time", minWidth: 94, flex: 1 },
        { field: "temperature", headerName: "Temperature", minWidth: 100, flex: 1 },
        { field: "humidity", headerName: "Humidity", minWidth: 100, flex: 1 },
        { field: "heatIndex", headerName: "Heat Index", minWidth: 100, flex: 1 },
        { field: "lighting", headerName: "Lighting", minWidth: 100, flex: 1 },
        { field: "voc", headerName: "VOC", minWidth: 91, flex: 1 },
        { field: "IAQIndex", headerName: "IAQ Index", minWidth: 100, flex: 1 },
        { field: "indoorAir", headerName: "IAQ Stat", minWidth: 100, flex: 1 },
        { field: "temp", headerName: "Temperature Stat", minWidth: 100, flex: 1 },
    ];

    const handleDeleteSelected = async () => {
        console.log("Selected Rows for deletion:", selectedRows);

        if (selectedRows.length === 0) {
            console.log("No records selected for deletion");
            return;
        }

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
        } catch (error) {
            console.error("Error during deletion:", error);
        }
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
        setOpen(false);
    };

    const handleCloseDialog = () => setOpen(false);

    return (
        <Box m="5px 25px">
            <Box display="flex" justifyContent="space-between" alignItems="space-between" sx={{ flexDirection: { xs: "column", sm: "row" } }}>
                <Header title="Records" subtitle="Managing the Records" />
                <Box>
                    <Button
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
                        <DeleteOutlinedIcon sx={{ mr: "10px" }} />
                        Delete Selected Rows
                    </Button>
                    <Button
                        onClick={() => setOpen(true)}
                        sx={{
                            backgroundColor: colors.greenAccent[400],
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                            margin: "5px",
                        }}
                    >
                        <DownloadOutlinedIcon sx={{ mr: "10px" }} />
                        Download Reports
                    </Button>
                </Box>
            </Box>

            <Box mt="1px">
                <Paper sx={{ height: "70vh", width: "100%", overflow: "hidden" }}>
                    <Typography variant="caption" sx={{ ml: 2 }}>
                        Records for Environmental Parameters
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
                        }}
                    />
                </Paper>
            </Box>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Delete Record</DialogTitle>
                <DialogContent>
                <DialogContentText>Are you sure you want to delete?</DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setOpenDialog(false)} color="secondary">
                    Cancel
                </Button>
                <Button sx={{backgroundColor: '#4cceac',height: '30px', borderRadius: '25px', fontWeight: 'bold',}}
                onClick={handleDeleteSelected} color="primary" variant="contained">
                    Delete Record
                </Button>
                </DialogActions>
            </Dialog>

            {/* Date Range Dialog */}
            <Dialog open={open} onClose={handleCloseDialog}>
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
                    <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
                    <Button onClick={handleDownload} color="primary">Download</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Records;