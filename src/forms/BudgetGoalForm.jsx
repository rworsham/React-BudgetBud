import {useState, useContext} from 'react';
import { TextField, Button, FormGroup, FormControl, Box, Typography} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {AuthContext, api} from "../context/AuthContext";


const BudgetGoalForm = ({ onSuccess, budget_id }) => {
    const { authTokens } = useContext(AuthContext);
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const theme = useTheme();


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!authTokens || !authTokens.access) {
            setError('No authorization token found');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await api.post('/budget/savings-goal/',
                { budget: budget_id, target_balance: amount }
            );

            console.log('New Budget Goal created:', response.data);

            if (onSuccess) {
                onSuccess();
            }

        } catch (err) {
            setError('Failed to create new Budget Goal. Please try again');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
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
                    <FormGroup sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
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
                        <Button variant="contained" type="submit" disabled={isLoading} fullWidth>
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                        {error && (
                            <Typography color="error" variant="body2" sx={{marginTop: 2}}>
                                {error}
                            </Typography>
                        )}
                    </FormGroup>
                </Box>
            </form>
        </div>
    );
};

export default BudgetGoalForm;