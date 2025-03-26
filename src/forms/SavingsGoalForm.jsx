import React, {useState, useContext} from 'react';
import { TextField, Button, FormGroup, FormControl, Box, Typography} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {AuthContext, api} from "../context/AuthContext";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import AlertHandler from "../components/AlertHandler";


const SavingsGoalForm = ({ onSuccess, account_id }) => {
    const { authTokens } = useContext(AuthContext);
    const [amount, setAmount] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [error, setError] = useState('');
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
            const response = await api.post('/account/savings-goal/',
                {
                    account: account_id,
                    target_balance: amount,
                    start_date: formattedStartDate,
                    end_date: formattedEndDate
                },
            );

            console.log('New Savings Goal created:', response.data);

            if (onSuccess) {
                onSuccess();
            }

        } catch (err) {
            setError('Failed to create new Savings Goal. Please try again');
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
                                    onChange={(newEndDate) => setEndDate(newEndDate)}
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
                        <Button variant="contained" type="submit" fullWidth>
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

export default SavingsGoalForm;