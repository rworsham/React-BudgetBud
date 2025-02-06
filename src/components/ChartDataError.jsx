import React from 'react';
import {Box, Alert} from '@mui/material';

export default function ChartDataError({message = 'No Data Available.', height = 250}) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height }}>
            <Alert
                variant="outlined"
                severity="info"
                sx={{
                    width: 'auto',
                    padding: '16px',
                }}
            >
                {message}
            </Alert>
        </Box>
    )
}