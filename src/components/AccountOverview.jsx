import React, { useState, useEffect, useContext } from "react";
import { AuthContext, api } from "../context/AuthContext";
import {Box, Button, Grid, Paper, Typography, Card, CardContent,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Divider from "@mui/material/Divider";
import AddBoxIcon from '@mui/icons-material/AddBox';
import AccountForm from "../forms/AccountForm";
import {useTheme} from "@mui/material/styles";

export default function AccountOverview() {
    const theme = useTheme();
    const { authTokens } = useContext(AuthContext);
    const [accountData, setAccountData] = useState([]);
    const [accountHistoryData, setAccountHistoryData] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [successAlertOpen, setSuccessAlertOpen] = useState(false);

    const handleOpen = (type) => {
        setModalType(type);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setModalType('');
        setSuccessAlertOpen(false);
    };

    const handleFormSuccess = () => {
        setSuccessAlertOpen(true);
        setTimeout(() => {
            handleClose();
        }, 5000);
    };

    useEffect(() => {
        const fetchAccounts = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsLoading(true);
                const response = await api.get('/accounts/', {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                });

                setAccountData(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching account data:', err);
                setError('Failed to fetch account data');
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, [authTokens]);

    const handleViewHistory = async (accountId) => {
        setIsLoading(true);
        try {
            const response = await api.get(`/accounts/history/`, {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });
            setAccountHistoryData(response.data);
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching account history:', err);
            setError('Failed to fetch account history');
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{ height: '100%', width: '75%', padding: '10px' }}>
            <Typography variant="h4" textAlign='center' gutterBottom>
                Account Overview
            </Typography>
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2}}/>
            <Box display="flex" justifyContent="center" alignItems="center" sx={{padding: 2}}>
                <Paper
                    elevation={3}
                    sx={{display: 'flex', alignItems: 'center', padding: '10px 20px',cursor: 'pointer', backgroundColor: '#333333'}}
                    onClick={() => handleOpen('addAccount')}
                >
                    <IconButton edge="start" color="inherit">
                        <AddBoxIcon sx={{ color: theme.palette.primary.main }}/>
                    </IconButton>
                    <Typography variant="button" sx={{ ml: 1 , color: theme.palette.primary.main}}>
                        Add Account
                    </Typography>
                </Paper>
            </Box>
            <Dialog open={open && modalType === 'addAccount'} onClose={handleClose}>
                <DialogTitle sx={{ textAlign: 'center' }}>New Account</DialogTitle>
                <DialogContent>
                    <AccountForm onSuccess={handleFormSuccess}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={successAlertOpen} onClose={handleClose}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <Typography>Addition Successful!</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
            <Grid container spacing={4}>
                {accountData.map((account) => (
                    <Grid item xs={12} sm={4} key={account.id}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" textAlign='center' gutterBottom>
                                    {account.name}
                                </Typography>
                                <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2}}/>
                                <Typography variant="body1" textAlign='center'>
                                    Balance: ${parseFloat(account.balance).toFixed(2)}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => handleViewHistory(account.id)}
                                    sx={{
                                        marginTop: 2,
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                        display: 'block',
                                        textAlign: 'center',
                                    }}
                                >
                                    View History
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {accountHistoryData && accountHistoryData.length > 0 && (
                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h6" textAlign='center' gutterBottom>
                        Account Balance Over Time
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={accountHistoryData}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="balance"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </div>
    );
}