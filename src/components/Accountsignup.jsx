import React from 'react';
import ComputerIcon from '@mui/icons-material/Computer';
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import {Box, Button} from '@mui/material';
import {Link} from "react-router-dom";

const AccountSignUp = () => {
    return (
        <Box sx={{ textAlign: 'center', padding: '20px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
                <Box>
                    <PersonalVideoIcon sx={{ fontSize: '5rem' }} />
                </Box>
                <Box>
                    <ComputerIcon sx={{ fontSize: '5rem' }} />
                </Box>
                <Box>
                    <TabletMacIcon sx={{ fontSize: '5rem' }} />
                </Box>
                <Box>
                    <PhoneAndroidIcon sx={{ fontSize: '5rem' }} />
                </Box>
            </Box>
            <Box sx={{textAlign: 'center', padding: '20px', marginBottom: 4}}>
                <h2>Anytime. Anywhere. Any device.</h2>
            </Box>
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

export default AccountSignUp;