import React, {useState, useEffect, useContext} from "react";
import { PieChart, Pie, ResponsiveContainer } from "recharts";
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

    const transactionsArray = transactions.map(transaction => ({
        name: transaction.description,
        value: Number(transaction.amount),
    }));

    const budgetsArray = budgets.map(budget => ({
        name: budget.name,
        value: Number(budget.total_amount),
    }));
    console.log(transactionsArray);
    console.log(budgetsArray);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart width="100%" height="100%">
                <Pie
                    data={transactionsArray}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius="45%"
                    fill="#8884d8"
                    label
                />
                <Pie
                    data={budgetsArray}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="70%"
                    fill="#82ca9d"
                    label
                />
            </PieChart>
        </ResponsiveContainer>
    );
}