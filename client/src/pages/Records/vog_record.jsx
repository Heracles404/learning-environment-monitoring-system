import React, { useState, useEffect } from "react";
import {
  httpGetAllReadouts,
  httpDeleteReadout,
} from "../../hooks/vog.requests";
import {
  Box,
  Button,
  Typography,
  Paper,
  Dialog,
  Snackbar,
  Alert,
  DialogContentText,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";

const VOGRecords = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [allRows, setAllRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [loading, setLoading] = useState(false);

  // Time filter states
  const [filterStartTime, setFilterStartTime] = useState("");
  const [filterEndTime, setFilterEndTime] = useState("");

  const fetchData = async () => {
    const data = await httpGetAllReadouts();
    const formattedData = data.map((readout, index) => {
      const level = Number(readout.level);
      const oaqIndex = Number(readout.OAQIndex);

      let vogStatus = "INACTIVE";
      if (level === 1) vogStatus = "GOOD";
      else if (level === 2 || level === 3) vogStatus = "CRITICAL";
      else if (level === 4) vogStatus = "BAD";

      return {
        id: readout._id || index,
        classroom: readout.classroom,
        date: readout.date,
        time: readout.time,
        pm25: readout.pm25,
        pm10: readout.pm10,
        OAQIndex: oaqIndex,
        level: level,
        vogStatus,
      };
    });
    setAllRows(formattedData);
    setRows(formattedData);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter rows automatically whenever start or end time changes
  useEffect(() => {
    if (filterStartTime && filterEndTime) {
      const filtered = allRows.filter((row) => {
        const rowTime = row.time.length > 5 ? row.time.slice(0, 5) : row.time;
        return rowTime >= filterStartTime && rowTime <= filterEndTime;
      });
      setRows(filtered);
    } else {
      // If either filter empty, show all rows
      setRows(allRows);
    }
  }, [filterStartTime, filterEndTime, allRows]);

  const columns = [
    { field: "date", headerName: "Date", width: 91 },
    { field: "time", headerName: "Time", width: 94 },
    { field: "level", headerName: "Concern Level", width: 140 },
    {
      field: "vogStatus",
      headerName: "VOG Status",
      minWidth: 125,
      flex: 1,
      renderCell: ({ row: { vogStatus } }) => {
        let bgColor = "#9e9e9e";
        let textColor = "#ffffff";

        switch (vogStatus) {
          case "GOOD":
            bgColor = colors.greenAccent[600];
            break;
          case "CRITICAL":
            bgColor = colors.redAccent[700];
            break;
          case "BAD":
            bgColor = colors.redAccent[900] ?? "#800000";
            break;
          case "INACTIVE":
          default:
            bgColor = "#9e9e9e";
            textColor = "#000000";
            break;
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
            <Typography color={textColor}>{vogStatus}</Typography>
          </Box>
        );
      },
    },
    { field: "pm25", headerName: "PM 2.5", width: 120 },
    { field: "pm10", headerName: "PM 10.0", width: 120 },
    { field: "OAQIndex", headerName: "OAQ Index", width: 130 },
  ];

  const handleDownload = () => {
    const filteredRows = rows;

    const csvHeaders = columns.map((col) => col.headerName).join(",");
    const csvRows = filteredRows.map((row) =>
      columns.map((col) => row[col.field] || "").join(",")
    );
    const csvContent = [csvHeaders, ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "filtered_vog_records.csv";
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setOpenDownloadDialog(false);
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) return;
    setLoading(true);
    try {
      for (const id of selectedRows) {
        const result = await httpDeleteReadout(id);
        if (result.ok) {
          setRows((prevRows) => prevRows.filter((row) => row.id !== id));
          setAllRows((prevRows) => prevRows.filter((row) => row.id !== id));
        } else {
          console.error(`Failed to delete record with id: ${id}`);
        }
      }
      setSelectedRows([]);
      setSnackbar({
        open: true,
        message: "Row Deleted Successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error during deletion:", error);
    }
    setLoading(false);
    setOpenDialog(false);
  };

  return (
    <Box m="5px 25px" height="100%">
      <Box
        display="flex"
        justifyContent="space-between"
        sx={{ flexDirection: { xs: "column", sm: "row" } }}
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
            <DeleteIcon sx={{ mr: "10px" }} /> Delete Selected Rows
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
            <DownloadIcon sx={{ mr: "10px" }} /> Download Reports
          </Button>
        </Box>
      </Box>

      {/* Time Filters only */}
      <Box
        display="flex"
        gap={2}
        mb={2}
        alignItems="center"
        flexWrap="wrap"
        sx={{ mt: 2 }}
      >
        <TextField
          type="time"
          label="Start Time"
          value={filterStartTime}
          onChange={(e) => setFilterStartTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="time"
          label="End Time"
          value={filterEndTime}
          onChange={(e) => setFilterEndTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      <Box mt="1px">
        <Paper
          sx={{
            height: { xs: "60vh", md: "70vh" },
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Typography variant="caption" sx={{ ml: 2 }}>
            Volcanic Smog (VOG)
          </Typography>
          <DataGrid
            rows={rows}
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
              "& .MuiTablePagination-toolbar": {
                paddingBottom: "20px",
              },
              "& .MuiTablePagination-root .MuiTablePagination-input": {
                display: "flex",
              },
              "& .MuiTablePagination-root .MuiTablePagination-selectLabel": {
                display: "flex",
              },
              "& .MuiDataGrid-root": {
                border: "none",
                tableLayout: "auto",
              },
            }}
          />
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
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
            sx={{
              backgroundColor: "#4cceac",
              height: "30px",
              borderRadius: "25px",
              fontWeight: "bold",
            }}
            onClick={handleDeleteSelected}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Record"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Download Dialog */}
      <Dialog
        open={openDownloadDialog}
        onClose={() => setOpenDownloadDialog(false)}
      >
        <DialogTitle>Download Filtered Records</DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={2}>
            This will download the currently filtered records (by time).
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDownloadDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDownload}
            sx={{ backgroundColor: colors.greenAccent[700], color: "white", fontWeight: "bold" }}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VOGRecords;
