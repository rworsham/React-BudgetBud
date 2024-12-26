import React from 'react';
import { Box, Grid, List, ListItem, Typography } from '@mui/material';

const DashboardAd = () => {
    return (
        <Box sx={{ display: 'flex', height: '50vh', padding: '4rem' }}>
            <Box sx={{ flex: 1, height: '100%', overflow: 'hidden' }}>
                <img
                    src="https://via.placeholder.com/150"
                    alt="Placeholder for dashboard pic"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </Box>
            <Box sx={{ flex: 1, height: '100%', padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Bullet Points:
                </Typography>
                <List>
                    <ListItem>• Bullet point 1</ListItem>
                    <ListItem>• Bullet point 2</ListItem>
                    <ListItem>• Bullet point 3</ListItem>
                    <ListItem>• Bullet point 4</ListItem>
                </List>
            </Box>
        </Box>
    );
};

export default DashboardAd;