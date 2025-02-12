import React, {useState, useEffect, useContext} from "react";
import { PieChart, Pie, ResponsiveContainer, Legend } from "recharts";
import { AuthContext , api } from "../context/AuthContext";
import dayjs from "dayjs";
import ChartDataError from "../components/ChartDataError";
import {Box, CircularProgress} from "@mui/material";

export default function TransactionPieChart({ x_size, y_size }) {
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

    if (isLoading) {
        return <div>Loading...</div>;
    }

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
                    <PieChart>
                        <Legend verticalAlign="top" height={36}/>
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