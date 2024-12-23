import React from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import FeatureCards from "./FeatureCards";
import { Box, Typography, Button } from '@mui/material';
import {Link} from "react-router-dom";
import AccountSignUp from "./Accountsignup";

function Home() {
    return (
        <div style={{padding: '20px'}}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    width: '100%',
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '4rem',
                        background: 'linear-gradient(45deg, #1DB954, #006400)',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        display: 'inline-block',
                        position: 'relative',
                    }}
                >
                    BudgetBud
                </Typography>
                <Link to="/login" style={{ textDecoration: 'none', position: 'absolute', right: '20px' }}>
                    <Button
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(45deg, #1DB954, #006400)',
                            fontWeight: 'bold',
                            fontSize: '1.5rem',
                            color: 'white',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #006400, #1DB954)',
                            },
                            padding: '10px 20px',
                            borderRadius: '5px',
                        }}
                    >
                        Login
                    </Button>
                </Link>
            </Box>
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2}}/>
            <FeatureCards/>
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2}}/>
            <AccountSignUp />
        </div>
    );
}

export default Home;