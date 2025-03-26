import React, { useState, useEffect, useContext } from "react";
import { AuthContext, api } from "../context/AuthContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartDataError from "../components/ChartDataError";
import {Box, CircularProgress} from "@mui/material";
import AlertHandler from "../components/AlertHandler";

export default function AccountBalanceLineChart({x_size, y_size, familyView}) {
    const { authTokens } = useContext(AuthContext);
    const [dataMax, setDataMax] = useState(1000);
    const [accountData, setAccountData] = useState([]);
    const [accountHistoryData, setAccountHistoryData] = useState(null);
    const [error, setError] = useState('');
    const [isAccountsLoading, setIsAccountsLoading] = useState(false);
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
        const fetchAccounts = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsAccountsLoading(true);
                const response = await api.get('/accounts/', {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                    params : {
                        familyView: familyView,
                    }
                });

                setAccountData(response.data);
                setIsAccountsLoading(false);
            } catch (err) {
                console.error('Error fetching account data:', err);
                setError('Failed to fetch account data');
                setIsAccountsLoading(false);
            }
        };

        const fetchAccountHistory = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsHistoryLoading(true);
                const response = await api.get(`/accounts/overview-report/`, {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                    params: {
                        familyView: familyView,
                    }
                });
                const newDataMax = Math.max(...response.data.map(item => item.Checking));

                setDataMax(newDataMax);
                setAccountHistoryData(response.data);
                setIsHistoryLoading(false);
            } catch (err) {
                console.error('Error fetching account history:', err);
                setError('Failed to fetch account history');
                setIsHistoryLoading(false);
            }
        };

        fetchAccounts();
        fetchAccountHistory();
    }, [authTokens, familyView]);

    const chartData = accountHistoryData ? accountHistoryData.map((entry) => ({
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
            {accountHistoryData && accountHistoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis
                            type="number"
                            domain={[0, Math.ceil(dataMax / 1000) * 1000]}
                            tickCount={10}
                            tickFormatter={(value) => `$${value.toFixed(0)}`}
                        />
                        <Tooltip
                            formatter={(value) => `$${value}`}
                        />
                        <Legend verticalAlign="top" height={36}/>
                        {accountData.map((account) => (
                            <Line
                                connectNulls
                                key={account.id}
                                type="monotone"
                                dataKey={account.name}
                                stroke="#1DB954"
                                activeDot={{ r: 8 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <ChartDataError />
                )}
            {(isAccountsLoading || isHistoryLoading) && (
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