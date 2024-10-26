import React from 'react'
import {Box } from '@mui/material'
import Grid from '@mui/material/Grid2';


const LoginPage = () => {
  return (
    <Grid container m={4} rowSpacing={3} columnSpacing={{ xs: 1, sm: 1, md: 3 }}>
  <Grid size={{ xs: 12, sm: 12, md: 4 }} display="flex" justifyContent="center" alignItems="center">
  <Box
            sx={{
                display: 'flex',
                bgcolor: 'green',
                color: 'white',
                height: '451px',
                width: {
                xs: 321, // 0
                sm: 451, // 600
                md: 381, // 900
                lg: 552, // 1200
                xl: 1000, // 1536
                },
                padding: '16px',
            }}
            >             
            Item 1
                </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4 }} display="flex" justifyContent="center" alignItems="center">
        <Box
            sx={{
                display: 'flex',
                bgcolor: 'green',
                color: 'white',
                height: '451px',
                width: {
                xs: 321, // 0
                sm: 451, // 600
                md: 381, // 900
                lg: 552, // 1200
                xl: 1000, // 1536
                },
                padding: '16px',
            }}
            >             
            Item 2
                </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4 }} display="flex" justifyContent="center" alignItems="center">
        <Box
            sx={{
                display: 'flex',
                bgcolor: 'green',
                color: 'white',
                height: '451px',
                width: {
                xs: 321, // 0
                sm: 451, // 600
                md: 381, // 900
                lg: 552, // 1200
                xl: 1000, // 1536
                },
                padding: '16px',
            }}
            >             
            Item 3
                </Box>
        </Grid>
        



    </Grid>
  )
}

export default LoginPage