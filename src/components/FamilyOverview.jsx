import React, { useState, useEffect, useContext } from "react";
import { AuthContext, api } from "../context/AuthContext";
import {
    Box, Button, Paper, Typography, Card, CardContent,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import {XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart, CartesianGrid, Bar, LabelList} from 'recharts';
import Divider from "@mui/material/Divider";
import AddBoxIcon from '@mui/icons-material/AddBox';
import {useTheme} from "@mui/material/styles";
import FamilyInviteForm from "../forms/FamilyInviteForm";
import ChartDataError from "./ChartDataError";
import FamilyHistory from "./FamilyHistory";

export default function FamilyOverview() {
    const theme = useTheme();
    const { authTokens } = useContext(AuthContext);
    const [familyData, setFamilyData] = useState([]);
    const [familyTransactionOverviewData, setFamilyTransactionOverviewData] = useState([]);
    const [familyCategoryOverviewData, setFamilyCategoryOverviewData] = useState([]);
    const [error, setError] = useState('');
    const [isFamilyLoading, setIsFamilyLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [successAlertOpen, setSuccessAlertOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleOpen = (type) => {
        setModalType(type);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setModalType('');
        setSuccessAlertOpen(false);
        setSelectedUserId(null);
    };

    const handleFormSuccess = () => {
        setSuccessAlertOpen(true);
        setTimeout(() => {
            handleClose();
        }, 5000);
    };

    useEffect(() => {
        const fetchFamily = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsFamilyLoading(true);
                const response = await api.get('/family/', {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                });

                setFamilyData(response.data);
                setIsFamilyLoading(false);
            } catch (err) {
                console.error('Error fetching account data:', err);
                setError('Failed to fetch account data');
                setIsFamilyLoading(false);
            }
        };

        const fetchFamilyTransactionOverview = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsFamilyLoading(true);
                const response = await api.get('/family/overview/', {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },params: {
                        "Transaction": true
                }
                });

                setFamilyTransactionOverviewData(response.data);
                setIsFamilyLoading(false);
            } catch (err) {
                console.error('Error fetching account data:', err);
                setError('Failed to fetch account data');
                setIsFamilyLoading(false);
            }
        };

        const fetchFamilyCategoryOverview = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsFamilyLoading(true);
                const response = await api.get('/family/overview/', {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },params: {
                        "Category": true
                    }
                });

                setFamilyCategoryOverviewData(response.data);
                setIsFamilyLoading(false);
            } catch (err) {
                console.error('Error fetching account data:', err);
                setError('Failed to fetch account data');
                setIsFamilyLoading(false);
            }
        };

        fetchFamily();
        fetchFamilyTransactionOverview();
        fetchFamilyCategoryOverview();
    }, [authTokens]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{ height: '100%', width: '75%', padding: '10px' }}>
            <Typography variant="h4" textAlign='center' gutterBottom>
                Family Overview
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
                        Invite New Member
                    </Typography>
                </Paper>
            </Box>
            <Dialog open={open && modalType === 'addAccount'} onClose={handleClose}>
                <DialogTitle sx={{ textAlign: 'center' }}>Invite New Member</DialogTitle>
                <DialogContent>
                    <FamilyInviteForm onSuccess={handleFormSuccess}/>
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
                {familyData.map((user) => (
                    <Grid item xs={12} sm={4} size={4} key={user.id}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" textAlign='center' gutterBottom>
                                    {user.username}
                                </Typography>
                                <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2}}/>
                                <Grid container spacing={1} sx={{ marginTop: 2, justifyContent: 'center' }}>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => {
                                                setSelectedUserId(user.id);
                                                handleOpen('viewHistory');
                                            }}
                                        >
                                            View History
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={open && modalType === 'viewHistory'} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle sx={{ textAlign: 'center' }}>Family History</DialogTitle>
                <DialogContent>
                    {selectedUserId && <FamilyHistory user_id={selectedUserId}/>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2}}/>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6} size={6}>
                    <Box sx={{ marginBottom: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                            Contributions Per User
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            {familyTransactionOverviewData && familyTransactionOverviewData.length > 0 ? (
                                <BarChart data={familyTransactionOverviewData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="transaction_count" name={"Contributions"} fill="#8884d8" />
                                </BarChart>
                            ) : (
                                <ChartDataError/>
                            )}
                        </ResponsiveContainer>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} size={6}>
                    <Box sx={{ marginBottom: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                            Category usage per User
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            {familyCategoryOverviewData && familyCategoryOverviewData.length > 0 ? (
                                <BarChart data={familyCategoryOverviewData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis
                                        domain={['auto', (dataMax) => dataMax * 1.1]}
                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="category_count" name="" label="" fill="#8884d8">
                                        <LabelList dataKey="category" position="top" fontSize={14} fill="#1DB954"/>
                                    </Bar>
                                </BarChart>
                            ) : (
                                <ChartDataError />
                            )}
                        </ResponsiveContainer>
                    </Box>
                </Grid>
            </Grid>
            {isFamilyLoading && (
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
        </div>
    );
}