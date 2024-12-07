import React, {useState, useEffect, useContext} from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Rectangle,
    ResponsiveContainer,
} from "recharts";
import { AuthContext , api } from "../context/AuthContext";

export default function TransactionPieChart() {
    const { authTokens } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsLoading(true);
                const response = await api.get('/transaction/');
                setTransactions(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [authTokens]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }


    return (
        <ResponsiveContainer width={"100%"} height={300}>
            <BarChart
                data={transactions}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
            </BarChart>
        </ResponsiveContainer>
    );
}