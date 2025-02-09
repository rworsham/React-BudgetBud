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
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                You can create family groups and link different people (users) to a family.
                This helps families or groups of people keep track of finances and share resources together.
            </Typography>
            <Box sx={{ width: '100%', marginTop: 2 }}>
                <img
                    src="https://via.placeholder.com/1200x200"
                    alt="placeholder"
                    style={{ width: '100%', height: 'auto' }}
                />
            </Box>
        </Box>
    );
};
export default Advertisement;