import React from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';

const DashboardAd = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                height: 'auto',
                padding: { xs: '2rem', md: '4rem' },
                backgroundColor: '#121212',
                borderRadius: 2,
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    height: '100%',
                    overflow: 'hidden',
                    boxShadow: 3,
                    marginBottom: { xs: '2rem', md: 0 },
                }}
            >
                <img
                    src="https://via.placeholder.com/150"
                    alt="Placeholder for dashboard pic"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 8,
                    }}
                />
            </Box>
            <Box
                sx={{
                    flex: 1,
                    height: '100%',
                    padding: { xs: 1, md: 2 },
                }}
            >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1DB954', marginBottom: '1rem' }}>
                    Customize Your Dashboard for Easy Access
                </Typography>
                <List sx={{ paddingLeft: { xs: 0, md: 2 }, marginTop: { xs: '1rem', md: 0 } }}>
                    <ListItem sx={{ color: '#B3B3B3', marginBottom: '1rem' }}>
                        • <span style={{ color: '#1DB954' }}>Customizable Layout</span>: Tailor your dashboard to display the most relevant financial information based on your needs.
                    </ListItem>
                    <ListItem sx={{ color: '#B3B3B3', marginBottom: '1rem' }}>
                        • <span style={{ color: '#1DB954' }}>Real-Time Overview</span>: View your spending, savings, and budget progress at a glance, with up-to-date metrics.
                    </ListItem>
                    <ListItem sx={{ color: '#B3B3B3', marginBottom: '1rem' }}>
                        • <span style={{ color: '#1DB954' }}>Quick Access to Key Metrics</span>: Easily access your most important financial stats, like upcoming bills and current spending.
                    </ListItem>
                    <ListItem sx={{ color: '#B3B3B3' }}>
                        • <span style={{ color: '#1DB954' }}>Interactive Features</span>: Engage with your data using graphs, toggles, and filters for a personalized and user-friendly experience.
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
};

export default DashboardAd;