import React, {useState, useEffect, useContext} from "react";
import { PieChart, Pie } from "recharts";
import { AuthContext , api } from "../context/AuthContext";

export default function TransactionPieChart() {
    const { authTokens } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchChoices = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                const [Transactions, Budgets] = await Promise.all([
                    api.get('/transactions/'),
                    api.get('/budget/')
                ]);

                setTransactions(Transactions.data);
                setBudgets(Budgets.data);

                setIsLoading(false);
            } catch (err) {

                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        };

        fetchChoices();
    }, [authTokens]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <PieChart width={400} height={400}>
            <Pie
                data={transactions}
                dataKey="value"
                cx={200}
                cy={200}
                outerRadius={60}
                fill="#8884d8"
            />
            <Pie
                data={budgets}
                dataKey="value"
                cx={200}
                cy={200}
                innerRadius={70}
                outerRadius={90}
                fill="#82ca9d"
                label
            />
        </PieChart>
    );
}