import React from 'react';
import {Box, Button, Typography} from '@mui/material';
import {Link} from "react-router-dom";

const Advertisement = () => {
    return (
        <Box
            sx={{
                paddingTop: { xs: '80px', md: '0' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'auto',
                textAlign: 'center',
            }}
        >
            <Typography variant="h5" color="text.primary" sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                Track Your Family's or Personal Finances Effortlessly
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', marginTop: 2 }}>
                Our app makes it easy for families, groups, or even individuals to stay on top of their finances. Create personalized family groups or use it individually to manage your finances effectively. Share budgets, track shared expenses, and monitor your financial goals with ease.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', marginTop: 2 }}>
                Whether you're budgeting for family trips, managing personal expenses, or saving for big purchases, our intuitive system helps you stay organized and financially empowered.
            </Typography>
            <Box sx={{ textAlign: 'center', padding: '20px', marginBottom: 4 }}>
                <Link to="/SignUp" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary">
                        Create Free Account
                    </Button>
                </Link>
            </Box>
        </Box>
    );
};
export default Advertisement;