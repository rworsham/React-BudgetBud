import React, {useState, useEffect, useContext} from 'react';
import { TextField, Button, FormGroup, FormControl, Box, Typography} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {AuthContext, api} from "../context/AuthContext";
import AlertHandler from "../components/AlertHandler";

const FamilyForm = ({ onSuccess }) => {
    const { authTokens } = useContext(AuthContext);
    const [newFamily, setNewFamily] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingFamily, setExistingFamily] = useState([]);

    const theme = useTheme();

    useEffect(() => {
        const fetchFamily = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            const headers = {
                Authorization: `Bearer ${authTokens.access}`,
            };
            try {
                setIsLoading(true);
                const response = await api.get('/family/', {
                    headers
                });
                setExistingFamily(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        };

        if (authTokens) {
            fetchFamily();
        }
    }, [authTokens]);

    const validateForm = () => {
        if (!newFamily) {
            setError('Please fill in all required fields');
            return false;
        }

        if (existingFamily.length > 0) {
            setError('You are already a member of an existing family');
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
            const response = await api.post(
                '/family/create/',
                { name: newFamily },
                {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                }
            );

            console.log('New Family group created:', response.data);

            if (onSuccess) {
                onSuccess();
            }

        } catch (err) {
            setError('Failed to create Family group. Please try again');
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
                                label="New Family Group"
                                variant="outlined"
                                value={newFamily}
                                onChange={(e) => setNewFamily(e.target.value)}
                                fullWidth
                                required
                            />
                        </FormControl>
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

export default FamilyForm;