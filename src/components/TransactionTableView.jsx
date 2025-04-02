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
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography
} from '@mui/material';
import Divider from "@mui/material/Divider";
import DateRangeFilterForm from "../forms/DateRangeFilterForm";
import AlertHandler from "./AlertHandler";

export default function DataTable({ familyView }) {
    const { authTokens } = useContext(AuthContext);
    const [successType, setSuccessType] = useState('');
    const [successAlertOpen, setSuccessAlertOpen] = useState(false);
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
        { field: 'amount', headerName: 'Amount', width: 70, editable: true, valueFormatter: (value) => `$${value}`},
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
                                onClick={() => handleSaveClick(params)}
                            />
                            <GridActionsCellItem
                                icon={<CancelIcon />}
                                label="Cancel"
                                onClick={() => handleCancelClick(params)}
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

    const handleClose = () => {
        setSuccessAlertOpen(false);
    };

    const handleFormSuccess = (successType) => {
        setSuccessAlertOpen(true);
        setSuccessType(successType)
        setTimeout(() => {
            handleClose();
        }, 5000);
    };

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
                        familyView: familyView
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

        const fetchData = async () => {
            await Promise.all([
                fetchTransactions(),
            ]);
        };

        if (successAlertOpen) {
            fetchData();
        }

        fetchData();
    }, [authTokens, startDate, endDate, downloadPdf, familyView, successType, successAlertOpen]);

    const handleStartDateChange = (newValue) => {
        setStartDate(newValue ? newValue.format('YYYY-MM-DD') : null);
    };

    const handleEndDateChange = (newValue) => {
        setEndDate(newValue ? newValue.format('YYYY-MM-DD') : null);
    };

    const handleEditClick = (id) => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: 'edit' } });
    };

    const handleSaveClick = (params) => {
        const updatedRow = { ...params.row };
        setRows(rows.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
        updateRow(updatedRow);
        setRowModesModel({ ...rowModesModel, [params.id]: { mode: 'view' } });
    };

    const handleCancelClick = (params) => {
        setRowModesModel({ ...rowModesModel, [params.id]: { mode: 'view' } });
    };

    const handleDeleteClick = async (id) => {
        try {
            await api.delete(`/transaction/${id}/`);
            setRows(rows.filter((row) => row.id !== id));
            handleFormSuccess('delete');
        } catch (err) {
            console.error('Error deleting row:', err);
            setError('Failed to delete row');
        }
    };

    const updateRow = async (row) => {
        try {
            await api.put(`/transaction/${row.id}/`, row);
            setRows(rows.map((existingRow) => (existingRow.id === row.id ? row : existingRow)));
            handleFormSuccess('update');
        } catch (err) {
            console.error('Error updating row:', err);
            setError('Failed to update row');
        }
    };

    return (
        <div style={{ height: '100%', width: '75%', padding: '10px'}}>
            <DateRangeFilterForm
                startDate={startDate}
                endDate={endDate}
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
            />
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 5}}/>
            <Paper sx={{ height: '65vh' , width: '100%', position: 'relative' }}>
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
                    checkboxSelection={false}
                    autosizeOnMount={true}
                    sx={{ border: 0 }}
                />
            </Paper>
            <Dialog open={successAlertOpen} onClose={handleClose}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <Typography>
                        {successType === 'update' ? 'Transaction Updated!' : 'Transaction Deleted!'}
                    </Typography>
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
};
