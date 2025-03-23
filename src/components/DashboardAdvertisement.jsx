import React from 'react';
import { Box, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

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
                    src={`${process.env.PUBLIC_URL}/ReportsDashboard.jpg`}
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
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 'bold',
                        color: '#1DB954',
                        textAlign: { xs: 'center', md: 'left' },
                    }}
                >
                    Customize Your Dashboard for Easy Access
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
                        <CircleIcon sx={{ color: '#1DB954', fontSize: 'medium', marginRight: 1, }} />
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                color: '#1DB954',
                            }}
                        >
                            Customizable Layout
                        </Typography>
                    </Box>
                    <Typography
                        sx={{ color: '#B3B3B3', marginBottom: '1rem', textAlign: { xs: 'center', md: 'left' } }}
                    >
                        Tailor your dashboard to display the most relevant financial information based on your needs.
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
                            Real-Time Overview
                        </Typography>
                    </Box>
                    <Typography
                        sx={{ color: '#B3B3B3', marginBottom: '1rem', textAlign: { xs: 'center', md: 'left' } }}
                    >
                        View your spending, savings, and budget progress at a glance, with up-to-date metrics.
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
                            Quick Access to Key Metrics
                        </Typography>
                    </Box>
                    <Typography
                        sx={{ color: '#B3B3B3', marginBottom: '1rem', textAlign: { xs: 'center', md: 'left' } }}
                    >
                        Easily access your most important financial stats, like upcoming bills and current spending.
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
                            Interactive Features
                        </Typography>
                    </Box>
                    <Typography
                        sx={{ color: '#B3B3B3', textAlign: { xs: 'center', md: 'left' } }}
                    >
                        Engage with your data using graphs, toggles, and filters for a personalized and user-friendly experience.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardAd;