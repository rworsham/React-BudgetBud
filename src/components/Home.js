import React from 'react';
import Divider from '@mui/material/Divider';
import FeatureCards from "./FeatureCards";
import { Box, Typography, Button } from '@mui/material';
import {Link} from "react-router-dom";
import AccountSignUp from "./Accountsignup";
import DashboardAd from "./DashboardAdvertisement";
import ReportingAd from "./ReportingAdvertisement";
import Advertisement from "./Advertisement";

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
                    flexDirection: { xs: 'column', md: 'row' },
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
                        textAlign: { xs: 'center', md: 'left' },
                    }}
                >
                    BudgetBud
                </Typography>
                <Link to="/login" style={{ textDecoration: 'none' }}>
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
                            position: { xs: 'absolute', md: 'absolute' },
                            top: { xs: '100%', md: '50%' },
                            left: { xs: '50%', md: 'auto' },
                            transform: { xs: 'translateX(-50%)', md: 'translateY(-50%)' },
                            right: { xs: 'auto', md: '20px' },
                            marginTop: { xs: '20px', md: '0' },
                        }}
                    >
                        Login
                    </Button>
                </Link>
            </Box>
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2}}/>
            <Advertisement />
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2}}/>
            <FeatureCards/>
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2}}/>
            <AccountSignUp/>
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2}}/>
            <DashboardAd/>
            <ReportingAd/>
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2}}/>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    py: 4,
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
                        mb: 2,
                    }}
                >
                    BudgetBud
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 4,
                        flexWrap: 'wrap',
                    }}
                >
                    <Link to="/contact">
                        Contact
                    </Link>
                    <Link to="/terms">
                        Terms and Conditions
                    </Link>
                    <Link to="/privacy">
                        Privacy Policy
                    </Link>
                </Box>
            </Box>
        </div>
    );
}

export default Home;