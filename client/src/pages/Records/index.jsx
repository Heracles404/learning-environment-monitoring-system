import React, { useState, useEffect } from "react";
import { httpGetAllReadouts, httpDeleteReadout, httpDeleteAllReadouts } from "../../hooks/sensors.requests";
import { Box, Button, Paper, Typography, Dialog, DialogActions, DialogContent,DialogContentText, DialogTitle, TextField } from "@mui/material";
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
    const [selectedRows, setSelectedRows] = useState([]); // Store selected rows
    const [openDialog, setOpenDialog] = useState(false); // State for confirmation dialog
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [openDownloadDialog, setOpenDownloadDialog] = useState(false); // For download confirmation

    useEffect(() => {
        const fetchData = async () => {
            const data = await httpGetAllReadouts();
            const formattedData = data.map((readout, index) => {
                const iaqStatus = readout.IAQIndex > 100 ? "BAD" : "GOOD";
                const lightingStatus = readout.lighting >= 300 && readout.lighting <= 500 ? "GOOD" : "BAD";
                const tempStatus = readout.temperature < 29 ? "GOOD" : "BAD";
    
                return {
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
                    indoorAir: iaqStatus,   // Updated IAQ Status
                    temp: tempStatus,       // Updated Temperature Status
                    lightRemarks: lightingStatus, // Updated Lighting Status
                };
            });
    
            setRows(formattedData);
        };
    
        fetchData();
    }, []);

    const columns = [
        { field: "classroom", headerName: "Room", width: 98, },
        { field: "date", headerName: "Date", width: 91, },
        { field: "time", headerName: "Time", width: 94, },
        // { field: "temperature", headerName: "Temperature", minWidth: 100, flex: 1 },
        // { field: "humidity", headerName: "Humidity", minWidth: 100, flex: 1 },
        {
            field: "indoorAir",
            headerName: "IAQ Status",
            minWidth:120,
            flex: 1,
            renderCell: ({ row: { indoorAir } }) => {
              return (
                <Box
                //   width="60%"
                  m="8px auto"
                  p="5px"
                  display="flex"
                  justifyContent="center"
                  backgroundColor={
                    indoorAir === "GOOD"
                      ? colors.greenAccent[600]
                      : indoorAir === "BAD"
                      ? colors.redAccent[700]
                      : colors.redAccent[700]
                  }
                  borderRadius="4px"
                >
                  {indoorAir === "GOOD" }
                  {indoorAir === "BAD" }
                  <Typography color={"white"} >
                    {indoorAir}
                  </Typography>
                </Box>
              );
            },
        },
        // { field: "temp", headerName: "Temperature Stat", minWidth: 100, flex: 1 },
        {
            field: "temp",
            headerName: "Temperature Status",
            minWidth:170,
            flex: 1,
            renderCell: ({ row: { temp } }) => {
              return (
                <Box
                //   width="60%"
                  m="8px auto"
                  p="5px"
                  display="flex"
                  justifyContent="center"
                  backgroundColor={
                    temp === "GOOD"
                      ? colors.greenAccent[600]
                      : temp === "BAD"
                      ? colors.redAccent[700]
                      : colors.redAccent[700]
                  }
                  borderRadius="4px"
                >
                  {temp === "GOOD" }
                  {temp === "BAD" }
                  <Typography color={"white"} >
                    {temp}
                  </Typography>
                </Box>
              );
            },
        },
        // { field: "lightRemarks", headerName: "Lighting Stat", minWidth: 91, flex: 1 },
        {
            field: "lightRemarks",
            headerName: "Lighting Status",
            minWidth:145,
            flex: 1,
            renderCell: ({ row: { lightRemarks } }) => {
              return (
                <Box
                //   width="60%"
                  m="8px auto"
                  p="5px"
                  display="flex"
                  justifyContent="center"
                  backgroundColor={
                    lightRemarks === "GOOD"
                      ? colors.greenAccent[600]
                      : lightRemarks === "BAD"
                      ? colors.redAccent[700]
                      : colors.redAccent[700]
                  } 
                  borderRadius="4px"
                >
                  {lightRemarks === "GOOD" }
                  {lightRemarks === "BAD" }
                  <Typography color={"white"} >
                    {lightRemarks}
                  </Typography>
                </Box>
              );
            },
        },
        { field: "heatIndex", headerName: "Heat Index", width: 121.5, },
        { field: "lighting", headerName: "Lighting", width: 105, },
        { field: "IAQIndex", headerName: "IAQ Index", width: 115.5, },
        // { field: "indoorAir", headerName: "IAQ Stat", minWidth: 100, flex: 1 },
        
    ];

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
                <Header title="RECORDS" subtitle="Managing the Records" />
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
                        <DeleteIcon sx={{ mr: "10px" }} />
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
                        <DownloadIcon sx={{ mr: "10px" }} />
                        Download Reports
                    </Button>
                </Box>
            </Box>

            <Box mt="1px">
                <Paper sx={{ height: {xs:"60vh", md: "70vh"}, width: "100%", overflow: "hidden" }}>
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

export default Records;