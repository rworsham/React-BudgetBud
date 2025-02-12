import React, { useState, useEffect, useContext } from "react";
import { AuthContext, api } from "../context/AuthContext";
import DateRangeFilterForm from "../forms/DateRangeFilterForm";
import {
    Box,
    Button, Card, CardContent, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Typography
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import dayjs from 'dayjs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Divider from "@mui/material/Divider";
import ChartDataError from "./ChartDataError";
import {useTheme} from "@mui/material/styles";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditNoteIcon from "@mui/icons-material/EditNote";
import BudgetForm from "../forms/BudgetForm";
import BudgetEditForm from "../forms/BudgetEditForm";
import BudgetGoalForm from "../forms/BudgetGoalForm";
import BudgetHistory from "./BudgetHistory";

export default function BudgetTransactionOverview() {
    const theme = useTheme();
    const { authTokens } = useContext(AuthContext);
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [existingBudgets, setExistingBudgets] = useState([]);
    const [selectedBudgetId, setSelectedBudgetId] = useState();
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [successAlertOpen, setSuccessAlertOpen] = useState(false);
    const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsLoading(true);
                const dataPayload = {
                    start_date: startDate,
                    end_date: endDate,
                };

                const response = await api.post('/budget-transaction-overview/', dataPayload, {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                    },
                });
                const budgetResponse = await api.get('/budget/');
                setExistingBudgets(budgetResponse.data);
                setReportData(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [authTokens, startDate, endDate]);

    const handleStartDateChange = (newValue) => {
        setStartDate(newValue ? newValue.format('YYYY-MM-DD') : null);
    };

    const handleEndDateChange = (newValue) => {
        setEndDate(newValue ? newValue.format('YYYY-MM-DD') : null);
    };

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

    const incomeExpenseData = [
        {
            name: "Income",
            value: reportData?.transactions.filter(t => t.transaction_type === "income").reduce((sum, t) => sum + parseFloat(t.amount), 0)
        },
        {
            name: "Expense",
            value: reportData?.transactions.filter(t => t.transaction_type === "expense").reduce((sum, t) => sum + parseFloat(t.amount), 0)
        },
    ];

    const expenseCategoriesData = reportData?.transactions
        .filter(t => t.transaction_type === "expense")
        .reduce((acc, t) => {
            const categoryName = t.category;
            if (acc[categoryName]) {
                acc[categoryName] += parseFloat(t.amount);
            } else {
                acc[categoryName] = parseFloat(t.amount);
            }
            return acc;
        }, {});

    const pieChartData = Object.keys(expenseCategoriesData || {}).map(category => ({
        name: category,
        value: expenseCategoriesData[category],
    }));

    const budgetData = reportData?.budgets_remaining?.map(budget => ({
        name: budget.budget_name,
        starting_budget: parseFloat(budget.starting_budget),
        remaining_budget: parseFloat(budget.remaining_budget),
    }));

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{ height: '100%', width: '75%', padding: '10px' }}>
            <DateRangeFilterForm
            startDate={startDate}
            endDate={endDate}
            handleStartDateChange={handleStartDateChange}
            handleEndDateChange={handleEndDateChange}
            />
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 5}}/>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={4} size={4}>
                    <Box sx={{ marginBottom: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                            Expense Categories Breakdown
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            {pieChartData && pieChartData.length > 0 ? (
                                <PieChart>
                                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                                         outerRadius={80} fill="#8884d8"
                                         label={({ name, value }) => `${name}: $${value.toFixed(2)}`}>
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.value > 100 ? "#1DB954" : "#387908"} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            ) : (
                                <ChartDataError/>
                            )}
                        </ResponsiveContainer>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4} size={4}>
                    <Box sx={{ marginBottom: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                            Income vs Expense
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            {incomeExpenseData && (incomeExpenseData[0]?.value > 0 || incomeExpenseData[1]?.value > 0) ? (
                                <BarChart data={incomeExpenseData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            ) : (
                                <ChartDataError/>
                            )}
                        </ResponsiveContainer>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4} size={4}>
                    <Box sx={{ marginBottom: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                            Budget vs Remaining Budget
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            {budgetData && budgetData.length > 0 ? (
                                <BarChart data={budgetData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="starting_budget" fill="#8884d8" />
                                    <Bar dataKey="remaining_budget" fill="#82ca9d" />
                                </BarChart>
                            ) : (
                                <ChartDataError/>
                            )}
                        </ResponsiveContainer>
                    </Box>
                </Grid>
            </Grid>
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 5}}/>
            <Box display="flex" justifyContent="center" alignItems="center" sx={{padding: 2, gap: '10px'}}>
                <Paper
                    elevation={3}
                    sx={{display: 'flex', alignItems: 'center', padding: '10px 20px',cursor: 'pointer', backgroundColor: '#333333'}}
                    onClick={() => handleOpen('addBudget')}
                >
                    <IconButton edge="start" color="inherit">
                        <AddBoxIcon sx={{ color: theme.palette.primary.main }}/>
                    </IconButton>
                    <Typography variant="button" sx={{ ml: 1 , color: theme.palette.primary.main}}>
                        Add Budget
                    </Typography>
                </Paper>
                <Paper
                    elevation={3}
                    sx={{display: 'flex', alignItems: 'center', padding: '10px 20px',cursor: 'pointer', backgroundColor: '#333333'}}
                    onClick={() => handleOpen('editBudget')}
                >
                    <IconButton edge="start" color="inherit">
                        <EditNoteIcon sx={{ color: theme.palette.primary.main }}/>
                    </IconButton>
                    <Typography variant="button" sx={{ ml: 1 , color: theme.palette.primary.main}}>
                        Edit Budgets
                    </Typography>
                </Paper>
            </Box>
            <Grid container spacing={4}>
                {existingBudgets.map((budget) => (
                    <Grid item xs={12} sm={4} size={4} key={budget.id}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" textAlign='center' gutterBottom>
                                    {budget.name}
                                </Typography>
                                <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2}}/>
                                <Typography variant="body1" textAlign='center'>
                                    Balance: ${parseFloat(budget.total_amount).toFixed(2)}
                                </Typography>
                                <Grid container spacing={1} sx={{ marginTop: 2, justifyContent: 'center' }}>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => {
                                                setSelectedBudgetId(budget.id);
                                                handleOpen('viewHistory');
                                            }}
                                        >
                                            View History
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            onClick={() => {
                                                setSelectedBudgetId(budget.id);
                                                handleOpen('setBudgetGoal');
                                            }}
                                        >
                                            Set Budget Goal
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 5}}/>
            <Box sx={{ marginBottom: 3 }}>
                <Paper sx={{
                    padding: 3,
                    textAlign: 'center',
                    backgroundColor: '#333333',
                    borderRadius: 2,
                    boxShadow: 3,
                }}>
                    <Typography variant="h6" sx={{
                        textDecoration: 'underline',
                        fontWeight: 'bold',
                        color: '#1DB954',
                        marginBottom: 1
                    }}>
                        Financial Overview
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 1 }}>
                        {dayjs(startDate).format('MMM D, YYYY')} - {dayjs(endDate).format('MMM D, YYYY')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                        Total Income: ${incomeExpenseData[0]?.value ? incomeExpenseData[0].value.toFixed(2) : '0.00'}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                        Total Expenses: ${incomeExpenseData[1]?.value ? incomeExpenseData[1].value.toFixed(2) : '0.00'}
                    </Typography>
                    <Typography variant="body1" sx={{
                        fontWeight: 'bold',
                        color: '#1DB954',
                        marginBottom: 1
                    }}>
                        Remaining Budget: ${budgetData?.reduce((acc, b) => acc + b.remaining_budget, 0).toFixed(2)}
                    </Typography>
                </Paper>
            </Box>
            <Dialog open={open && modalType === 'addBudget'} onClose={handleClose}>
                <DialogTitle sx={{ textAlign: 'center' }}>New Budget</DialogTitle>
                <DialogContent><BudgetForm onSuccess={handleFormSuccess}/></DialogContent>
                <DialogActions><Button onClick={handleClose} color="primary">Close</Button></DialogActions>
            </Dialog>
            <Dialog open={open && modalType === 'editBudget'} onClose={handleClose}>
                <DialogTitle sx={{ textAlign: 'center' }}>New Budget</DialogTitle>
                <DialogContent><BudgetEditForm onSuccess={handleFormSuccess}/></DialogContent>
                <DialogActions><Button onClick={handleClose} color="primary">Close</Button></DialogActions>
            </Dialog>
            <Dialog open={open && modalType === 'viewHistory'} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle sx={{ textAlign: 'center' }}>Account History</DialogTitle>
                <DialogContent>
                    {selectedBudgetId && <BudgetHistory budget_id={selectedBudgetId} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={open && modalType === 'setBudgetGoal'} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle sx={{ textAlign: 'center' }}>Set Savings Goal</DialogTitle>
                <DialogContent>
                    {selectedBudgetId && <BudgetGoalForm budget_id={selectedBudgetId} onSuccess={handleFormSuccess}/>}
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
            {isLoading && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 100,
                        right: 16,
                        zIndex: 1300,
                    }}
                >
                    <CircularProgress color="success" />
                </Box>
            )}
        </div>
    );
}