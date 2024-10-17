import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './Tables.css'

function createData(
  name: string,
  ideal: string,
  current: string,
  min: string,
  max: string,
  variance: string,
  deviation: string,
  status: string,
) {
  return { name, ideal, current, min, max, variance, deviation, status };
}

const rows = [
  createData('Temperature', '22°C', '24°C', '20°C', '26°C', '6°C', '+2°C', 'Low'),
  createData('Light (lux)', 500, 450, 300, 600, 300, -50, 'Low'),
  createData('Oxygen', 50, 75, 40, 100, 65, +25, 'Mid'),
  createData('Carbon Dioxide (ppm)', 400, 450, 350, 500,  150, +50, 'Mid'),
  createData('Smog (PM2.5)', '12 µg/m³', '20 µg/m³', '10 µg/m³', '30 µg/m³', '20 µg/m³', '+8 µg/m³', 'High'),
  createData('Head Count', 40, 60, 30, 60, 30, -5, 'High'),
];

const makeStyles=(status)=>{
    if(status === 'Mid')
    {
      return {
        background: 'rgb(11 255 11 / 57%)',
        color: 'white',
      }
    }
    else if(status === 'Low')
    {
      return{
        background: 'rgb(255 15 5 / 67%)',
        color: 'white',
      }
    }
    else{
      return{
        background: 'rgb(15 125 255 / 77%)',
        color: 'white',
      }
    }
  }

export default function BasicTable() {
  return (
    <div className="Table">
    
    <TableContainer component={Paper}
        style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
    >

      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell> </TableCell>
            <TableCell align="left">Ideal</TableCell>
            <TableCell align="left">Current&nbsp;</TableCell>
            <TableCell align="left">Minimum&nbsp;</TableCell>
            <TableCell align="left">Maximum&nbsp;</TableCell>
            <TableCell align="left">Variance&nbsp;</TableCell>
            <TableCell align="left">Deviation&nbsp;</TableCell>
            <TableCell align="left">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="left">{row.ideal}</TableCell>
              <TableCell align="left">{row.current}</TableCell>
              <TableCell align="left">{row.min}</TableCell>
              <TableCell align="left">{row.max}</TableCell>
              <TableCell align="left">{row.variance}</TableCell>
              <TableCell align="left">{row.deviation}</TableCell>
              <TableCell align="left">
                <span className="status" style={makeStyles(row.status)}>{row.status}</span>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}
