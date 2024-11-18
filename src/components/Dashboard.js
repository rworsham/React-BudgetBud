import React from 'react';
import BudgetOverview from './BudgetOverview';
import TransactionForm  from "./TransactionForm";
function Dashboard() {
    return (
        <div style={{ padding: '20px' }}>
            <BudgetOverview />
            <TransactionForm />
        </div>
    );
}

export default Dashboard;