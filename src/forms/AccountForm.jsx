import {useState, useEffect, useContext} from 'react';
import { TextField, Button, FormGroup, FormControl, Box, Typography} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {AuthContext, api} from "../context/AuthContext";

const AccountForm = ({ onSuccess }) => {
    const { authTokens } = useContext(AuthContext);
    const [newAccount, setNewAccount] = useState('');
    const [newAccountBalance, setNewAccountBalance] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [existingAccounts, setExistingAccounts] = useState([]);

    const theme = useTheme();

    useEffect(() => {
        const fetchAccounts = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            const headers = {
                Authorization: `Bearer ${authTokens.access}`,
            };
            try {
                setIsLoading(true);
                const response = await api.get('/accounts/', {
                    headers
                });
                setExistingAccounts(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        };

        if (authTokens) {
            fetchAccounts();
        }
    }, [authTokens]);

    const validateForm = () => {
        if (!newAccount) {
            setError('Please fill in all required fields');
            return false;
        }

        const AccountExists = existingAccounts.find(item => item.name === newAccount);
        if (AccountExists) {
            setError('Account name already exists');
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
                '/accounts/',
                {
                    name: newAccount,
                    balance: newAccountBalance
                },
                {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                }
            );

            console.log('New Account created:', response.data);

            if (onSuccess) {
                onSuccess();
            }

        } catch (err) {
            setError('Failed to create new Account. Please try again');
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
                                label="New Account"
                                variant="outlined"
                                value={newAccount}
                                onChange={(e) => setNewAccount(e.target.value)}
                                fullWidth
                                required
                            />
                        </FormControl>
                        <FormControl sx={{ marginBottom: 2 }}>
                            <TextField
                                type="number"
                                label="Balance"
                                variant="outlined"
                                value={newAccountBalance}
                                onChange={(e) => setNewAccountBalance(e.target.value)}
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

export default AccountForm;