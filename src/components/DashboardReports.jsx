import React, { useState, useEffect, useContext } from "react";
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    TextField,
} from "@mui/material";
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, Rectangle } from "recharts";
import { PieChart, Pie } from "recharts";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { AuthContext, api } from "../context/AuthContext";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

export default function CombinedDashboard() {
    const {authTokens} = useContext(AuthContext);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [rows, setRows] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rowModesModel, setRowModesModel] = useState({});
    const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));

    useEffect(() => {
        const fetchData = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsLoading(true);
                const barChartResponse = await api.post('/transaction-bar-chart/', {
                    params: {
                        start_date: startDate,
                        end_date: endDate
                    }
                });
                const tableResponse = await api.post('/transaction-table-view/', {
                    params: {
                        start_date: startDate,
                        end_date: endDate
                    }
                });

                const barChartData = barChartResponse.data.map(item => ({
                    name: item.category,
                    totalAmount: parseFloat(item.total_amount),
                }));

                setFilteredTransactions(barChartData);
                setRows(tableResponse.data);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        };

        fetchData();
    }, [authTokens, startDate, endDate]);

    const handleStartDateChange = (newValue) => {
        setStartDate(newValue ? newValue.format('YYYY-MM-DD') : null);
    };

    const handleEndDateChange = (newValue) => {
        setEndDate(newValue ? newValue.format('YYYY-MM-DD') : null);
    };

    const handleEditClick = (id) => {
        setRowModesModel({...rowModesModel, [id]: {mode: 'edit'}});
    };

    const handleSaveClick = (id) => {
        const updatedRow = rows.find((row) => row.id === id);
        updateRow(updatedRow);
        setRowModesModel({...rowModesModel, [id]: {mode: 'view'}});
    };

    const handleCancelClick = (id) => {
        setRowModesModel({...rowModesModel, [id]: {mode: 'view'}});
    };

    const handleDeleteClick = async (id) => {
        try {
            await api.delete(`/transaction-table-view/${id}`);
            setRows(rows.filter((row) => row.id !== id));
        } catch (err) {
            console.error('Error deleting row:', err);
            setError('Failed to delete row');
        }
    };

    const updateRow = async (row) => {
        try {
            await api.put(`/transaction-table-view/${row.id}`, row);
            setRows(rows.map((existingRow) => (existingRow.id === row.id ? row : existingRow)));
        } catch (err) {
            console.error('Error updating row:', err);
            setError('Failed to update row');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            setError('Please enter both start and end dates');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const barChartResponse = await api.post('/transaction-bar-chart/', {
                start_date: startDate,
                end_date: endDate
            });
            const tableResponse = await api.post('/transaction-table-view/', {
                start_date: startDate,
                end_date: endDate
            });

            const barChartData = barChartResponse.data.map(item => ({
                name: item.category,
                totalAmount: parseFloat(item.total_amount),
            }));

            setFilteredTransactions(barChartData);
            setRows(tableResponse.data);
            setIsLoading(false);
        } catch (err) {
            setError('Failed to fetch data. Please try again');
            setIsLoading(false);
        }
    };

    const columns = [
        {field: 'id', headerName: 'ID'},
        {field: 'date', headerName: 'Date', editable: true},
        {field: 'amount', headerName: 'Amount', editable: true},
        {field: 'transaction_type', headerName: 'Type', editable: true},
        {field: 'description', headerName: 'Description', editable: true},
        {field: 'category', headerName: 'Category', editable: true},
        {field: 'budget', headerName: 'Budget', editable: true},
        {field: 'is_recurring', headerName: 'IsRecurring', editable: true},
        {field: 'next_occurrence', headerName: 'NextOccurrence', editable: true},
        {
            field: 'actions',
            headerName: 'Actions',
            renderCell: (params) => {
                const isInEditMode = rowModesModel[params.id]?.mode === 'edit';
                if (isInEditMode) {
                    return (
                        <>
                            <GridActionsCellItem icon={<SaveIcon/>} label="Save"
                                                 onClick={() => handleSaveClick(params.id)}/>
                            <GridActionsCellItem icon={<CancelIcon/>} label="Cancel"
                                                 onClick={() => handleCancelClick(params.id)}/>
                        </>
                    );
                }
                return (
                    <>
                        <GridActionsCellItem icon={<EditIcon/>} label="Edit"
                                             onClick={() => handleEditClick(params.id)}/>
                        <GridActionsCellItem icon={<DeleteIcon/>} label="Delete"
                                             onClick={() => handleDeleteClick(params.id)}/>
                    </>
                );
            },
        },
    ];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{height: '100%', padding: '10px'}}>
            <Box sx={{ marginBottom: 1 }}>
                <Paper sx={{ padding: 1, textAlign: 'center' }}>
                    <Typography variant="body2">
                        Showing results
                        for {dayjs(startDate).format('MMM D, YYYY')} - {dayjs(endDate).format('MMM D, YYYY')}
                    </Typography>
                </Paper>
            </Box>
            <Box sx={{ marginBottom: 1, padding: 1, border: '1px solid #ddd', borderRadius: 2 }}>
                <Typography variant="body2" gutterBottom>
                    Filter by Date Range
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Start Date"
                                    value={dayjs(startDate)}
                                    onChange={handleStartDateChange}
                                    renderInput={(params) => <TextField {...params} fullWidth variant="outlined" size="small" />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6} container spacing={1} alignItems="center">
                            <Grid item xs={8}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="End Date"
                                        value={dayjs(endDate)}
                                        onChange={handleEndDateChange}
                                        renderInput={(params) => <TextField {...params} fullWidth variant="outlined" size="small" />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={4} textAlign="right">
                                <Button variant="contained" color="primary" type="submit" size="small">
                                    Apply Date Range
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Box>
            <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 3}}>
                <Box sx={{width: {xs: '100%', sm: '48%'}, marginBottom: {xs: 3, sm: 0}}}>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={filteredTransactions} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <Tooltip/>
                            <Legend formatter={(value) => "Total"}/>
                            <Bar dataKey="totalAmount" fill="#1DB954" activeBar={<Rectangle stroke="#1DB954"/>}/>
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
                <Box sx={{width: {xs: '100%', sm: '48%'}}}>
                    <ResponsiveContainer width="100%" height={250}>
                        {filteredTransactions && filteredTransactions.length > 0 ? (
                            <PieChart>
                                <Pie
                                    dataKey="totalAmount"
                                    data={filteredTransactions}
                                    startAngle={180}
                                    endAngle={0}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius="80%"
                                    fill="#1DB954"
                                    label={({name, value}) => `${name}: $${value.toFixed(2)}`}
                                />
                            </PieChart>
                        ) : (
                            <div>No data available</div>
                        )}
                    </ResponsiveContainer>
                </Box>
            </Box>
            <Paper sx={{height: 350, width: '100%'}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    checkboxSelection
                    className="GridColumn-hover"
                    sx={{border: 0}}
                />
            </Paper>
        </div>
    );
}