import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

const FeatureCards = () => {
    return (
        <Box sx={{ width: '80%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', marginBottom: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row-reverse' } }}>
                <Card sx={{ width: '100%', display: 'flex', flexDirection: 'row', boxSizing: 'border-box' }}>
                    <CardContent sx={{ width: '30%' }}>
                        <Typography variant="h6" component="div">
                            Family Group or Personal Budget
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                            Create a family group to link different members, or use the app individually to manage your finances. Track shared expenses, set budgets, and stay organized—whether you’re managing a household budget or just your personal finances.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', marginTop: 1 }}>
                            Our system helps individuals and families collaborate, ensuring no one is left out of the budgeting process while allowing everyone to keep track of their finances in a personalized way.
                        </Typography>
                    </CardContent>
                    <CardMedia
                        component="img"
                        image={`${process.env.PUBLIC_URL}/FamilyDisplay.jpg`}
                        alt="Family Group"
                        sx={{
                            objectFit: 'cover',
                            width: '70%',
                            height: { xs: 'auto', md: '500px' },
                        }}
                    />
                </Card>
            </Box>

            <Box sx={{ width: '100%', marginBottom: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                <Card sx={{ width: '100%', display: 'flex', flexDirection: 'row', boxSizing: 'border-box' }}>
                    <CardMedia
                        component="img"
                        image={`${process.env.PUBLIC_URL}/BudgetDisplay.jpg`}
                        alt="Budget Group"
                        sx={{
                            objectFit: 'cover',
                            width: '70%',
                            height: { xs: 'auto', md: '500px' },
                        }}
                    />
                    <CardContent sx={{ width: '30%' }}>
                        <Typography variant="h6" component="div">
                            Budgeting Made Easy
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                            Set specific budget categories for different areas like groceries, entertainment, and transportation. Whether you're budgeting for a family or individually, our app makes it easy to stay on track and manage your spending.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', marginTop: 1 }}>
                            From individual users to large family groups, the app offers the flexibility to adjust your budget to fit your needs, ensuring you stay within your financial limits and meet your savings goals.
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            <Box sx={{ width: '100%', marginBottom: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row-reverse' } }}>
                <Card sx={{ width: '100%', display: 'flex', flexDirection: 'row', boxSizing: 'border-box' }}>
                    <CardContent sx={{ width: '30%' }}>
                        <Typography variant="h6" component="div">
                            Transactions at a Glance
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                            Our app makes tracking your income and expenses seamless. Record your transactions, categorize them, and see exactly where your money is going. Whether you're managing personal finances or a family budget, tracking your spending has never been easier.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', marginTop: 1 }}>
                            With automatic tracking for recurring payments like bills or subscriptions, you’ll always know when payments are due and never miss a transaction, keeping your budget up-to-date with minimal effort.
                        </Typography>
                    </CardContent>
                    <CardMedia
                        component="img"
                        image={`${process.env.PUBLIC_URL}/TransactionDisplay.jpg`}
                        alt="Transaction Group"
                        sx={{
                            objectFit: 'cover',
                            width: '70%',
                            height: { xs: 'auto', md: '500px' },
                        }}
                    />
                </Card>
            </Box>
        </Box>
    );
};

export default FeatureCards;