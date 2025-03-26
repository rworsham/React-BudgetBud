import React, { useState, useEffect, useContext } from "react";
import { AuthContext, api } from "../context/AuthContext";
import {
    Box, Button, Paper, Typography, Card, CardContent,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList} from 'recharts';
import Divider from "@mui/material/Divider";
import AddBoxIcon from '@mui/icons-material/AddBox';
import {useTheme} from "@mui/material/styles";
import CategoryHistory from "./CategoryHistory";
import CategoryForm from "../forms/CategoryForm";
import AlertHandler from "./AlertHandler";

export default function CategoryOverview({ familyView }) {
    const theme = useTheme();
    const { authTokens } = useContext(AuthContext);
    const [categoryData, setCategoryData] = useState([]);
    const [categoryHistoryData, setCategoryHistoryData] = useState(null);
    const [error, setError] = useState('');
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [successAlertOpen, setSuccessAlertOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const handleOpen = (type) => {
        setModalType(type);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setModalType('');
        setSuccessAlertOpen(false);
        setSelectedCategoryId(null);
    };

    const handleFormSuccess = () => {
        setSuccessAlertOpen(true);
        setTimeout(() => {
            handleClose();
        }, 5000);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsCategoriesLoading(true);
                const response = await api.get('/category/data/', {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                    params: {
                        familyView: familyView
                    },
                });

                setCategoryData(response.data);
                setIsCategoriesLoading(false);
            } catch (err) {
                console.error('Error fetching account data:', err);
                setError('Failed to fetch account data');
                setIsCategoriesLoading(false);
            }
        };

        const fetchCategoryHistory = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsHistoryLoading(true);
                const response = await api.get(`/category/history/line-chart/`, {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                    params : {
                        familyView: familyView
                    },
                });
                setCategoryHistoryData(response.data);
                setIsHistoryLoading(false);
            } catch (err) {
                console.error('Error fetching account history:', err);
                setError('Failed to fetch account history');
                setIsHistoryLoading(false);
            }
        };

        fetchCategories();
        fetchCategoryHistory();
    }, [authTokens, familyView]);

    const chartData = categoryHistoryData ? categoryHistoryData.map((entry) => ({
        date: entry.date,
        ...entry
    })) : [];

    return (
        <div style={{ height: '100%', width: '75%', padding: '10px' }}>
            <Typography variant="h4" textAlign='center' gutterBottom>
                Category Overview
            </Typography>
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2}}/>
            <Box display="flex" justifyContent="center" alignItems="center" sx={{padding: 2}}>
                <Paper
                    elevation={3}
                    sx={{display: 'flex', alignItems: 'center', padding: '10px 20px',cursor: 'pointer', backgroundColor: '#333333'}}
                    onClick={() => handleOpen('addCategory')}
                >
                    <IconButton edge="start" color="inherit">
                        <AddBoxIcon sx={{ color: theme.palette.primary.main }}/>
                    </IconButton>
                    <Typography variant="button" sx={{ ml: 1 , color: theme.palette.primary.main}}>
                        Add Category
                    </Typography>
                </Paper>
            </Box>
            <Dialog open={open && modalType === 'addCategory'} onClose={handleClose}>
                <DialogTitle sx={{ textAlign: 'center' }}>New Category</DialogTitle>
                <DialogContent>
                    <CategoryForm onSuccess={handleFormSuccess}/>
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
                {categoryData.map((category) => (
                    <Grid item xs={12} sm={4} size={4} key={category.id}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" textAlign='center' gutterBottom>
                                    {category.name}
                                </Typography>
                                <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2}}/>
                                <Typography variant="body1" textAlign='center'>
                                    Balance: ${parseFloat(category.balance).toFixed(2)}
                                </Typography>
                                <Grid container spacing={1} sx={{ marginTop: 2, justifyContent: 'center' }}>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => {
                                                setSelectedCategoryId(category.id);
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
                <DialogTitle sx={{ textAlign: 'center' }}>Category History</DialogTitle>
                <DialogContent>
                    {selectedCategoryId && <CategoryHistory category_id={selectedCategoryId} familyView={familyView}/>}
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
            {categoryHistoryData && categoryHistoryData.length > 0 && (
                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h6" textAlign='center' gutterBottom>
                        Category Expense Over Time
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                                formatter={(value) => `$${value}`}
                            />
                            <Legend />
                            {categoryData.map((category) => (
                                <Line
                                    connectNulls
                                    key={category.id}
                                    type="monotone"
                                    dataKey={category.name}
                                    stroke="#1DB954"
                                    activeDot={{ r: 8 }}
                                >
                                    <LabelList dataKey="name" position="top" />
                                </Line>
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            )}
            {(isCategoriesLoading || isHistoryLoading) && (
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