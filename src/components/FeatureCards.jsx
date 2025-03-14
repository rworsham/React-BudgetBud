import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

const FeatureCards = () => {
    return (
        <Box sx={{ width: '80%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', marginBottom: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row-reverse' } }}>
                <Card sx={{ width: '100%', display: 'flex', flexDirection: 'row', boxSizing: 'border-box' }}>
                    <CardContent sx={{ width: '30%' }}>
                        <Typography variant="h6" component="div">
                            Family Group
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                            You can create family groups and link different people (users) to a family.
                            This helps families or groups of people keep track of finances and share resources together.
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
                            Budgeting
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                            You can categorize your spending (like groceries, entertainment, etc.)
                            and set limits for how much you want to spend in each category.
                            You can also set a budget for overall expenses and track how well you're sticking to it.
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
            <Box sx={{ width: '100%', marginBottom: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row-reverse' } }}>
                <Card sx={{ width: '100%', display: 'flex', flexDirection: 'row', boxSizing: 'border-box' }}>
                    <CardContent sx={{ width: '30%' }}>
                        <Typography variant="h6" component="div">
                            Transactions
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                            Tracking Transactions and Recurring Payments: You can record your income and expenses,
                            and for things that happen regularly (like monthly bills or salary),
                            the system will automatically track when they should happen again,
                            saving you from having to manually enter them each time.
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