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
import dayjs from 'dayjs';
import ChartDataError from "../components/ChartDataError";
import {Box, CircularProgress} from "@mui/material";


export default function ExpenseCategoriesBarChart({x_size, y_size, familyView}) {
    const { authTokens } = useContext(AuthContext);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const calculateDimensions = () => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const availableWidth = screenWidth * 0.70;
            const xPercentage = parseInt(x_size);
            const width = (availableWidth * xPercentage) / 100;
            const yPercentage = parseInt(y_size);
            const height = (screenHeight * yPercentage) / 100;

            setWidth(width);
            setHeight(height);
        };

        calculateDimensions();

        window.addEventListener('resize', calculateDimensions);
        return () => window.removeEventListener('resize', calculateDimensions);
    }, [x_size, y_size]);

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

                const response = await api.post('/transaction-bar-chart/', dataPayload,{
                    params: {
                        familyView: familyView
                    },
                });
                const formattedData = response.data.map(item => ({
                    name: item.category,
                    totalAmount: item.total_amount,
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
    }, [authTokens, startDate, endDate, familyView]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div
            style={{
                width: `${width}px`,
                height: `${height}px`,
                position: "relative",
                display: 'flex',
                justifyContent: "center",
            }}
        >
            <ResponsiveContainer width="100%" height="100%">
                {filteredTransactions && filteredTransactions.length > 0 ? (
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
                        <Tooltip
                            formatter={(value) => `$${value}`}
                        />
                        <Legend dataKey="name" verticalAlign="top" height={36}/>
                        <Bar dataKey="totalAmount" fill="#1DB954" activeBar={<Rectangle  stroke="#1DB954" />}/>
                    </BarChart>
                ) : (
                    <ChartDataError />
                )}
            </ResponsiveContainer>
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