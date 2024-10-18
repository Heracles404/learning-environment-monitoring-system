import { Box, Typography, colors } from "@mui/material";
import React from 'react'
import { DataGrid } from "@mui/x-data-grid";
import { user } from '../../Data/Data'
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
// import Header from "../../components/Header";

const Accounts = () => {
  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", 
      headerName: "ID" },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      cellClassName: "name-column--cell", 
      // to change color of text
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1.4,
      cellClassName: "role-column--cell", 
      // to change color of text
    },
    // {
    //   field: "age",
    //   headerName: "Age",
    //   // type: "number",
    //   headerAlign: "left",
    //   align: "left",
    // },
    // {
    //   field: "phone",
    //   headerName: "Phone Number",
    //   flex: 1,
    // },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="65%"
            m="12px"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "Admin"
                ? colors='#007A5A'
                : access === "Manager"
                ? colors='#00A378'
                : colors='#00CC96'
            }
            borderRadius="4px"
          >
            {access === "Admin" && <AdminPanelSettingsOutlinedIcon />}
            {access === "Manager" && <SecurityOutlinedIcon />}
            {access === "User" && <LockOpenOutlinedIcon />}
            <Typography color="white" sx={{ ml: "5px" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <div>
        <h1>Accounts</h1>
        <h3>Managing the Users</h3>
      </div>
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
          // "& .name-column--cell": {
          //   color: 'red',
          // },
          "& .role-column--cell": {
            color: 'orange',
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: '#ffe1bc',
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: 'white',
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: '#ffe1bc',
          },
          "& .MuiCheckbox-root": {
            color: '#00F5B4',
          },
        }}
      >
        <DataGrid checkboxSelection rows={user} columns={columns} />
      </Box>
    </Box>
  );
};

export default Accounts;