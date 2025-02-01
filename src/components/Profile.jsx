import React, { useState, useEffect, useContext } from "react";
import {api, AuthContext} from "../context/AuthContext";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import {Avatar, Box, Card, CardContent, CardHeader, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Profile() {
    const { authTokens } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsLoading(true);
                const response = await api.get('/user/', {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                });
                setUserDetails(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        };

        fetchUserDetails();
    }, [authTokens]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{ height: 'auto', width: 'auto', padding: '10px'}}>
            <Divider sx={{ borderColor: '#1DB954', marginTop: 2, marginBottom: 5 }} />
            <Paper sx={{ height: 'auto', width: '100%', position: 'relative', padding: 3 }}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                        sx={{ width: 80, height: 80 }}
                        alt="User Profile Picture"
                        src="https://via.placeholder.com/80"
                    />
                    <Box>
                        <Typography variant="h5" component="h2">
                            {userDetails.username}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {userDetails.email}
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ marginY: 3 }} />
                <Box>
                    <Card sx={{ width: '100%', boxShadow: 3 }}>
                        <CardHeader title="User Stats" sx={{ textAlign: 'center' }}/>
                        <CardContent>
                            <Grid container spacing={2} justifyContent="space-between">
                                <Grid item xs={4} textAlign="center">
                                    <Typography variant="body1">
                                        Transactions Submitted
                                    </Typography>
                                    <Typography variant="h6">
                                        3
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} textAlign="center">
                                    <Typography variant="body1">
                                        Savings Goals Met
                                    </Typography>
                                    <Typography variant="h6">
                                        4
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} textAlign="center">
                                    <Typography variant="body1">
                                        Lifetime Balance
                                    </Typography>
                                    <Typography variant="h6">
                                        $1,000,000
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
                <Divider sx={{ marginY: 3 }} />
                <Box>
                    <Card sx={{ width: '100%', boxShadow: 3 }}>
                        <CardHeader title="User Stats" sx={{ textAlign: 'center' }}/>
                        <CardContent>
                            <Grid container spacing={2} justifyContent="space-between">
                                <Grid item xs={4} textAlign="center">
                                    <Typography variant="body1">
                                        Transactions Submitted
                                    </Typography>
                                    <Typography variant="h6">
                                        3
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} textAlign="center">
                                    <Typography variant="body1">
                                        Savings Goals Met
                                    </Typography>
                                    <Typography variant="h6">
                                        4
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} textAlign="center">
                                    <Typography variant="body1">
                                        Lifetime Balance
                                    </Typography>
                                    <Typography variant="h6">
                                        $1,000,000
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            </Paper>
        </div>
    );
}