import React, { useState, useEffect, useContext } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { AuthContext, api } from "../context/AuthContext";
import { Download } from '@mui/icons-material';
import dayjs from 'dayjs';
import { Box, IconButton } from "@mui/material";
import Divider from "@mui/material/Divider";
import DateRangeFilterForm from "../forms/DateRangeFilterForm";
import ChartDataError from "./ChartDataError";

export default function BudgetHistory({budget_id}) {
    const { authTokens } = useContext(AuthContext);
    const [rows, setRows] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [downloadPdf, setDownloadPdf] = useState(false);
    const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));


    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'date', headerName: 'Date', width: 100, editable: false },
        { field: 'amount', headerName: 'Amount', width: 70, editable: false },
        { field: 'transaction_type', headerName: 'Type', width: 130, editable: false },
        { field: 'description', headerName: 'Description', width: 200, editable: false },
        { field: 'category', headerName: 'Category', width: 100, editable: false },
        { field: 'budget', headerName: 'Budget', width: 100, editable: false },
    ]

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
                    budget_id: budget_id
                };

                if (downloadPdf) {
                    dataPayload.format = 'pdf';
                }
                const response = await api.post('/budget-history/', dataPayload, {
                    responseType: downloadPdf ? 'blob' : 'json',
                });

                if (downloadPdf) {
                    const blob = response.data;
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'budget_history_report.pdf';
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
    }, [authTokens, startDate, endDate, budget_id, downloadPdf]);

    const handleStartDateChange = (newValue) => {
        setStartDate(newValue ? newValue.format('YYYY-MM-DD') : null);
    };

    const handleEndDateChange = (newValue) => {
        setEndDate(newValue ? newValue.format('YYYY-MM-DD') : null);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{ height: 'auto', width: 'auto', padding: '10px'}}>
            <DateRangeFilterForm
                startDate={startDate}
                endDate={endDate}
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
            />
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 5}}/>
            <Paper sx={{ height: 'auto', width: '100%', position: 'relative' }}>
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
                {rows && rows.length > 0 ? (
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10]}
                        checkboxSelection
                        className="GridColumn-hover"
                        sx={{ border: 0 }}
                    />
                ) : (
                    <ChartDataError/>
                )}
            </Paper>
        </div>
    );
};
