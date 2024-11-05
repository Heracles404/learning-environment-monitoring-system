import React from 'react';
import { Box, Typography, TextField, Button, Link } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from '../../imgs/ESLIHS_BG.png';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';

import {httpAuthenticateUser} from "../../hooks/users.requests";

    const LoginPage = () => {
        const [username, setUsername] = useState("");
        const [password, setPassword] = useState("");
        const [users, setUsers] = useState([]); // State to hold user data
        const navigate = useNavigate();


        const handleLogin = async (e) => {
            e.preventDefault();

            try {
                const userData = await httpAuthenticateUser (username, password); // Call the authenticate function with username and password

                if (userData.ok === false) {
                    alert(userData.error || "Invalid credentials"); // Show error message if authentication fails
                } else {
                    localStorage.setItem("auth", "true");
                    navigate("/dashboard"); // Navigate to the dashboard on successful authentication
                }
            } catch (error) {
                console.error("Authentication error:", error);
                alert("Authentication failed. Please try again later.");
            }
        };

    return (
        <Box
            sx={{
                // height: '100%',
                backgroundImage: `linear-gradient(rgba(0, 135, 0, 0.2), rgba(0, 88, 0, 0.3)), url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Grid container m={4} rowSpacing={3} columnSpacing={{ xs: 1, sm: 1, md: 3 }}>
                <Grid size={{ xs: 12, sm: 12, md: 4 }} display="flex" justifyContent="center" alignItems="center">
                    <Box
                        sx={{
                            // display: 'flex',
                            backgroundImage: 'linear-gradient(to top, #b7ebde, #94e2cd, #4cceac, #2a9d8f, #1F705A)',
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
                            borderRadius: '15px', // Added border radius
                        }}
                    >
                        <Box ml={3.5} mt={1}>
                            <Typography variant='h3' style={{ fontWeight: 'bold' }}>Welcome to Edilberto S. Legaspi Integrated High School (ESLIHS)</Typography> <br/>      

                        </Box>
                        <Box ml={5}>
                        <img
                            margin-left="5px"
                            alt="profile-user"
                            width="300px"
                            height="300px"
                            src={`../../assets/ESLIHS_Logo.png`}
                            style={{ cursor: "pointer", borderRadius: "50%" }}
                            />
                        </Box>
                        

                        
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4 }} display="flex" justifyContent="center" alignItems="center">
                    <Box
                        sx={{
                            // display: 'flex',
                            backgroundImage: 'linear-gradient(to top, #b7ebde, #94e2cd, #4cceac, #4cceac, #2a9d8f, #1F705A)',
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
                            borderRadius: '15px', // Added border radius
                        }}
                    >             
                        <Box>
                            <Box ml={5} mt={7}>
                            <h2>Login to ESLIHS - Monitoring System</h2>

                            </Box>
                            <form onSubmit={handleLogin}>
                                <Box mb={2} mt={5} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <AccountCircle sx={{ fontSize: 38, color: 'action.active', mr: 1, my: 0.5 }} />

                                    <TextField
                                        id="username"
                                        label="Username"
                                        variant="filled"
                                        value={username}
                                        fullWidth
                                        onChange={(e) => setUsername(e.target.value)}
                                        InputProps={{
                                            style: { color: 'white' }
                                        }}
                                        InputLabelProps={{
                                            style: { color: 'white' }
                                        }}
                                    />
                                </Box>
                                <Box mb={2} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <LockIcon sx={{ fontSize: 38, color: 'action.active', mr: 1, my: 0.5 }} />
                                    <TextField
                                        id="password"
                                        label="Password"
                                        type="password"
                                        variant="filled"
                                        value={password}
                                        fullWidth
                                        onChange={(e) => setPassword(e.target.value)}
                                        InputProps={{
                                            style: { color: 'white' }
                                        }}
                                        InputLabelProps={{
                                            style: { color: 'white' }
                                        }}
                                    />
                                </Box>
                                <Box mt ={5}>
                                <Button type="submit" variant="contained" fullWidth style={{ backgroundColor: '#36D4FC', height: '50px',  borderRadius: '15px', fontWeight: 'bold' }}>
                                    Sign In
                                </Button>
                                </Box>
                            </form>
                        </Box>
                        
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4 }} display="flex" justifyContent="center" alignItems="center">
                    <Box
                        sx={{
                            // display: 'flex',
                            backgroundImage: 'linear-gradient(to top, #b7ebde, #94e2cd, #4cceac, #2a9d8f, #1F705A)',
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
                            borderRadius: '15px', // Added border radius
                        }}
                    >             
                        <Box>
                            <Box ml={19}>
                            <Typography variant="h4" style={{ fontWeight: 'bold' }} gutterBottom>
                                ESLIHS Links
                            </Typography>
                            </Box>
                            
                            <Typography variant="h5" gutterBottom>
                                For important announcements regarding Edilberto S. Legaspi Integrated High School and the Department of Education, please access the buttons below.
                            </Typography>
                            <Box mb={2}>
                                <Button
                                variant="contained"
                                color="primary"
                                href="https://www.facebook.com/DepEdTayoESLIHS305791"
                                target="_blank"
                                rel="noopener"
                                fullWidth
                                style={{ backgroundColor: '#FF3333', borderRadius: '15px' }}
                                >
                                ESLIHS Facebook PAGE
                                </Button>

                                <img
                                alt="DepED Logo"
                                width="400px"
                                height="auto"
                                src={`../../assets/DepED_Logo.png`}
                                style={{ cursor: "pointer", marginLeft: "5px" }}
                                />
                            </Box>
                            <Box mb={2}>
                                
                                <Button
                                variant="contained"
                                color="primary"
                                href="https://www.deped.gov.ph/"
                                target="_blank"
                                rel="noopener"
                                fullWidth
                                style={{ backgroundColor: '#FF3333', borderRadius: '15px' }}
                                >
                                Dep-ED PAGE
                                </Button>
                            </Box>
                        </Box>



                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default LoginPage;