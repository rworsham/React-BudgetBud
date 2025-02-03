import React, { useState, useEffect, useContext } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { AuthContext, api } from "../context/AuthContext";
import { GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { Download } from '@mui/icons-material';
import dayjs from 'dayjs';
import { Box, IconButton } from "@mui/material";
import Divider from "@mui/material/Divider";
import DateRangeFilterForm from "../forms/DateRangeFilterForm";

export default function DataTable() {
    const { authTokens } = useContext(AuthContext);
    const [rows, setRows] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rowModesModel, setRowModesModel] = useState({});
    const [downloadPdf, setDownloadPdf] = useState(false);
    const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));


    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'date', headerName: 'Date', width: 100, editable: true },
        { field: 'amount', headerName: 'Amount', width: 70, editable: true },
        { field: 'transaction_type', headerName: 'Type', width: 130, editable: true },
        { field: 'description', headerName: 'Description', width: 200, editable: true },
        { field: 'category', headerName: 'Category', width: 100, editable: true },
        { field: 'budget', headerName: 'Budget', width: 100, editable: true },
        { field: 'account', headerName: 'Account', width: 100, editable: true },
        { field: 'is_recurring', headerName: 'IsRecurring', width: 100, editable: true },
        { field: 'next_occurrence', headerName: 'NextOccurrence', width: 100, editable: true },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => {
                const isInEditMode = rowModesModel[params.id]?.mode === 'edit';
                if (isInEditMode) {
                    return (
                        <>
                            <GridActionsCellItem
                                icon={<SaveIcon />}
                                label="Save"
                                onClick={() => handleSaveClick(params.id)}
                            />
                            <GridActionsCellItem
                                icon={<CancelIcon />}
                                label="Cancel"
                                onClick={() => handleCancelClick(params.id)}
                            />
                        </>
                    );
                }
                return (
                    <>
                        <GridActionsCellItem
                            icon={<EditIcon />}
                            label="Edit"
                            onClick={() => handleEditClick(params.id)}
                        />
                        <GridActionsCellItem
                            icon={<DeleteIcon />}
                            label="Delete"
                            onClick={() => handleDeleteClick(params.id)}
                        />
                    </>
                );
            },
        },
    ];

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsLoading(true);
                const dataPayload = {
                    start_date: startDate,
                    end_date: endDate,
                };

                if (downloadPdf) {
                    dataPayload.format = 'pdf';
                }
                const response = await api.post('/transaction-table-view/', dataPayload, {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                    },
                    responseType: downloadPdf ? 'blob' : 'json',
                });

                if (downloadPdf) {
                    const blob = response.data;
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'transaction_report.pdf';
                    link.click();
                    setIsLoading(false);
                    setDownloadPdf(false);
                    return;
                }

                setRows(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [authTokens, startDate, endDate, downloadPdf]);

    const handleStartDateChange = (newValue) => {
        setStartDate(newValue ? newValue.format('YYYY-MM-DD') : null);
    };

    const handleEndDateChange = (newValue) => {
        setEndDate(newValue ? newValue.format('YYYY-MM-DD') : null);
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
            const response = await api.post('/transaction-table-view/', {
                start_date: startDate,
                end_date: endDate,
            });
            setRows(response.data);
            setIsLoading(false);
        } catch (err) {
            setError('Failed to fetch data. Please try again');
            setIsLoading(false);
        }
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
            await api.delete(`/transaction/${id}/`);
            setRows(rows.filter((row) => row.id !== id));
        } catch (err) {
            console.error('Error deleting row:', err);
            setError('Failed to delete row');
        }
    };

    const updateRow = async (row) => {
        try {
            await api.put(`/transaction/${row.id}/`, row);
            setRows(rows.map((existingRow) => (existingRow.id === row.id ? row : existingRow)));
        } catch (err) {
            console.error('Error updating row:', err);
            setError('Failed to update row');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{ height: '100%', width: '75%', padding: '10px'}}>
            <DateRangeFilterForm
                startDate={startDate}
                endDate={endDate}
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
            />
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 5}}/>
            <Paper sx={{ height: 400, width: '100%', position: 'relative' }}>
                <Box sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 10
                }}>
                    <IconButton onClick={() => setDownloadPdf(true)} sx={{ color: '#1DB954' }}>
                        <Download />
                    </IconButton>
                </Box>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                    checkboxSelection
                    className="GridColumn-hover"
                    sx={{ border: 0 }}
                />
            </Paper>
        </div>
    );
};
