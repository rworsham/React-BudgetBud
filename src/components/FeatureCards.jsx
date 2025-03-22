import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

const FeatureCards = () => {
    return (
        <Box sx={{ width: '90%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', marginBottom: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row-reverse' } }}>
                <Card sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, boxSizing: 'border-box' }}>
                    <CardMedia
                        component="img"
                        image={`${process.env.PUBLIC_URL}/FamilyDisplay.jpg`}
                        alt="Family Group"
                        sx={{
                            objectFit: 'cover',
                            width: { xs: '100%', md: '70%' },
                            height: { xs: '200px', md: '500px' },
                        }}
                    />
                    <CardContent sx={{ width: { xs: '100%', md: '30%' }, padding: { xs: '16px', md: '24px' } }}>
                        <Typography variant="h6" component="div" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                            Family Group or Personal Budget
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, marginTop: 1 }}>
                            Create a family group to link different members, or use the app individually to manage your finances. Track shared expenses, set budgets, and stay organized—whether you’re managing a household budget or just your personal finances.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, marginTop: 1 }}>
                            Our system helps individuals and families collaborate, ensuring no one is left out of the budgeting process while allowing everyone to keep track of their finances in a personalized way.
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            <Box sx={{ width: '100%', marginBottom: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                <Card sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, boxSizing: 'border-box' }}>
                    <CardMedia
                        component="img"
                        image={`${process.env.PUBLIC_URL}/BudgetDisplay.jpg`}
                        alt="Budget Group"
                        sx={{
                            objectFit: 'cover',
                            width: { xs: '100%', md: '70%' },
                            height: { xs: '200px', md: '500px' },
                        }}
                    />
                    <CardContent sx={{ width: { xs: '100%', md: '30%' }, padding: { xs: '16px', md: '24px' } }}>
                        <Typography variant="h6" component="div" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                            Budgeting Made Easy
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, marginTop: 1 }}>
                            Set specific budget categories for different areas like groceries, entertainment, and transportation. Whether you're budgeting for a family or individually, our app makes it easy to stay on track and manage your spending.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, marginTop: 1 }}>
                            From individual users to large family groups, the app offers the flexibility to adjust your budget to fit your needs, ensuring you stay within your financial limits and meet your savings goals.
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            <Box sx={{ width: '100%', marginBottom: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row-reverse' } }}>
                <Card sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, boxSizing: 'border-box' }}>
                    <CardMedia
                        component="img"
                        image={`${process.env.PUBLIC_URL}/TransactionDisplay.jpg`}
                        alt="Transaction Group"
                        sx={{
                            objectFit: 'cover',
                            width: { xs: '100%', md: '70%' },
                            height: { xs: '200px', md: '500px' },
                        }}
                    />
                    <CardContent sx={{ width: { xs: '100%', md: '30%' }, padding: { xs: '16px', md: '24px' } }}>
                        <Typography variant="h6" component="div" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                            Transactions at a Glance
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, marginTop: 1 }}>
                            Our app makes tracking your income and expenses seamless. Record your transactions, categorize them, and see exactly where your money is going. Whether you're managing personal finances or a family budget, tracking your spending has never been easier.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, marginTop: 1 }}>
                            With automatic tracking for recurring payments like bills or subscriptions, you’ll always know when payments are due and never miss a transaction, keeping your budget up-to-date with minimal effort.
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};


export default FeatureCards;