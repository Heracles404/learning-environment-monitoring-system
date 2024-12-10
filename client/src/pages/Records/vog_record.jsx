import React, { useState, useEffect } from "react";
import {httpGetAllReadouts} from "../../hooks/vog.requests";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const VOGRecords = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await httpGetAllReadouts(); // Fetch data from API
            const formattedData = data.map(readout => ({
                id: readout._id,
                date: readout.date,
                time: readout.time,
                pm25: readout.pm25,
                pm10: readout.pm10,
                OAQIndex: readout.OAQIndex,
                remarks: readout.remarks,
            }));
            setRows(formattedData); // Set the formatted data to state
        };

        fetchData(); // Call the fetch function
    }, []); // Empty dependency array to run only once on mount

    const columns = [
        { field: "id", headerName: "ID", flex: 0.2 },
        { field: "date", headerName: "Date", flex: 2 },
        { field: "time", headerName: "Time", flex: 2 },
        { field: "pm25", headerName: "PM 2.5", flex: 2, cellClassName: "role-column--cell" },
        { field: "pm10", headerName: "PM 10.0", flex: 2, cellClassName: "role-column--cell" },
        { field: "OAQIndex", headerName: "OAQ Index", flex: 2, cellClassName: "role-column--cell" },
        { field: "remarks", headerName: "Remarks", flex: 2, cellClassName: "role-column--cell" },


        // {
        //     field: "delete",
        //     headerName: "",
        //     flex: 0.1,
        //     renderCell: (params) => (
        //         <button
        //             // onClick={() => handleDelete(params.row.id)}
        //             style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        //             <DeleteOutlineIcon style={{
        //                 color: 'red',
        //                 fontSize: '20px' }} />
        //         </button>
        //     ),
        // },
    ];

    return (
        <Box m="20px">
            <Header title="VOG Records" subtitle="Managing the VOG Records" />
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": { border: "none" },
                    "& .MuiDataGrid-cell": { borderBottom: "none" },
                    "& .name-column--cell": { color: colors.greenAccent[300] },
                    "& .MuiDataGrid-columnHeader": { backgroundColor: colors.greenAccent[700], borderBottom: "none" },
                    "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
                    "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.greenAccent[700] },
                    "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": { color: `${colors.grey[100]} !important` },
                }}
            >
                <DataGrid checkboxSelection
                          rows={rows}
                          columns={columns}
                          components={{ Toolbar: GridToolbar }} />
            </Box>
        </Box>
    );
};

export default VOGRecords;
