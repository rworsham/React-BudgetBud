import React, { useState, useEffect, useContext } from "react";
import { AuthContext, api } from "../context/AuthContext";
import { Box, Button, Grid, Paper, TextField, Typography} from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Divider from "@mui/material/Divider";

export default function BudgetTransactionOverview() {
    const { authTokens } = useContext(AuthContext);
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsLoading(true);
                const dataPayload = {
                    start_date: startDate,
                    end_date: endDate,
                };

                const response = await api.post('/budget-transaction-overview/', dataPayload, {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                    },
                });

                setReportData(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [authTokens, startDate, endDate]);

    const handleStartDateChange = (newValue) => {
        setStartDate(newValue ? newValue.format('YYYY-MM-DD') : null);
    };

    const handleEndDateChange = (newValue) => {
        setEndDate(newValue ? newValue.format('YYYY-MM-DD') : null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            setError('Please enter both start and end dates');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/budget-transaction-overview/', {
                start_date: startDate,
                end_date: endDate,
            });
            setReportData(response.data);
            setIsLoading(false);
        } catch (err) {
            setError('Failed to fetch data. Please try again');
            setIsLoading(false);
        }
    };

    const incomeExpenseData = [
        {
            name: "Income",
            value: reportData?.transactions.filter(t => t.transaction_type === "income").reduce((sum, t) => sum + parseFloat(t.amount), 0)
        },
        {
            name: "Expense",
            value: reportData?.transactions.filter(t => t.transaction_type === "expense").reduce((sum, t) => sum + parseFloat(t.amount), 0)
        },
    ];

    const expenseCategoriesData = reportData?.transactions
        .filter(t => t.transaction_type === "expense")
        .reduce((acc, t) => {
            const categoryName = t.category;
            if (acc[categoryName]) {
                acc[categoryName] += parseFloat(t.amount);
            } else {
                acc[categoryName] = parseFloat(t.amount);
            }
            return acc;
        }, {});

    const pieChartData = Object.keys(expenseCategoriesData || {}).map(category => ({
        name: category,
        value: expenseCategoriesData[category],
    }));

    const budgetData = reportData?.budgets_remaining?.map(budget => ({
        name: budget.budget_name,
        starting_budget: parseFloat(budget.starting_budget),
        remaining_budget: parseFloat(budget.remaining_budget),
    }));

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{ height: '100%', width: '75%', padding: '10px' }}>
            <Box sx={{ marginBottom: 1 }}>
                <Paper sx={{ padding: 1, textAlign: 'center' }}>
                    <Typography variant="body2">
                        Showing results for {dayjs(startDate).format('MMM D, YYYY')} - {dayjs(endDate).format('MMM D, YYYY')}
                    </Typography>
                </Paper>
            </Box>
            <Box sx={{ marginBottom: 1, padding: 1, border: '1px solid #ddd', borderRadius: 2 }}>
                <Typography variant="body2" gutterBottom>
                    Filter by Date Range
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Start Date"
                                    value={dayjs(startDate)}
                                    onChange={handleStartDateChange}
                                    renderInput={(params) => <TextField {...params} fullWidth variant="outlined" size="small" />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6} container spacing={1} alignItems="center">
                            <Grid item xs={8}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="End Date"
                                        value={dayjs(endDate)}
                                        onChange={handleEndDateChange}
                                        renderInput={(params) => <TextField {...params} fullWidth variant="outlined" size="small" />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={4} textAlign="right">
                                <Button variant="contained" color="primary" type="submit" size="small">
                                    Apply Date Range
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Box>
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 5}}/>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                    <Box sx={{ marginBottom: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                            Expense Categories Breakdown
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                                     outerRadius={80} fill="#8884d8"
                                     label={({ name, value }) => `${name}: $${value.toFixed(2)}`}>
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.value > 100 ? "#1DB954" : "#387908"} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Box sx={{ marginBottom: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                            Income vs Expense
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={incomeExpenseData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Box sx={{ marginBottom: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                            Budget vs Remaining Budget
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={budgetData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="starting_budget" fill="#8884d8" />
                                <Bar dataKey="remaining_budget" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Grid>
            </Grid>
            <Box sx={{ marginBottom: 3 }}>
                <Paper sx={{
                    padding: 3,
                    textAlign: 'center',
                    backgroundColor: '#333333',
                    borderRadius: 2,
                    boxShadow: 3,
                }}>
                    <Typography variant="h6" sx={{
                        textDecoration: 'underline',
                        fontWeight: 'bold',
                        color: '#1DB954',
                        marginBottom: 1
                    }}>
                        Financial Overview
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 1 }}>
                        {dayjs(startDate).format('MMM D, YYYY')} - {dayjs(endDate).format('MMM D, YYYY')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                        Total Income: ${incomeExpenseData[0]?.value ? incomeExpenseData[0].value.toFixed(2) : '0.00'}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                        Total Expenses: ${incomeExpenseData[1]?.value ? incomeExpenseData[1].value.toFixed(2) : '0.00'}
                    </Typography>
                    <Typography variant="body1" sx={{
                        fontWeight: 'bold',
                        color: '#1DB954',
                        marginBottom: 1
                    }}>
                        Remaining Budget: ${budgetData?.reduce((acc, b) => acc + b.remaining_budget, 0).toFixed(2)}
                    </Typography>
                </Paper>
            </Box>
        </div>
    );
}