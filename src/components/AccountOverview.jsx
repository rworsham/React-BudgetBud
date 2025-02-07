import React, { useState, useEffect, useContext } from "react";
import { AuthContext, api } from "../context/AuthContext";
import {Box, Button, Paper, Typography, Card, CardContent,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Divider from "@mui/material/Divider";
import AddBoxIcon from '@mui/icons-material/AddBox';
import AccountForm from "../forms/AccountForm";
import {useTheme} from "@mui/material/styles";
import AccountHistory from "./AccountHistory";
import SavingsGoalForm from "../forms/SavingsGoalForm";

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
    const [selectedAccountId, setSelectedAccountId] = useState(null);

    const handleOpen = (type) => {
        setModalType(type);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setModalType('');
        setSuccessAlertOpen(false);
        setSelectedAccountId(null);
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

        const fetchAccountHistory = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsLoading(true);
                const response = await api.get(`/accounts/overview-report/`, {
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

        fetchAccounts();
        fetchAccountHistory();
    }, [authTokens]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const chartData = accountHistoryData ? accountHistoryData.map((entry) => ({
        date: entry.date,
        ...entry
    })) : [];

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
                    <Grid item xs={12} sm={4} size={4} key={account.id}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" textAlign='center' gutterBottom>
                                    {account.name}
                                </Typography>
                                <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2}}/>
                                <Typography variant="body1" textAlign='center'>
                                    Balance: ${parseFloat(account.balance).toFixed(2)}
                                </Typography>
                                <Grid container spacing={1} sx={{ marginTop: 2, justifyContent: 'center' }}>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => {
                                                setSelectedAccountId(account.id);
                                                handleOpen('viewHistory');
                                            }}
                                        >
                                            View History
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            onClick={() => {
                                                setSelectedAccountId(account.id);
                                                handleOpen('setSavingsGoal');
                                            }}
                                        >
                                            Set Saving Goal
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={open && modalType === 'viewHistory'} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle sx={{ textAlign: 'center' }}>Account History</DialogTitle>
                <DialogContent>
                    {selectedAccountId && <AccountHistory account_id={selectedAccountId} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={open && modalType === 'setSavingsGoal'} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle sx={{ textAlign: 'center' }}>Set Savings Goal</DialogTitle>
                <DialogContent>
                    {selectedAccountId && <SavingsGoalForm account_id={selectedAccountId} onSuccess={handleFormSuccess}/>}
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
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2}}/>
            {accountHistoryData && accountHistoryData.length > 0 && (
                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h6" textAlign='center' gutterBottom>
                        Account Balance Over Time
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {accountData.map((account) => (
                                <Line
                                    key={account.id}
                                    type="monotone"
                                    dataKey={account.name}
                                    stroke="#1DB954"
                                    activeDot={{ r: 8 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </div>
    );
}