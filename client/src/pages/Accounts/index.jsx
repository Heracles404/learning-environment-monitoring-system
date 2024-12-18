import React, { useEffect, useState } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Typography, useTheme } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { tokens } from "../../theme";
import { httpGetAllUsers, httpDeleteUser } from "../../hooks/users.requests";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

const Accounts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      const data = await httpGetAllUsers(); // Fetch data from API
      const formattedData = data.map(user => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        role: user.role,
      }));
      setRows(formattedData);
    };

    fetchData(); // Fetch data when component mounts
  }, []);

  const columns = [
    { id: "id", label: "ID", minWidth: 60 },
    { id: "firstName", label: "First Name", minWidth: 150 },
    { id: "lastName", label: "Last Name", minWidth: 150 },
    { id: "userName", label: "Username", minWidth: 150 },
    { id: "role", label: "Role", minWidth: 120 },
    {
      id: "edit",
      label: "Edit",
      minWidth: 80,
      align: "center",
      renderCell: (row) => (
          <button
              style={{ background: "none", border: "none", cursor: "pointer" }}
              onClick={() => navigate(`../EditAccount/${row.userName}`)} // Navigate to edit page with user ID
          >
            <EditOutlinedIcon style={{ color: "orange", fontSize: "20px" }} />
          </button>
      ),
    },
    {
      id: "delete",
      label: "Delete",
      minWidth: 80,
      align: "center",
      renderCell: (row) => (
          <button
              style={{ background: "none", border: "none", cursor: "pointer" }}
              onClick={async () => {
                const confirmed = window.confirm(`Are you sure you want to delete ${row.userName}?`);
                if (confirmed) {
                  const response = await httpDeleteUser(row.userName);
                  if (response.ok) {
                    // Update the rows state to remove the deleted user
                    setRows((prevRows) => prevRows.filter((user) => user.userName !== row.userName));
                  } else {
                    alert("Failed to delete user. Please try again.");
                  }
                }
              }}
          >
            <DeleteOutlineIcon style={{ color: "red", fontSize: "20px" }} />
          </button>
      ),
    }
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box m="20px">
      <Header title="ACCOUNTS" subtitle="Managing the Users" />
      <Box mt="40px">
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ height: "65vh" }}>
            <Table stickyHeader>
            <caption>Authorized User Accounts of ESLIHS</caption>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{
                        minWidth: column.minWidth,
                        fontWeight: "bold",
                        backgroundColor: colors.greenAccent[700],
                        color: colors.grey[100],
                      }}
                      align={column.align || "left"}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align || "left"}
                            sx={{
                              color:
                                column.id === "role"
                                  ? colors.greenAccent[300]
                                  : "inherit",
                            }}
                          >
                            {column.renderCell
                              ? column.renderCell(row)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              backgroundColor: colors.greenAccent[700],
              color: colors.grey[100],
            }}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default Accounts;
