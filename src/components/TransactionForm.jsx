import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, FormGroup, FormControl, MenuItem, Select, InputLabel, Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';

axios.defaults.withCredentials = true;

const TransactionForm = () => {
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionType, setTransactionType] = useState('income');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [budget, setBudget] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringType, setRecurringType] = useState('');
    const [nextOccurrence, setNextOccurrence] = useState('');
    const [categories, setCategories] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        const fetchChoices = async () => {
            try {
                const [Categories, Budgets] = await Promise.all([
                    axios.get('https://localhost:8000/api/categories/'),
                    axios.get('https://localhost:8000/api/budget/'),
                ]);

                setCategories(Categories.data);
                setBudgets(Budgets.data);

                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        };

        fetchChoices();
    }, []);

    const validateForm = () => {
        if (!date || !amount || !category || !budget) {
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

        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('https://localhost:8000/api/transactions/', {
                date,
                amount,
                transaction_type: transactionType,
                description,
                category,
                budget,
                is_recurring: isRecurring,
                recurring_type: recurringType,
                next_occurrence: nextOccurrence,
            });

            console.log('Transaction created:', response.data);
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to create transaction. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <form onSubmit={handleSubmit}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 'auto',
                        width: '50vh',
                        height: '60vh',
                        padding: 2,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <FormGroup sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <FormControl sx={{ marginBottom: 2 }}>
                            <TextField
                                type="date"
                                label="Date"
                                variant="outlined"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                fullWidth
                                required
                            />
                        </FormControl>

                        <FormControl sx={{ marginBottom: 2 }}>
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

                        <FormControl sx={{ marginBottom: 2 }}>
                            <InputLabel>Transaction Type</InputLabel>
                            <Select
                                label="Transaction Type"
                                value={transactionType}
                                onChange={(e) => setTransactionType(e.target.value)}
                                fullWidth
                            >
                                <MenuItem value="income">Income</MenuItem>
                                <MenuItem value="expense">Expense</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl sx={{ marginBottom: 2 }}>
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

                        <FormControl sx={{ marginBottom: 2 }}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                label="Category"
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

                        {/* Budget */}
                        <FormControl sx={{ marginBottom: 2 }}>
                            <InputLabel>Budget</InputLabel>
                            <Select
                                label="Budget"
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
                            control={<Checkbox checked={isRecurring} onChange={() => setIsRecurring(!isRecurring)} />}
                            label="Is Recurring"
                        />

                        {isRecurring && (
                            <>
                                <FormControl sx={{ marginBottom: 2 }}>
                                    <InputLabel>Recurring Type</InputLabel>
                                    <Select
                                        label="Recurring Type"
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
                                    <TextField
                                        type="date"
                                        label="Next Occurrence"
                                        variant="outlined"
                                        value={nextOccurrence}
                                        onChange={(e) => setNextOccurrence(e.target.value)}
                                        fullWidth
                                        required={isRecurring}
                                    />
                                </FormControl>
                            </>
                        )}

                        <Button variant="contained" type="submit" disabled={isLoading} fullWidth>
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </Button>

                        {error && (
                            <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>
                                {error}
                            </Typography>
                        )}
                    </FormGroup>
                </Box>
            </form>
        </div>
    );
};

export default TransactionForm;