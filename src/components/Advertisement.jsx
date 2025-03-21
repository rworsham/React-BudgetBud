import React from 'react';
import { Box, Typography} from '@mui/material';

const Advertisement = () => {
    return (
        <Box
            sx={{
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
            <Box sx={{ width: '100%', marginTop: 2 }}>
                <img
                    src={`${process.env.PUBLIC_URL}/pexels-pixabay-47344.jpg`}
                    alt="placeholder"
                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                />
            </Box>
        </Box>
    );
};
export default Advertisement;