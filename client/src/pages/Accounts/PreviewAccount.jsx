
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {httpGetAllUsers} from "../../hooks/users.requests";
import Header from "../../components/Header";
import {useEffect, useState} from "react";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
const PreviewAccounts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);

  const columns = [
    { field: "id", headerName: "ID" },
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
          field: "userName",
          headerName: "Username",
          flex: 1,
      },
      {
      field: "role",
      headerName: "Role",
      flex: 1.4,
      cellClassName: "role-column--cell", 
      // to change color of text
    },

  ];

    useEffect(() => {
        const fetchData = async () => {
            const data = await httpGetAllUsers(); // Fetch data from API
            const formattedData = data.map(user => ({
                id: user._id,
                userName: user.userName,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
            }));
            setRows(formattedData); // Set the formatted data to state
        };

        fetchData(); // Call the fetch function
    }, []); // Empty dependency array to run only once on mount

    return (
        <Box m="20px">
            <Header title="USERS" subtitle="Viewing the Users" />
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
                }}
            >
                <DataGrid checkboxSelection rows={rows} columns={columns} /> {/* Use the state variable here */}
            </Box>
        </Box>
    );
};

export default PreviewAccounts;
