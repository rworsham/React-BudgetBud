import React from 'react';
import {Box, Alert} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function ChartDataError({message = 'No Data Available.', height = 250}) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height }}>
            <Alert
                variant="outlined"
                color='#1DB954'
                icon={<ErrorOutlineIcon />}
                sx={{
                    width: 'auto',
                    padding: '16px',
                    color: '#1DB954',
                }}
            >
                {message}
            </Alert>
        </Box>
    )
}