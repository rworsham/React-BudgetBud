import React from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';

const ReportingAd = () => {
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
                    padding: 2,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginBottom: { xs: '2rem', md: 0 },
                }}
            >
                <Box sx={{ maxWidth: { xs: '100%', md: '50%' } }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1DB954', marginBottom: '1rem' }}>
                        Powerful and Customizable Reports
                    </Typography>
                    <List sx={{ paddingLeft: { xs: 0, md: 2 }, marginTop: { xs: '1rem', md: 0 } }}>
                        <ListItem sx={{ color: '#B3B3B3', marginBottom: '1rem' }}>
                            • <span style={{ color: '#1DB954' }}>Customizable Reports</span>: Generate reports based on categories, dates, and more, tailored to your specific needs.
                        </ListItem>
                        <ListItem sx={{ color: '#B3B3B3', marginBottom: '1rem' }}>
                            • <span style={{ color: '#1DB954' }}>Detailed Expense Breakdown</span>: Dive into your spending categories and identify trends for smarter budgeting.
                        </ListItem>
                        <ListItem sx={{ color: '#B3B3B3', marginBottom: '1rem' }}>
                            • <span style={{ color: '#1DB954' }}>Comparative Insights</span>: Compare your financial progress across different periods to see where you can improve.
                        </ListItem>
                        <ListItem sx={{ color: '#B3B3B3' }}>
                            • <span style={{ color: '#1DB954' }}>Exportable Data</span>: Export your reports to PDF formats for offline review and sharing.
                        </ListItem>
                    </List>
                </Box>
            </Box>
            <Box
                sx={{
                    flex: 1,
                    height: '100%',
                    overflow: 'hidden',
                    boxShadow: 3,
                }}
            >
                <img
                    src="https://via.placeholder.com/150"
                    alt="Placeholder for report/stat pic"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 8,
                    }}
                />
            </Box>
        </Box>
    );
};

export default ReportingAd;