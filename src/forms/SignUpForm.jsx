import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, FormGroup, FormControl, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { api } from '../context/AuthContext';
import Divider from "@mui/material/Divider";

const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();

    const validateForm = () => {
        if (!email || !username || !firstName || !lastName || !password || !confirmPassword) {
            setError('Please fill in all required fields');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await api.post(
                '/user/create/',
                {
                    email,
                    username,
                    first_name:firstName,
                    last_name:lastName,
                    password,
                },
            );

            console.log('User account created:', response.data);
            navigate('/login')
        } catch (err) {
            console.error('Error during sign-up:', err);
            setError('Failed to create new account. Please try again.');
        } finally {
            setIsLoading(false);
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
                height: '100vh',
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
            <form onSubmit={handleSubmit}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 'auto',
                        width: '50vh',
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
                            marginBottom: { xs: '0', sm: '2'},
                        }}
                    >
                        Sign Up
                    </Typography>
                    <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2, width: '100%'}}/>
                    <FormGroup sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <FormControl sx={{marginBottom: 2}}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                sx={{
                                    height: { xs: '40px', sm: '50px' },
                                    width: { xs: '100%', sm: '40vh' }
                                }}
                            />
                        </FormControl>
                        <FormControl sx={{marginBottom: 2}}>
                            <TextField
                                label="Username"
                                variant="outlined"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                sx={{
                                    height: { xs: '40px', sm: '50px' },
                                    width: { xs: '100%', sm: '40vh' }
                                }}
                            />
                        </FormControl>
                        <FormControl sx={{marginBottom: 2}}>
                            <TextField
                                label="First Name"
                                variant="outlined"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                sx={{
                                    height: { xs: '40px', sm: '50px' },
                                    width: { xs: '100%', sm: '40vh' }
                                }}
                            />
                        </FormControl>
                        <FormControl sx={{marginBottom: 2}}>
                            <TextField
                                label="Last Name"
                                variant="outlined"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                sx={{
                                    height: { xs: '40px', sm: '50px' },
                                    width: { xs: '100%', sm: '40vh' }
                                }}
                            />
                        </FormControl>
                        <FormControl sx={{marginBottom: 2}}>
                            <TextField
                                label="Password"
                                variant="outlined"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                sx={{
                                    height: { xs: '40px', sm: '50px' },
                                    width: { xs: '100%', sm: '40vh' }
                                }}
                            />
                        </FormControl>
                        <FormControl sx={{marginBottom: 2}}>
                            <TextField
                                label="Confirm Password"
                                variant="outlined"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                sx={{
                                    height: { xs: '40px', sm: '50px' },
                                    width: { xs: '100%', sm: '40vh' }
                                }}
                            />
                        </FormControl>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={isLoading}
                            fullWidth
                        >
                            {isLoading ? 'Submitting...' : 'Sign Up'}
                        </Button>
                        {error && (
                            <Typography color="error" variant="body2" sx={{marginTop: 2}}>
                                {error}
                            </Typography>
                        )}
                    </FormGroup>
                    <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2, width: '100%'}}/>
                </Box>
            </form>
            <Typography
                component="a"
                href="/login"
                sx={{ marginTop: 2, textDecoration: 'underline', color: 'inherit', fontSize: '1rem'}}
            >
                Already have an account? Sign in here!
            </Typography>
        </div>
    );
};

export default SignUpForm;