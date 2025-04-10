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
import FamilyCreateForm from "../forms/FamilyCreateForm";
import ChartDataError from "./ChartDataError";
import FamilyHistory from "./FamilyHistory";
import AlertHandler from "./AlertHandler";
import dayjs from "dayjs";
import DateRangeFilterForm from "../forms/DateRangeFilterForm";

export default function FamilyOverview() {
    const theme = useTheme();
    const { authTokens } = useContext(AuthContext);
    const [familyData, setFamilyData] = useState([]);
    const [familyTransactionOverviewData, setFamilyTransactionOverviewData] = useState([]);
    const [familyCategoryOverviewData, setFamilyCategoryOverviewData] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [successAlertOpen, setSuccessAlertOpen] = useState(false);
    const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));
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
        const dataPayload = {
            start_date: startDate,
            end_date: endDate,
        };

        const fetchFamily = async () => {
            try {
                const response = await api.get('/family/');
                setFamilyData(response.data);
            } catch (err) {
                setError('Failed to fetch account data');
            }
        };

        const fetchFamilyTransactionOverview = async () => {
            try {
                const response = await api.post('/family/overview/', dataPayload,{
                    params: {
                        "Transaction": true
                    }
                });

                setFamilyTransactionOverviewData(response.data);
            } catch (err) {
                setError('Failed to fetch account data');
            }
        };

        const fetchFamilyCategoryOverview = async () => {
            try {
                const response = await api.post('/family/overview/', dataPayload, {
                    params: {
                        "Category": true
                    }
                });

                setFamilyCategoryOverviewData(response.data);
            } catch (err) {
                setError('Failed to fetch account data');
            }
        };

        const fetchData = async () => {
            setIsLoading(true);
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            await Promise.all([
                fetchFamily(),
                fetchFamilyTransactionOverview(),
                fetchFamilyCategoryOverview(),
            ]);
            setIsLoading(false);
        };

        if (successAlertOpen) {
            fetchData();
        }

        fetchData();
    }, [authTokens, startDate, endDate, successAlertOpen]);

    const handleStartDateChange = (newValue) => {
        setStartDate(newValue ? newValue.format('YYYY-MM-DD') : null);
    };

    const handleEndDateChange = (newValue) => {
        setEndDate(newValue ? newValue.format('YYYY-MM-DD') : null);
    };

    return (
        <div style={{ height: '100%', width: '75%', padding: '10px' }}>
            <DateRangeFilterForm
                startDate={startDate}
                endDate={endDate}
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
            />
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 5}}/>
            {familyData && familyData.length > 0 ? (
                <>
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
                <Grid display="flex" direction={{ xs: 'column', sm: 'row' }} justifyContent="center" alignItems="center" container spacing={4}>
                    {familyData.map((user) => (
                        <Grid item size={{ xs: 'full', sm: 'grow'}} key={user.id}>
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
                                                View User History
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
                <Grid display="flex" direction={{ xs: 'column', sm: 'row' }} justifyContent="center" alignItems="center" container spacing={4}>
                    <Grid item size={{ xs: 'full', sm: 'grow'}}>
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
                    <Grid item size={{ xs: 'full', sm: 'grow'}}>
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
                </>
            ) : (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{padding: 2}}>
                    <Paper
                        elevation={3}
                        sx={{display: 'flex', alignItems: 'center', padding: '10px 20px',cursor: 'pointer', backgroundColor: '#333333'}}
                        onClick={() => handleOpen('createFamily')}
                    >
                        <IconButton edge="start" color="inherit">
                            <AddBoxIcon sx={{ color: theme.palette.primary.main }}/>
                        </IconButton>
                        <Typography variant="button" sx={{ ml: 1 , color: theme.palette.primary.main}}>
                            Create Family Group
                        </Typography>
                    </Paper>
                </Box>
            )}
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
            <Dialog open={open && modalType === 'createFamily'} onClose={handleClose}>
                <DialogTitle sx={{ textAlign: 'center' }}>Create Family Group</DialogTitle>
                <DialogContent>
                    <FamilyCreateForm onSuccess={handleFormSuccess}/>
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
        </div>
    );
}