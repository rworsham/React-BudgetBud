import React, { useState, useEffect, useContext } from "react";
import { AuthContext, api } from "../context/AuthContext";
import dayjs from 'dayjs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import ChartDataError from "../components/ChartDataError";
import {Box, CircularProgress} from "@mui/material";

export default function BudgetRemainingBudgetBarChart({x_size, y_size}) {
    const { authTokens } = useContext(AuthContext);
    const [reportData, setReportData] = useState(null);
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

    const budgetData = reportData?.budgets_remaining?.map(budget => ({
        name: budget.budget_name,
        starting_budget: parseFloat(budget.starting_budget),
        remaining_budget: parseFloat(budget.remaining_budget),
    }));

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
                {budgetData && budgetData.length > 0 ? (
                    <BarChart data={budgetData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36}/>
                        <Bar dataKey="starting_budget" fill="#8884d8" />
                        <Bar dataKey="remaining_budget" fill="#82ca9d" />
                    </BarChart>
                ) : (
                    <ChartDataError />
                )}
            </ResponsiveContainer>
            {isLoading && (
                <Box
                    sx={{
                        position: 'fixed',
                    }}
                >
                    <CircularProgress color="success" />
                </Box>
            )}
        </div>
    );
}