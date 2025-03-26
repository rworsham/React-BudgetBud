import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {useNavigate, useParams} from 'react-router-dom';
import { TextField, Button, FormGroup, FormControl, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Divider from "@mui/material/Divider";
import AlertHandler from "../components/AlertHandler";

const Login = () => {
    const { loginUser } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { token } = useParams();
    const theme = useTheme();

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const loginParams = {
                username,
                password,
                ...(token ? { token } : {}),
            };
            await loginUser(loginParams);
            console.log('Logged in successfully!');
            navigate('/dashboard');
        } catch (err) {
            console.log(err);
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                height: '80vh',
            }}
        >
            <Typography
                variant="h2"
                sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '2.5rem', sm: '4rem' },
                    background: 'linear-gradient(45deg, #1DB954, #006400)',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    display: 'inline-block',
                    position: 'relative',
                    marginBottom: 3,
                    marginTop: 3,
                }}
            >
                BudgetBud
            </Typography>
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
                            fontSize: { xs: '1rem', sm: '2rem' },
                            background: 'linear-gradient(45deg, #1DB954, #006400)',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            display: 'inline-block',
                            position: 'relative',
                            marginBottom: 3,
                        }}
                    >
                        Log In
                    </Typography>
                    <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2, width: '100%'}}/>
                    <FormGroup sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <FormControl>
                            <TextField
                                id="username"
                                label="Username"
                                variant="outlined"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                sx={{ marginBottom: 4, width: '40vh' }}
                            />
                            <TextField
                                id="password"
                                label="Password"
                                variant="outlined"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ marginBottom: 4, width: '40vh' }}
                            />
                            <Button variant="contained" type="submit" sx={{ marginBottom: 2 }}>
                                {isSubmitting ? 'Processing...' : 'Login'}
                            </Button>
                            {error && (
                                <AlertHandler alertMessage={error} />
                            )}
                        </FormControl>
                    </FormGroup>
                    <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2, width: '100%'}}/>
                </Box>
            </form>
            <Typography
                component="a"
                href="/SignUp"
                sx={{ marginTop: 2, textDecoration: 'underline', color: 'inherit', fontSize: '1rem' }}
            >
                Need an account? Sign Up here!
            </Typography>
        </div>
    );
}


export default Login;