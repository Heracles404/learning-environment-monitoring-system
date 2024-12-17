import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { httpGetAllUsers } from "../../hooks/users.requests";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const PreviewAccounts = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const columns = [
        { id: "id", label: "ID", minWidth: 60 },
        { id: "firstName", label: "First Name", minWidth: 150, cellClassName: "name-column--cell" },
        { id: "lastName", label: "Last Name", minWidth: 150, cellClassName: "name-column--cell" },
        { id: "userName", label: "Username", minWidth: 150 },
        { id: "role", label: "Role", minWidth: 150, cellClassName: "role-column--cell" },
        
    ];

    useEffect(() => {
        const fetchData = async () => {
            const data = await httpGetAllUsers();
            const formattedData = data.map((user) => ({
                id: user._id,
                userName: user.userName,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
            }));
            setRows(formattedData);
        };

        fetchData();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Box m="20px">
            <Header title="MEMBERS" subtitle="Viewing the Members" />
            <Box mt="40px">
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: "65vh" }}>
                        <Table stickyHeader>
                        <caption>Internal Faculty Members of ESLIHSYY</caption>

                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align || "left"}
                                            style={{
                                                minWidth: column.minWidth,
                                                fontWeight: "bold",
                                                backgroundColor: colors.greenAccent[700],
                                                color: colors.grey[100],
                                            }}
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
                                                        // sx={{
                                                        //     color:
                                                        //         column.cellClassName === "name-column--cell"
                                                        //             ? colors.greenAccent[300]
                                                        //             : column.cellClassName === "role-column--cell"
                                                        //             ? colors.greenAccent[500]
                                                        //             : "inherit",
                                                        // }}
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

export default PreviewAccounts;
