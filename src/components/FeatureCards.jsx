import React from 'react';
import { Card, CardContent, Typography, Grid2} from '@mui/material';

const HorizontalCards = () => {
    return (
        <Grid2 container spacing={3}>
            <Grid2 xs={12} sm={4} md={4} lg={4}>
                <Card sx={{ height: '100%', maxWidth: '100%' }}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                            Family Group
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ wordWrap: 'break-word', whiteSpace: 'normal', maxWidth: '100%' }}>
                            You can create family groups and link different people (users) to a family.
                            This helps families or groups of people keep track of finances and share resources together.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid2>

            <Grid2 xs={12} sm={4} md={4} lg={4}>
                <Card sx={{ height: '100%', maxWidth: '100%' }}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                            Budgeting
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ wordWrap: 'break-word', whiteSpace: 'normal', maxWidth: '100%' }}>
                            You can categorize your spending (like groceries, entertainment, etc.)
                            and set limits for how much you want to spend in each category.
                            You can also set a budget for overall expenses and track how well you're sticking to it.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid2>

            <Grid2 xs={12} sm={4} md={4} lg={4}>
                <Card sx={{ height: '100%', maxWidth: '100%' }}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                            Transactions
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ wordWrap: 'break-word', whiteSpace: 'normal', maxWidth: '100%' }}>
                            Tracking Transactions and Recurring Payments:
                            You can record your income and expenses,
                            and for things that happen regularly (like monthly bills or salary),
                            the system will automatically track when they should happen again,
                            saving you from having to manually enter them each time.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid2>
        </Grid2>
    );
};

export default HorizontalCards;