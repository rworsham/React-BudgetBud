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
import Grid from '@mui/material/Grid2';
import Divider from "@mui/material/Divider";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditNoteIcon from '@mui/icons-material/EditNote';
import React, {useContext, useEffect, useState} from "react";
import {useTheme} from "@mui/material/styles";
import {api, AuthContext} from "../context/AuthContext";
import ReportDashboardSelectionForm from "../forms/ReportDashboardSelectionForm";
import ReportDashboardEditForm from "../forms/ReportDashboardEditForm";
import ExpenseCategoriesPieChart from "../DashboardReports/ExpenseCategoriesPieChart";
import BudgetRemainingBudgetBarChart from "../DashboardReports/BudgetRemainingBudgetBarChart";
import ExpenseCategoriesBarChart from "../DashboardReports/ExpenseCategoriesBarChart";
import AccountBalanceHistoryLineChart from "../DashboardReports/AccountBalanceHistoryLineChart";
import IncomeExpenseBarChart from "../DashboardReports/IncomeExpenseBarChart";


export default function ReportDashboard() {
    const theme = useTheme();
    const { authTokens } = useContext(AuthContext);
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
        <Box display="flex" justifyContent="center" alignItems="center" sx={{padding: 2, gap: '10px'}}>
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
            <Paper
                elevation={3}
                sx={{display: 'flex', alignItems: 'center', padding: '10px 20px',cursor: 'pointer', backgroundColor: '#333333'}}
                onClick={() => handleOpen('editReport')}
            >
                <IconButton edge="start" color="inherit">
                    <EditNoteIcon sx={{ color: theme.palette.primary.main }}/>
                </IconButton>
                <Typography variant="button" sx={{ ml: 1 , color: theme.palette.primary.main}}>
                    Edit Reports
                </Typography>
            </Paper>
        </Box>
        <Dialog open={open && modalType === 'addReport'} onClose={handleClose}>
            <DialogTitle sx={{ textAlign: 'center' }}>Add Report</DialogTitle>
            <DialogContent>
                <ReportDashboardSelectionForm onSuccess={handleFormSuccess}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog open={open && modalType === 'editReport'} onClose={handleClose}>
            <DialogTitle sx={{ textAlign: 'center' }}>Edit Report</DialogTitle>
            <DialogContent>
                <ReportDashboardEditForm onSuccess={handleFormSuccess}/>
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
        <Grid container justifyContent="center" alignItems="flex-start">
            {Array.isArray(userReports) && userReports.length > 0 &&
                userReports.map((report, index) => (
                    <Grid item key={index}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto' }}>
                            {report.display_name === "Expense Categories Pie Chart" && (
                                <ExpenseCategoriesPieChart
                                    x_size={report.x_size}
                                    y_size={report.y_size}
                                />
                            )}
                            {report.display_name === "Budget Vs Remaining Budget" && (
                                <BudgetRemainingBudgetBarChart
                                    x_size={report.x_size}
                                    y_size={report.y_size}
                                />
                            )}
                            {report.display_name === "Expense Categories Bar Chart" && (
                                <ExpenseCategoriesBarChart
                                    x_size={report.x_size}
                                    y_size={report.y_size}
                                />
                            )}
                            {report.display_name === "Account Balance History Line Chart" && (
                                <AccountBalanceHistoryLineChart
                                    x_size={report.x_size}
                                    y_size={report.y_size}
                                />
                            )}
                            {report.display_name === "Income vs. Expense Bar Chart" && (
                                <IncomeExpenseBarChart
                                    x_size={report.x_size}
                                    y_size={report.y_size}
                                />
                            )}
                        </div>
                    </Grid>
                ))
            }
        </Grid>
    </div>
    );
}