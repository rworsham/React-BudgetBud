import React from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';

const ReportingAd = () => {
    return (
        <Box sx={{ display: 'flex', height: '50vh', padding: '4rem' }}>
            <Box sx={{ flex: 1, height: '100%', padding: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Box sx={{ maxWidth: '50%' }}>
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
            <Box sx={{ flex: 1, height: '100%', overflow: 'hidden' }}>
                <img
                    src="https://via.placeholder.com/150"
                    alt="Placeholder for report/stat pic"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </Box>
        </Box>
    );
};

export default ReportingAd;