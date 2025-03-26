import React, { useState, useEffect, useContext } from "react";
import { AuthContext, api } from "../context/AuthContext";
import dayjs from 'dayjs';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList} from 'recharts';
import ChartDataError from "../components/ChartDataError";
import {Box, CircularProgress} from "@mui/material";
import AlertHandler from "../components/AlertHandler";

export default function CategoryUsagePerUserBarChart({x_size, y_size, familyView}) {
    const { authTokens } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [familyCategoryOverviewData, setFamilyCategoryOverviewData] = useState([]);
    const [isFamilyLoading, setIsFamilyLoading] = useState(false);
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
        const fetchFamilyCategoryOverview = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsFamilyLoading(true);
                const response = await api.get('/family/overview/', {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },params: {
                        "Category": true
                    }
                });

                setFamilyCategoryOverviewData(response.data);
                setIsFamilyLoading(false);
            } catch (err) {
                console.error('Error fetching account data:', err);
                setError('Failed to fetch account data');
                setIsFamilyLoading(false);
            }
        };

        fetchFamilyCategoryOverview();
    }, [authTokens]);

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
            {isFamilyLoading && (
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