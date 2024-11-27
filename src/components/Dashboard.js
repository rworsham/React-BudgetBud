import React from 'react';
import BudgetOverview from './BudgetOverview';
import AddButton from "./AddButton";

function Dashboard({ authTokens }) {
    return (
        <div style={{ padding: '20px' }}>
            <BudgetOverview authTokens={authTokens} />
            <AddButton authTokens={authTokens} />
        </div>
    );
}

export default Dashboard;