import React, {useState, useContext} from 'react';
import {TextField, Button, FormGroup, FormControl, Box, Typography, InputAdornment} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {AuthContext, api} from "../context/AuthContext";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import AlertHandler from "../components/AlertHandler";


const BudgetGoalForm = ({ onSuccess, budget_id }) => {
    const { authTokens } = useContext(AuthContext);
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
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
            const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
            const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');
            const response = await api.post('/budget-goal/',
                {
                    budget: budget_id,
                    target_balance: amount,
                    start_date: formattedStartDate,
                    end_date: formattedEndDate
                },
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
                                label="Goal Amount"
                                variant="outlined"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                slotProps={{
                                    input: {
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    },
                                }}
                                fullWidth
                                required
                            />
                        </FormControl>
                        <FormControl sx={{ marginBottom: 2 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Start Date"
                                    value={dayjs(startDate)}
                                    onChange={(startDate) => setStartDate(startDate)}
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
                        <FormControl sx={{ marginBottom: 2 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="End Date"
                                    value={dayjs(endDate)}
                                    onChange={(endDate) => setEndDate(endDate)}
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

export default BudgetGoalForm;