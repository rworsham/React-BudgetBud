import React, {useState, useEffect, useContext} from "react";
import { PieChart, Pie, ResponsiveContainer } from "recharts";
import { AuthContext , api } from "../context/AuthContext";
import dayjs from "dayjs";
import {Box, Button, CircularProgress, Paper, TextField, Typography} from "@mui/material";
import Grid from '@mui/material/Grid2';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

export default function TransactionPieChart() {
    const { authTokens } = useContext(AuthContext);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));

    useEffect(() => {
        const fetchChoices = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsLoading(true);
                const response = await api.post('/transaction-pie-chart/', {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                    },
                });
                setFilteredTransactions(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        };

        fetchChoices();
    }, [authTokens, startDate, endDate]);

    if (error) {
        return <div>{error}</div>;
    }

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
            const response = await api.post('/transaction-pie-chart/', {
                start_date: startDate,
                end_date: endDate,
            });
            setFilteredTransactions(response.data);
            setIsLoading(false);
        } catch (err) {
            setError('Failed to fetch data. Please try again');
            setIsLoading(false);
        }
    };

        return (
            <div>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 3 }}>
                    <Paper sx={{ padding: 4, textAlign: 'center' }}>
                        <Typography variant="h6">
                            Showing results for {dayjs(startDate).format('MMM D, YYYY')} - {dayjs(endDate).format('MMM D, YYYY')}
                        </Typography>
                    </Paper>
                </Box>
                <ResponsiveContainer width="100%" height={600}>
                    {filteredTransactions && filteredTransactions.length > 0 ? (
                        <PieChart>
                            <Pie
                                dataKey="value"
                                data={filteredTransactions}
                                startAngle={180}
                                endAngle={0}
                                cx="50%"
                                cy="50%"
                                outerRadius={'80%'}
                                fill="#1DB954"
                                label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                            />
                        </PieChart>
                    ) : (
                        <div>No data available</div>
                    )}
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
            </div>
        );
    }