import React, { useState, useEffect, useContext } from "react";
import {api, AuthContext} from "../context/AuthContext";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import {Avatar, Box, Card, CardContent, CardHeader, CircularProgress, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AlertHandler from "./AlertHandler";

export default function Profile() {
    const { authTokens } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const [userStats, setUserStats] = useState({});

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsLoading(true);

                const userResponse = await api.get('/user/', {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                });
                setUserDetails(userResponse.data);

                const statsResponse = await api.get('/profile/stats/', {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                });
                setUserStats(statsResponse.data);

                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        };

        fetchUserDetails();
    }, [authTokens]);

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
                                        Transaction Count
                                    </Typography>
                                    <Typography variant="h6">
                                        {userStats.total_transactions}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} textAlign="center">
                                    <Typography variant="body1">
                                        Date Joined
                                    </Typography>
                                    <Typography variant="h6">
                                        {userStats.joined_date}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} textAlign="center">
                                    <Typography variant="body1">
                                        Savings Goals Met
                                    </Typography>
                                    <Typography variant="h6">
                                        {userStats.savings_goals_met}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
                <Divider sx={{ marginY: 3 }} />
                <Box>
                    <Card sx={{ width: '100%', boxShadow: 3 }}>
                        <CardHeader sx={{ textAlign: 'center' }}/>
                        <CardContent>
                            <Grid container spacing={2} justifyContent="space-between">
                                <Grid item xs={4} textAlign="center">
                                    <Typography variant="body1">
                                        Income Total
                                    </Typography>
                                    <Typography variant="h6">
                                        ${userStats.net_income}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} textAlign="center">
                                    <Typography variant="body1">
                                        Expense Total
                                    </Typography>
                                    <Typography variant="h6">
                                        ${userStats.net_expense}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} textAlign="center">
                                    <Typography variant="body1">
                                        Lifetime Balance
                                    </Typography>
                                    <Typography variant="h6">
                                        ${userStats.net_balance}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
                {isLoading && (
                    <Box
                        sx={{
                            position: 'fixed',
                            top: 100,
                            right: 16,
                            zIndex: 1300,
                        }}
                    >
                        <CircularProgress color="success" />
                    </Box>
                )}
                {error && (
                    <AlertHandler alertMessage={error} />
                )}
            </Paper>
        </div>
    );
}