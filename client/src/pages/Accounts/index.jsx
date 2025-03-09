import React, { useEffect, useState } from "react";
import { Box, Snackbar, Alert, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Typography, useTheme, Dialog,DialogContentText, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });


  useEffect(() => {
    const fetchData = async () => {
      const data = await httpGetAllUsers();
      const formattedData = data.map((user) => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        role: user.role,
      }));
      setRows(formattedData);
    };

    fetchData();
  }, []);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      const response = await httpDeleteUser(selectedUser.userName);
      if (response.ok) {
        setRows((prevRows) => prevRows.filter((user) => user.userName !== selectedUser.userName));
        setSnackbar({ open: true, message: 'User Deleted Successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to delete user. Please try again.', severity: 'error' });

      }
    }
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const columns = [
    { id: "userName", label: "Username", minWidth: 150 },
    { id: "firstName", label: "First Name", minWidth: 150 },
    { id: "lastName", label: "Last Name", minWidth: 150 },
    { id: "role", label: "Role", minWidth: 120 },
    {
      id: "edit",
      label: "Edit",
      minWidth: 80,
      align: "center",
      renderCell: (row) => (
        <button
          style={{ background: "none", border: "none", cursor: "pointer" }}
          onClick={() => navigate(`../EditAccount/${row.userName}`)}
        >
          <EditIcon style={{ color: "orange", fontSize: "20px" }} />
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
          onClick={() => handleDeleteClick(row)}
        >
          <DeleteIcon style={{ color: "red", fontSize: "20px" }} />
        </button>
      ),
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box m="5px 25px">
      <Header title="ACCOUNTS" subtitle="Managing the Users" />
      <Box mt="1px">
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <Typography variant="caption" sx={{ ml: 2 }}>
            Account User Record
          </Typography>
          <TableContainer sx={{ height: "65vh" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{
                        minWidth: column.minWidth,
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
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow hover key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align || "left"}
                          sx={{
                            color: column.id === "role" ? colors.greenAccent[300] : "inherit",
                          }}
                        >
                          {column.renderCell ? column.renderCell(row) : value}
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
            sx={{ backgroundColor: colors.greenAccent[700], color: colors.grey[100] }}
          />
        </Paper>
      </Box>
       {/* Snackbar Alerts */}
       <Snackbar 
                open={snackbar.open} 
                autoHideDuration={2000} 
                onClose={() => setSnackbar({ ...snackbar, open: false })} 
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
      
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{selectedUser?.userName}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button sx={{backgroundColor: '#4cceac',height: '30px', borderRadius: '25px', fontWeight: 'bold',}}
                onClick={handleConfirmDelete} color="primary" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Accounts;
