import {useState, useEffect, useContext} from 'react';
import { TextField, Button, FormGroup, FormControl, Box, Typography} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {AuthContext, api} from "../context/AuthContext";


const BudgetForm = ({ onSuccess }) => {
    const { authTokens } = useContext(AuthContext);
    const [newBudget, setNewBudget] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [existingBudget, setExistingBudget] = useState([]);

    const theme = useTheme();

    useEffect(() => {
        const fetchCategories = async () => {
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

        fetchCategories();
    }, [authTokens]);

    const validateForm = () => {
        if (!newBudget) {
            setError('Please fill in all required fields');
            return false;
        }

        const budgetExists = existingBudget.find(item => item.name === newBudget);
        if (budgetExists) {
            setError('Budget name already exists');
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
            const response = await api.post(
                '/budget/',
                { name: newBudget, total_amount: amount }
            );

            console.log('New Category created:', response.data);

            if (onSuccess) {
                onSuccess();
            }

        } catch (err) {
            setError('Failed to create new category. Please try again');
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
                                type="Description"
                                label="New Budget"
                                variant="outlined"
                                value={newBudget}
                                onChange={(e) => setNewBudget(e.target.value)}
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

export default BudgetForm;