import { useState, useEffect, useContext } from 'react';
import { TextField, Button, FormGroup, FormControl, Box, Typography, InputLabel, Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AuthContext, api } from "../context/AuthContext";

const BudgetEditForm = ({ onSuccess }) => {
    const { authTokens } = useContext(AuthContext);
    const [budgetID, setBudgetID] = useState('');
    const [newBudget, setNewBudget] = useState('');
    const [newName, setNewName] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [existingBudget, setExistingBudget] = useState([]);
    const theme = useTheme();

    useEffect(() => {
        const fetchBudgets = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsLoading(true);
                const response = await api.get('/budget/');
                setExistingBudget(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        };

        fetchBudgets();
    }, [authTokens]);

    const handleBudgetChange = (selectedBudgetId) => {
        setBudgetID(selectedBudgetId);
        const selectedBudget = existingBudget.find(budget => budget.id === selectedBudgetId);
        if (selectedBudget) {
            setNewBudget(selectedBudget.name);
            setAmount(selectedBudget.total_amount);
            setNewName(selectedBudget.name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setError('');

        try {
            const response = await api.patch(
                '/budget/',
                { id: budgetID, name: newName, total_amount: amount }
            );

            console.log('New Category created:', response.data);

            if (onSuccess) {
                onSuccess();
            }

        } catch (err) {
            setError(`Failed to edit ${newBudget}. Please try again`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <form onSubmit={handleSubmit}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 'auto',
                        width: '100%',
                        maxWidth: 400,
                        height: 'auto',
                        padding: 3,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <FormGroup sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <FormControl sx={{ marginBottom: 2 }}>
                            <InputLabel>Budget</InputLabel>
                            <Select
                                label="Budget"
                                variant="outlined"
                                value={budgetID}
                                onChange={(e) => handleBudgetChange(e.target.value)}
                                fullWidth
                                required
                            >
                                {existingBudget.map((budgetItem) => (
                                    <MenuItem key={budgetItem.id} value={budgetItem.id}>
                                        {budgetItem.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ marginBottom: 2 }}>
                            <TextField
                                type="Description"
                                label="Description"
                                variant="outlined"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
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

export default BudgetEditForm