import React from 'react';
import BudgetOverview from './BudgetOverview';
import AddButton from "./AddButton";

function Dashboard() {
    return (
        <div style={{ padding: '20px' }}>
            <BudgetOverview />
            <AddButton />
        </div>
    );
}

export default Dashboard;