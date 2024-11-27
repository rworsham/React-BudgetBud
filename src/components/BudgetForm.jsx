import { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, FormGroup, FormControl, Box, Typography} from '@mui/material';
import { useTheme } from '@mui/material/styles';


const BudgetForm = ({ authTokens }) => {
    const [newBudget, setNewBudget] = useState('');
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

            const headers = {
                Authorization: `Bearer ${authTokens.access}`,
            };

            try {
                setIsLoading(true);
                const response = await axios.get('https://localhost:8000/api/budget/', { headers });
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
            const response = await axios.post('https://localhost:8000/api/budget/', {
                newBudget
            });

            console.log('New Budget created;', response.data);

        } catch (err) {
            setError('Failed to create new Budget. Please try again');
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