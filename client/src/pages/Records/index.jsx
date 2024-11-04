import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { readout } from "../../hooks/sensors.requests"; 
import Header from "../../components/Header";
import { useTheme } from "@mui/material";

const Records = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", 
      headerName: "ID",
      flex: .2,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 2,
    },
    {
      field: "time",
      headerName: "Time",
      flex: 2,
    },
    // Monitors
    {
      field: "temperature",
      headerName: "Temperature",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "humidity",
      headerName: "humidity",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "heatIndex",
      headerName: "heatIndex",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "lighting",
      headerName: "lighting",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "headCount",
      headerName: "headCount",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "oxygen",
      headerName: "oxygen",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "carbonDioxide",
      headerName: "carbonDioxide",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "sulfurDioxide",
      headerName: "sulfurDioxide",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "particulateMatter",
      headerName: "particulateMatter",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    // set conditions in arduino
    {
      field: "indoorAir",
      headerName: "indoorAir",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "outdoorAir",
      headerName: "outdoorAir",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "temp",
      headerName: "temp",
      flex: 2,
      cellClassName: "role-column--cell", 
    },
    {
      field: "remarks",
      headerName: "remarks",
      flex: 2,
      cellClassName: "role-column--cell", 
    },

  ];

  return (
    <Box m="20px">
      <Header
        title="Records"
        subtitle="Managing the Records"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: colors.greenAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.greenAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={readout}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Records;