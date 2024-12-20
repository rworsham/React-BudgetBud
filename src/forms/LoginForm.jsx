import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, FormGroup, FormControl, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Login = () => {
    const { loginUser } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            await loginUser(username, password);
            console.log('Logged in successfully!');
            navigate('/dashboard');
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                height: '80vh',
            }}
        >
            <form onSubmit={handleLogin}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 'auto',
                        width: '50vh',
                        height: 'auto',
                        padding: 2,
                        backgroundColor: (theme) => theme.palette.background.paper,
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '4rem',
                            background: 'linear-gradient(45deg, #1DB954, #006400)',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            display: 'inline-block',
                            position: 'relative',
                            marginBottom: 3,
                        }}
                    >
                        BudgetBud
                    </Typography>

                    <FormGroup sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <FormControl>
                            <TextField
                                id="username"
                                label="Username"
                                variant="outlined"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                sx={{ marginBottom: 3, width: '40vh' }}
                            />
                            <TextField
                                id="password"
                                label="Password"
                                variant="outlined"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ marginBottom: 3, width: '40vh' }}
                            />
                            <Button variant="contained" type="submit" sx={{ marginBottom: 2 }}>
                                Login
                            </Button>
                            {error && (
                                <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>
                                    {error}
                                </Typography>
                            )}
                        </FormControl>
                    </FormGroup>
                </Box>
            </form>
        </div>
    );
}


export default Login;