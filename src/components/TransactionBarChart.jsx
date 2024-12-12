import React, { useState, useEffect, useContext } from "react";
import {
    BarChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Bar, Rectangle
} from "recharts";
import { AuthContext, api } from "../context/AuthContext";
import { TextField, Button, Grid, Box, Typography, Paper } from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';


export default function TransactionBarChart() {
    const { authTokens } = useContext(AuthContext);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
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
                const response = await api.post('/transaction-bar-chart/', {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                    },
                });
                const formattedData = response.data.map(item => ({
                    name: item.category,
                    totalAmount: parseFloat(item.total_amount),
                }));
                setFilteredTransactions(formattedData);
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
            const response = await api.post('/transaction-bar-chart/', {
                start_date: startDate,
                end_date: endDate,
            });
            const formattedData = response.data.map(item => ({
                name: item.category,
                totalAmount: parseFloat(item.total_amount),
            }));
            setFilteredTransactions(formattedData);
            setIsLoading(false);
        } catch (err) {
            setError('Failed to fetch data. Please try again');
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
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 3 }}>
                <Paper sx={{ padding: 4, textAlign: 'center' }}>
                    <Typography variant="h6">
                        Showing results for {dayjs(startDate).format('MMM D, YYYY')} - {dayjs(endDate).format('MMM D, YYYY')}
                    </Typography>
                </Paper>
            </Box>
            <ResponsiveContainer width="100%" height={500}>
                <BarChart
                    data={filteredTransactions}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend
                        formatter={(value) => {
                            return "Total";
                        }}
                    />
                    <Bar dataKey="totalAmount" fill="#1DB954" activeBar={<Rectangle  stroke="#1DB954" />}/>
                </BarChart>
            </ResponsiveContainer>

            <Box sx={{ marginTop: 3, padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Filter by Date Range
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Start Date"
                                    value={dayjs(startDate)}
                                    onChange={handleStartDateChange}
                                    renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="End Date"
                                    value={dayjs(endDate)}
                                    onChange={handleEndDateChange}
                                    renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                    <Box sx={{ marginTop: 2, textAlign: "right" }}>
                        <Button variant="contained" color="primary" type="submit">
                            Apply Date Range
                        </Button>
                    </Box>
                </form>
            </Box>
        </div>
    );
}