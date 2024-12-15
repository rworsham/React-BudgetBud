import React from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import FeatureCards from "./FeatureCards";

function Home() {
    return (
        <div style={{padding: '20px'}}>
            <Paper elevation={6} sx={{padding: 2}}>
                <FeatureCards/>
            </Paper>
            <Divider sx={{borderColor: '#1DB954', marginTop: 2}}/>
        </div>
    );
}

export default Home;