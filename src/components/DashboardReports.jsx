import React, { useState, useEffect, useContext } from "react";
import {
    Box, Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Typography
} from "@mui/material";
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, Rectangle } from "recharts";
import { PieChart, Pie } from "recharts";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import dayjs from "dayjs";
import { AuthContext, api } from "../context/AuthContext";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Divider from "@mui/material/Divider";
import DateRangeFilterForm from "../forms/DateRangeFilterForm";
import ChartDataError from "./ChartDataError";
import AlertHandler from "./AlertHandler";

export default function DashboardReports({ familyView }) {
    const { authTokens } = useContext(AuthContext);
    const [dataMax, setDataMax] = useState(1000);
    const [filteredBarTransactions, setFilteredBarTransactions] = useState([]);
    const [filteredPieTransactions, setFilteredPieTransactions] = useState([]);
    const [rows, setRows] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successAlertOpen, setSuccessAlertOpen] = useState(false);
    const [rowModesModel, setRowModesModel] = useState({});
    const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));

    useEffect(() => {
        const dataPayload = {
            start_date: startDate,
            end_date: endDate,
        };

        const fetchTransactions = async () => {
            try {
                const tableResponse = await api.post('/transaction-table-view/', dataPayload,{
                    params:{
                        familyView : familyView,
                    }
                });
                setRows(tableResponse.data);
            } catch (err) {
                setError('Failed to fetch transactions');
            }
        };

        const fetchBarChartData = async () => {
            try {
                const barChartResponse = await api.post('/transaction-bar-chart/', dataPayload,{
                    params:{
                        familyView : familyView
                    }
                });

                const processedData = barChartResponse.data.map(item => ({
                    ...item,
                    total_amount: parseFloat(item.total_amount)
                }));

                const newDataMax = Math.max(...processedData.map(item => item.total_amount));

                const barChartData = barChartResponse.data.map(item => ({
                    name: item.category,
                    totalAmount: item.total_amount,
                }));

                setDataMax(newDataMax);
                setFilteredBarTransactions(barChartData);
            } catch (err) {
                setError('Failed to fetch Bar Chart Data');
            }
        };

        const fetchPieChartData = async () => {
            try {
                const expenseResponse = await api.post('/transaction-pie-chart/', dataPayload, {
                    params: {
                        familyView: familyView,
                    }
                });

                const pieChartData = expenseResponse.data.map(item => ({
                    name: item.name,
                    value: parseFloat(item.value),
                }));

                setFilteredPieTransactions(pieChartData);
            } catch (err) {
                setError('Failed to fetch Pie Chart Data');
            }
        };

        const fetchData = async () => {
            setIsLoading(true);
            if (!authTokens || !authTokens.access) {
                return;
            }

            await Promise.all([
                fetchTransactions(),
                fetchBarChartData(),
                fetchPieChartData(),
            ])
            setIsLoading(false);
        }

        if (successAlertOpen) {
            fetchData();
        }

        fetchData();
    }, [authTokens, startDate, endDate, familyView, successAlertOpen]);

    const handleStartDateChange = (newValue) => {
        setStartDate(newValue ? newValue.format('YYYY-MM-DD') : null);
    };

    const handleEndDateChange = (newValue) => {
        setEndDate(newValue ? newValue.format('YYYY-MM-DD') : null);
    };

    const handleEditClick = (id) => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: 'edit' } });
    };

    const handleSaveClick = (id) => {
        const updatedRow = rows.find((row) => row.id === id);
        updateRow(updatedRow);
        setRowModesModel({ ...rowModesModel, [id]: { mode: 'view' } });
    };

    const handleCancelClick = (id) => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: 'view' } });
    };

    const handleDeleteClick = async (id) => {
        try {
            await api.delete(`/transaction/${id}`);
            setRows(rows.filter((row) => row.id !== id));
            handleSuccess()
        } catch (err) {
            console.error('Error deleting row:', err);
            setError('Failed to delete row');
        }
    };

    const updateRow = async (row) => {
        try {
            await api.put(`/transaction/${row.id}`, row);
            setRows(rows.map((existingRow) => (existingRow.id === row.id ? row : existingRow)));
            handleSuccess()
        } catch (err) {
            console.error('Error updating row:', err);
            setError('Failed to update row');
        }
    };

    const handleClose = () => {
        setSuccessAlertOpen(false);
    };

    const handleSuccess = () => {
        setSuccessAlertOpen(true);
        setTimeout(() => {
            handleClose();
        }, 5000);
    };

    const columns = [
        { field: 'id', headerName: 'ID' },
        { field: 'date', headerName: 'Date', editable: true },
        { field: 'amount', headerName: 'Amount', editable: true, valueFormatter: (value) => `$${value}`},
        { field: 'transaction_type', headerName: 'Type', editable: true },
        { field: 'description', headerName: 'Description', editable: true },
        { field: 'category', headerName: 'Category', editable: true },
        { field: 'budget', headerName: 'Budget', editable: true },
        { field: 'is_recurring', headerName: 'IsRecurring', editable: true },
        { field: 'next_occurrence', headerName: 'NextOccurrence', editable: true },
        {
            field: 'actions',
            headerName: 'Actions',
            renderCell: (params) => {
                const isInEditMode = rowModesModel[params.id]?.mode === 'edit';
                if (isInEditMode) {
                    return (
                        <>
                            <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={() => handleSaveClick(params.id)} />
                            <GridActionsCellItem icon={<CancelIcon />} label="Cancel" onClick={() => handleCancelClick(params.id)} />
                        </>
                    );
                }
                return (
                    <>
                        <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEditClick(params.id)} />
                        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDeleteClick(params.id)} />
                    </>
                );
            },
        },
    ];

    return (
        <div style={{ height: '100%', width: '75%', padding: '10px' }}>
            <DateRangeFilterForm
                startDate={startDate}
                endDate={endDate}
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
            />
            <Divider sx={{ borderColor: '#1DB954', marginTop: 2, marginBottom: 5 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 3 }}>
                <Box sx={{ width: { xs: '100%', sm: '48%' }, marginBottom: { xs: 3, sm: 0 } }}>
                    <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                        Transaction Bar Chart
                    </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            {filteredBarTransactions && filteredBarTransactions.length > 0 ? (
                                <BarChart data={filteredBarTransactions} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis
                                        type="number"
                                        domain={[0, Math.ceil(dataMax / 1000) * 1000]}
                                        tickCount={10}
                                        tickFormatter={(value) => `$${value.toFixed(0)}`}
                                    />
                                    <Tooltip
                                        formatter={(value) => `$${value}`}
                                    />
                                    <Bar dataKey="totalAmount" fill="#1DB954" activeBar={<Rectangle stroke="#1DB954" />} />
                                </BarChart>
                            ) : (
                                <ChartDataError />
                            )}
                        </ResponsiveContainer>
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                    <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                        Expense Pie Chart
                    </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            {filteredPieTransactions && filteredPieTransactions.length > 0 ? (
                                <PieChart>
                                    <Pie
                                        dataKey="value"
                                        data={filteredPieTransactions}
                                        startAngle={180}
                                        endAngle={0}
                                        cx="50%"
                                        cy="70%"
                                        outerRadius="60%"
                                        fill="#1DB954"
                                        label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                                    />
                                </PieChart>
                            ) : (
                                <ChartDataError />
                            )}
                        </ResponsiveContainer>
                </Box>
            </Box>
            <Divider sx={{ borderColor: '#1DB954', marginTop: 2, marginBottom: 5 }} />
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                Transaction Grid
            </Typography>
            {rows && rows.length > 0 ? (
                <Paper sx={{ height: 350, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        autosizeOnMount={true}
                        checkboxSelection={false}
                        className="GridColumn-hover"
                        sx={{ border: 0 }}
                    />
                </Paper>
            ) : (
                <ChartDataError height={350}/>
            )}
            <Dialog open={successAlertOpen} onClose={handleClose}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <Typography>Success!</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
            {isLoading && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 100,
                        right: 16,
                        zIndex: 1300,
                    }}
                >
                    <CircularProgress color="success" />
                </Box>
            )}
            {error && (
                <AlertHandler alertMessage={error} />
            )}
        </div>
    );
}