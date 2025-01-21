import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Paper, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const DateRangeFilterForm = ({ startDate, endDate, handleStartDateChange, handleEndDateChange, handleSubmit }) => {

    const [expanded, setExpanded] = React.useState(true);

    const handleAccordionChange = (event, isExpanded) => {
        setExpanded(isExpanded);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        handleSubmit(event);
    };

    return (
        <Accordion expanded={expanded} onChange={handleAccordionChange}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ fontSize: 30 }} />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
            >
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                    <Paper elevation={8} sx={{ padding: 1, textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            Showing results for {dayjs(startDate).format('MMM D, YYYY')} - {dayjs(endDate).format('MMM D, YYYY')}
                        </Typography>
                    </Paper>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Box sx={{ marginBottom: 1, padding: 1, border: '1px solid #ddd', borderRadius: 2, width: '100%' }}>
                    <form onSubmit={handleFormSubmit}>
                        <Grid container justifyContent="center" alignItems="center" spacing={1}>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', marginRight: 4 }}>
                                    Filter by Date Range
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Start Date"
                                        value={dayjs(startDate)}
                                        onChange={handleStartDateChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                sx={{ margin: 0 }}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="End Date"
                                        value={dayjs(endDate)}
                                        onChange={handleEndDateChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                sx={{ margin: 0 }}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default DateRangeFilterForm;