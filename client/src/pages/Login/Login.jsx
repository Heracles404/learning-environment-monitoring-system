import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useNavigate } from "react-router-dom";
import backgroundImage from '../../imgs/ESLIHS_BG.png';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { storeUserDataToLocalStorage } from "../global/LocalStorage";

import { httpAuthenticateUser } from "../../hooks/users.requests";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const userData = await httpAuthenticateUser(username, password); // Call the authenticate function with username and password

            if (userData.ok === false) {
                alert(userData.error || "Invalid credentials"); // Show error message if authentication fails
            } else {
                localStorage.setItem("auth", "true");
                localStorage.setItem("username", username);

                try {
                    await storeUserDataToLocalStorage(username);
                    console.log("User data stored successfully.");
                } catch (error) {
                    console.error("Error storing user data:", error);
                    alert("Failed to load additional user data.");
                }

                navigate(`/dashboard`); // Navigate to the dashboard on successful authentication
            }
        } catch (error) {
            console.error("Authentication error:", error);
            alert("Authentication failed. Please try again later.");
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100vw',
                backgroundImage: `linear-gradient(rgba(0, 135, 0, 0.2), rgba(0, 88, 0, 0.3)), url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                p: 2
            }}
        >
            <Grid 
                container 
                spacing={2} 
                sx={{
                    width: { xs: '100%', sm: '100%', md: '80%' }, 
                    mx: 'auto',
                }}
            >
                {/* Welcome Box */}
                <Grid item xs={12} sm={12} md={4} display="flex" justifyContent="center" alignItems="center">
                    <Box
                        sx={{
                            backgroundImage: 'linear-gradient(to top, #b7ebde, #94e2cd, #4cceac, #2a9d8f, #1F705A)',
                            color: 'white',
                            height: '100%',
                            padding: { xs: '30px', sm: '50px' },
                            borderRadius: '20px',
                            textAlign: 'center',
                            width: '100%'
                        }}
                    >
                        <Typography variant='h5' fontWeight="bold" mb={2}>
                            Welcome to Edilberto S. Legaspi Integrated High School (ESLIHS)
                        </Typography>
                        <img
                            alt="profile-user"
                            width="150px"
                            height="150px"
                            src={`../../assets/ESLIHS_Logo.png`}
                            style={{ cursor: "pointer", borderRadius: "50%" }}
                        />
                    </Box>
                </Grid>

                {/* Login Form */}
                <Grid item xs={12} sm={12} md={4} display="flex" justifyContent="center" alignItems="center">
                    <Box
                        sx={{
                            backgroundImage: 'linear-gradient(to top, #b7ebde, #94e2cd, #4cceac, #4cceac, #2a9d8f, #1F705A)',
                            color: 'white',
                            height: '100%',
                            padding: '16px',
                            borderRadius: '15px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%'
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
                            Login to ESLIHS - Monitoring System
                        </Typography>
                        <form onSubmit={handleLogin} style={{ width: '100%' }}>
                            <Box mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccountCircle sx={{ fontSize: 38, color: 'action.active', mr: 1 }} />
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
                            <Box mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
                                <LockIcon sx={{ fontSize: 38, color: 'action.active', mr: 1 }} />
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
                            <Button type="submit" variant="contained" fullWidth sx={{
                                backgroundColor: '#36D4FC', 
                                height: '50px',  
                                borderRadius: '25px', 
                                fontWeight: 'bold',
                                mt: 2
                            }}>
                                Sign In
                            </Button>
                        </form>
                    </Box>
                </Grid>

                {/* Links Box */}
                <Grid item xs={12} sm={12} md={4} display="flex" justifyContent="center" alignItems="center">
                    <Box
                        sx={{
                            backgroundImage: 'linear-gradient(to top, #b7ebde, #94e2cd, #4cceac, #2a9d8f, #1F705A)',
                            color: 'white',
                            height: '100%',
                            padding: '16px',
                            borderRadius: '15px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%'
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            ESLIHS Links
                        </Typography>
                        <Typography variant="body1" mb={2}>
                            For important announcements regarding Edilberto S. Legaspi Integrated High School and the Department of Education, please access the buttons below.
                        </Typography>
                        <Button
                            variant="contained"
                            href="https://www.facebook.com/DepEdTayoESLIHS305791"
                            target="_blank"
                            rel="noopener"
                            fullWidth
                            sx={{ backgroundColor: '#FF3333', borderRadius: '25px', mb: 2 }}
                        >
                            ESLIHS Facebook PAGE
                        </Button>
                        <Button
                            variant="contained"
                            href="https://www.deped.gov.ph/"
                            target="_blank"
                            rel="noopener"
                            fullWidth
                            sx={{ backgroundColor: '#FF3333', borderRadius: '25px' }}
                        >
                            Dep-ED PAGE
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LoginPage;
