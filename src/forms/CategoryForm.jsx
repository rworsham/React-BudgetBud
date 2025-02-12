import {useState, useEffect, useContext} from 'react';
import { TextField, Button, FormGroup, FormControl, Box, Typography} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {AuthContext, api} from "../context/AuthContext";

const CategoryForm = ({ onSuccess }) => {
    const { authTokens } = useContext(AuthContext);
    const [newCategory, setNewCategory] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingCategory, setExistingCategory] = useState([]);

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
                const response = await api.get('/categories/', {
                    headers
                });
                setExistingCategory(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        };

        if (authTokens) {
            fetchCategories();
        }
    }, [authTokens]);

    const validateForm = () => {
        if (!newCategory) {
            setError('Please fill in all required fields');
            return false;
        }

        const categoryExists = existingCategory.find(item => item.name === newCategory);
        if (categoryExists) {
            setError('Category name already exists');
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
                '/categories/',
                { name: newCategory },
                {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                }
            );

            console.log('New Category created:', response.data);

            if (onSuccess) {
                onSuccess();
            }

        } catch (err) {
            setError('Failed to create new category. Please try again');
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
                                label="New Category"
                                variant="outlined"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
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

export default CategoryForm;