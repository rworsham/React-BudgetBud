import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, FormGroup, FormControl, MenuItem, Select, InputLabel, Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AuthContext, api } from '../context/AuthContext';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import AlertHandler from "../components/AlertHandler";

const TransactionForm = ({ onSuccess, familyView }) => {
    const { authTokens } = useContext(AuthContext);
    const [date, setDate] = useState(null);
    const [amount, setAmount] = useState('');
    const [transactionType, setTransactionType] = useState('expense');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [budget, setBudget] = useState('');
    const [account, setAccount] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringType, setRecurringType] = useState('');
    const [nextOccurrence, setNextOccurrence] = useState(null);
    const [categories, setCategories] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const theme = useTheme();

    useEffect(() => {
        const fetchChoices = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                const [Categories, Budgets, Accounts] = await Promise.all([
                    api.get('/categories/', {params:{familyView: familyView}}),
                    api.get('/budget/', {params:{familyView: familyView}}),
                    api.get('/accounts/', {params:{familyView: familyView}})
                ]);

                setCategories(Categories.data);
                setBudgets(Budgets.data);
                setAccounts(Accounts.data);

                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        };

        fetchChoices();
    }, [authTokens, familyView]);

    const validateForm = () => {
        if (!date || !amount || !category || !budget || !account) {
            setError('Please fill in all required fields.');
            return false;
        }
        if (isRecurring && !recurringType) {
            setError('Please select a recurring type.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setError('');

        try {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            const formattedNextOccurrence = nextOccurrence ? dayjs(nextOccurrence).format('YYYY-MM-DD') : null;
            const response = await api.post('/transaction/', {
                date: formattedDate,
                amount,
                transaction_type: transactionType,
                description,
                category,
                budget,
                account,
                is_recurring: isRecurring,
                recurring_type: recurringType,
                next_occurrence: formattedNextOccurrence,
            }, {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
                params: {
                    familyView: familyView,
                }
            });

            console.log('Transaction created:', response.data);

            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setError('Failed to create transaction. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto'}}>
            <form onSubmit={handleSubmit}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 'auto',
                        width: '100%',
                        maxWidth: 600,
                        height: 'auto',
                        padding: 3,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <FormGroup sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                        <FormControl sx={{ marginBottom: 2 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Date"
                                    value={dayjs(date)}
                                    onChange={(newDate) => setDate(newDate)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            required
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <FormControl sx={{marginBottom: 2}}>
                            <TextField
                                type="number"
                                label="Amount"
                                variant="outlined"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                fullWidth
                                required
                            />
                        </FormControl>
                        <FormControl sx={{marginBottom: 2}}>
                            <InputLabel>Transaction Type</InputLabel>
                            <Select
                                label="Transaction Type"
                                variant="outlined"
                                value={transactionType}
                                onChange={(e) => setTransactionType(e.target.value)}
                                fullWidth
                            >
                                <MenuItem value="income">Income</MenuItem>
                                <MenuItem value="expense">Expense</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{marginBottom: 2}}>
                            <TextField
                                label="Description"
                                variant="outlined"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </FormControl>
                        <FormControl sx={{marginBottom: 2}}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                label="Category"
                                variant="outlined"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                fullWidth
                                required
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{marginBottom: 2}}>
                            <InputLabel>Account</InputLabel>
                            <Select
                                label="Account"
                                variant="outlined"
                                value={account}
                                onChange={(e) => setAccount(e.target.value)}
                                fullWidth
                                required
                            >
                                {accounts.map((acc) => (
                                    <MenuItem key={acc.id} value={acc.id}>
                                        {acc.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{marginBottom: 2}}>
                            <InputLabel>Budget</InputLabel>
                            <Select
                                label="Budget"
                                variant="outlined"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                fullWidth
                                required
                            >
                                {budgets.map((budgetItem) => (
                                    <MenuItem key={budgetItem.id} value={budgetItem.id}>
                                        {budgetItem.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={<Checkbox checked={isRecurring} onChange={() => setIsRecurring(!isRecurring)}/>}
                            label="Is Recurring"
                        />

                        {isRecurring && (
                            <>
                                <FormControl sx={{marginBottom: 2}}>
                                    <InputLabel>Recurring Type</InputLabel>
                                    <Select
                                        label="Recurring Type"
                                        variant="outlined"
                                        value={recurringType}
                                        onChange={(e) => setRecurringType(e.target.value)}
                                        fullWidth
                                        required={isRecurring}
                                    >
                                        <MenuItem value="daily">Daily</MenuItem>
                                        <MenuItem value="weekly">Weekly</MenuItem>
                                        <MenuItem value="monthly">Monthly</MenuItem>
                                        <MenuItem value="yearly">Yearly</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ marginBottom: 2 }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Next Occurence"
                                            value={dayjs(nextOccurrence)}
                                            onChange={(newDate) => setNextOccurrence(newDate)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    required={isRecurring}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                            </>
                        )}

                        <Button variant="contained" type="submit" disabled={isLoading} fullWidth>
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>

                        {error && (
                            <AlertHandler alertMessage={error} />
                        )}
                    </FormGroup>
                </Box>
            </form>
        </div>
    );
};

export default TransactionForm;