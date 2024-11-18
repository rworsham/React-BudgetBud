import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { TextField, Button, FormGroup, FormControl, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/token/', {
                username,
                password,
            });

            Cookies.set('access_token', response.data.access, { expires: 7, secure: true, sameSite: 'None' });
            Cookies.set('refresh_token', response.data.access, { expires: 7, secure: true, sameSite: 'None' });
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
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: 'auto',
                            width: '50vh',
                            height: '50vh',
                            flexShrink: 0,
                            padding: 2,
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 2,
                            boxShadow: 3,
                        }}
                    >
                        <FormGroup sx={{ display: 'flex', flexDirection: 'column' }}>
                            <FormControl>
                                <TextField
                                    id="outlined-basic"
                                    label="Username"
                                    variant="outlined"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    sx={{ marginBottom: 3 , width: '40vh' }}
                                />
                                <TextField
                                    id="outlined-basic"
                                    label="Password"
                                    variant="outlined"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    sx={{ marginBottom: 3 , width: '40vh'}}
                                />
                                <Button variant="contained" type="submit">Login</Button>
                                {error && <p>{error}</p>}
                            </FormControl>
                        </FormGroup>
                    </Box>
                </form>
            </div>
        );
    }

export default Login;