import React, { useState, useEffect, useContext } from "react";
import {
    BarChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Bar
} from "recharts";
import { AuthContext, api } from "../context/AuthContext";
import { TextField, Button, Grid, Box, Typography } from "@mui/material";

export default function TransactionBarChart() {
    const { authTokens } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

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
                setTransactions(formattedData);
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
            setTransactions(formattedData);
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
                    <Bar dataKey="totalAmount" fill="#1DB954"/>
                </BarChart>
            </ResponsiveContainer>

            <Box sx={{ marginTop: 3, padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Filter by Date Range
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Start Date"
                                type="date"
                                fullWidth
                                variant="outlined"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="End Date"
                                type="date"
                                fullWidth
                                variant="outlined"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
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