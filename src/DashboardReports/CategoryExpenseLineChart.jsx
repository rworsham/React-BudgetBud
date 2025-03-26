import React, { useState, useEffect, useContext } from "react";
import { AuthContext, api } from "../context/AuthContext";
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList} from 'recharts';
import ChartDataError from "../components/ChartDataError";
import {Box, CircularProgress} from "@mui/material";
import AlertHandler from "../components/AlertHandler";

export default function CategoryExpenseLineChart({x_size, y_size, familyView}) {
    const { authTokens } = useContext(AuthContext);
    const [categoryData, setCategoryData] = useState([]);
    const [categoryHistoryData, setCategoryHistoryData] = useState(null);
    const [error, setError] = useState('');
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
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
        <div
            style={{
                width: `${width}px`,
                height: `${height}px`,
                position: "relative",
                display: 'flex',
                justifyContent: "center",
            }}
        >
            {categoryHistoryData && categoryHistoryData.length >0 ? (
                <ResponsiveContainer width="100%" height="100%">
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
            ) : (
                <ChartDataError />
            )}
            {(isCategoriesLoading || isHistoryLoading) && (
                <Box
                    sx={{
                        position: 'fixed',
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