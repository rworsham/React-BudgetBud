import React from 'react';
import { Box, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

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
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    height: '100%',
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: { xs: 'center', md: 'flex-start' },
                    marginBottom: { xs: '2rem', md: 0 },
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 'bold',
                        color: '#1DB954',
                        textAlign: { xs: 'center', md: 'left' },
                    }}
                >
                    Customizable Reports
                </Typography>
                <Box
                    sx={{
                        marginTop: { xs: '1rem', md: '0' },
                        textAlign: { xs: 'center', md: 'left' },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '1rem',
                        }}
                    >
                        <CircleIcon sx={{ color: '#1DB954', fontSize: 'medium', marginRight: 1 }} />
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                color: '#1DB954',
                            }}
                        >
                            Detailed Expense Breakdown
                        </Typography>
                    </Box>
                    <Typography
                        sx={{ color: '#B3B3B3', marginBottom: '1rem', textAlign: { xs: 'center', md: 'left' } }}
                    >
                        Dive into your spending categories and identify trends for smarter budgeting.
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '1rem',
                        }}
                    >
                        <CircleIcon sx={{ color: '#1DB954', fontSize: 'medium', marginRight: 1 }} />
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                color: '#1DB954',
                            }}
                        >
                            Comparative Insights
                        </Typography>
                    </Box>
                    <Typography
                        sx={{ color: '#B3B3B3', marginBottom: '1rem', textAlign: { xs: 'center', md: 'left' } }}
                    >
                        Compare your financial progress across different periods to see where you can improve.
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '1rem',
                        }}
                    >
                        <CircleIcon sx={{ color: '#1DB954', fontSize: 'medium', marginRight: 1 }} />
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                color: '#1DB954',
                            }}
                        >
                            Exportable Data
                        </Typography>
                    </Box>
                    <Typography
                        sx={{ color: '#B3B3B3', textAlign: { xs: 'center', md: 'left' } }}
                    >
                        Export your reports to PDF formats for offline review and sharing.
                    </Typography>
                </Box>
            </Box>
            <Box
                sx={{
                    flex: 1,
                    height: '100%',
                    overflow: 'hidden',
                    boxShadow: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <img
                    src={`${process.env.PUBLIC_URL}/ReportsCustomizable.jpg`}
                    alt="Placeholder for report/stat pic"
                    style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover',
                        borderRadius: 8,
                    }}
                />
            </Box>
        </Box>
    );
};

export default ReportingAd;