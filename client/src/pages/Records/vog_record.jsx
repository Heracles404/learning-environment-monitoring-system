import React, { useState, useEffect } from "react";
import { httpGetAllReadouts, httpDeleteReadout } from "../../hooks/vog.requests";
import { Box, Button, Typography, Paper, Dialog,DialogContentText, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import dayjs from "dayjs";

const VOGRecords = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]); // Store selected rows
    const [openDialog, setOpenDialog] = useState(false); // State for confirmation dialog
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [openDownloadDialog, setOpenDownloadDialog] = useState(false); // For download confirmation


    useEffect(() => {
        const fetchData = async () => {
            const data = await httpGetAllReadouts(); // Fetch data from API
            const formattedData = data.map((readout, index) => ({
                id: readout._id || index, // Ensure `id` is unique
                classroom: readout.classroom,
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
        { field: "classroom", headerName: "Room", minWidth: 100, flex: 1 },
        { field: "date", headerName: "Date", minWidth: 100, flex: 1 },
        { field: "time", headerName: "Time", minWidth: 100, flex: 1 },
        { field: "pm25", headerName: "PM 2.5", minWidth: 100, flex: 1 },
        { field: "pm10", headerName: "PM 10.0", minWidth: 100, flex: 1 },
        { field: "OAQIndex", headerName: "OAQ Index", minWidth: 100, flex: 1 },
        { field: "level", headerName: "Concern Level", minWidth: 100, flex: 1 },
    ];

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
        link.download = "filtered_vog_records.csv";
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Close the dialog
        setOpenDownloadDialog(false); // Close download dialog
    };


    const handleDeleteSelected = async () => {

        if (selectedRows.length === 0) {
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
        setOpenDialog(false); // Close dialog after deletion

    };

    return (
        <Box m="5px 25px">
            {/* HEADER */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="space-between"
                sx={{
                    flexDirection: { xs: "column", sm: "row" },
                }}
            >
                <Header title="VOG Records" subtitle="Managing the VOG Records" />

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
                        <DownloadOutlinedIcon sx={{ mr: "10px" }} />
                        Download Reports
                    </Button>
                </Box>
            </Box>

            <Box mt="1px">
                <Paper sx={{ height: "70vh", width: "100%", overflow: "hidden" }}>
                    <Typography variant="caption" sx={{ ml: 2 }}>
                        Records for Volcanic Smog Parameters
                    </Typography>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        disableSelectionOnClick
                        components={{
                            Toolbar: GridToolbar,
                        }}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                        }}
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
                        inputProps={{
                            min: startDate, // Prevent selecting a date before the start date
                        }}
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setOpenDownloadDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleDownload}
                        sx={{
                            backgroundColor: colors.greenAccent[700],
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        Download
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VOGRecords;
