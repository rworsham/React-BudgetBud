import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Typography
} from "@mui/material";
import Divider from "@mui/material/Divider";
import AddBoxIcon from "@mui/icons-material/AddBox";
import React, {useContext, useEffect, useState} from "react";
import {useTheme} from "@mui/material/styles";
import {api, AuthContext} from "../context/AuthContext";
import AccountForm from "../forms/AccountForm";


export default function ReportDashboard() {
    const theme = useTheme();
    const { authTokens } = useContext(AuthContext);
    const [reportChoices, setReportChoices] = useState([]);
    const [userReports, setUserReports] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [successAlertOpen, setSuccessAlertOpen] = useState(false);

    const handleOpen = (type) => {
        setModalType(type);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setModalType('');
        setSuccessAlertOpen(false);
    };

    const handleFormSuccess = () => {
        setSuccessAlertOpen(true);
        setTimeout(() => {
            handleClose();
        }, 5000);
    };

    useEffect(() => {
        const fetchReportChoices = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsLoading(true);
                const response = await api.get('/user/dashboard-report-options/', {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                });

                setReportChoices(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching Report choices:', err);
                setError('Failed to fetch Report choices');
                setIsLoading(false);
            }
        };

        const fetchUserReports = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsLoading(true);
                const response = await api.get(`/user/reports/`, {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                });
                setUserReports(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching User reports:', err);
                setError('Failed to fetch User reports');
                setIsLoading(false);
            }
        };

        fetchReportChoices();
        fetchUserReports();
    }, [authTokens]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

return (
    <div style={{ height: '100%', width: '75%', padding: '10px' }}>
        <Typography variant="h4" textAlign='center' gutterBottom>
            Custom Reports
        </Typography>
        <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2}}/>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{padding: 2}}>
            <Paper
                elevation={3}
                sx={{display: 'flex', alignItems: 'center', padding: '10px 20px',cursor: 'pointer', backgroundColor: '#333333'}}
                onClick={() => handleOpen('addReport')}
            >
                <IconButton edge="start" color="inherit">
                    <AddBoxIcon sx={{ color: theme.palette.primary.main }}/>
                </IconButton>
                <Typography variant="button" sx={{ ml: 1 , color: theme.palette.primary.main}}>
                    Add Report
                </Typography>
            </Paper>
        </Box>
        <Dialog open={open && modalType === 'addReport'} onClose={handleClose}>
            <DialogTitle sx={{ textAlign: 'center' }}>Add Report</DialogTitle>
            <DialogContent>
                <AccountForm onSuccess={handleFormSuccess}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog open={successAlertOpen} onClose={handleClose}>
            <DialogTitle>Success</DialogTitle>
            <DialogContent>
                <Typography>Addition Successful!</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    </div>
    );
}