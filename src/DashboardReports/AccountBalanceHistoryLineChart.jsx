import React, { useState, useEffect, useContext } from "react";
import { AuthContext, api } from "../context/AuthContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AccountOverview({x_size, y_size}) {
    const { authTokens } = useContext(AuthContext);
    const [accountData, setAccountData] = useState([]);
    const [accountHistoryData, setAccountHistoryData] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
                setIsLoading(true);
                const response = await api.get('/accounts/', {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                });

                setAccountData(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching account data:', err);
                setError('Failed to fetch account data');
                setIsLoading(false);
            }
        };

        const fetchAccountHistory = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsLoading(true);
                const response = await api.get(`/accounts/overview-report/`, {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                });
                setAccountHistoryData(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching account history:', err);
                setError('Failed to fetch account history');
                setIsLoading(false);
            }
        };

        fetchAccounts();
        fetchAccountHistory();
    }, [authTokens]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

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
            {accountHistoryData && accountHistoryData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {accountData.map((account) => (
                            <Line
                                key={account.id}
                                type="monotone"
                                dataKey={account.name}
                                stroke="#1DB954"
                                activeDot={{ r: 8 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}