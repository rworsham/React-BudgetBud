import React, {useState, useEffect, useContext} from "react";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import {AuthContext, api} from "../context/AuthContext";



export default function DataTable() {
    const { authTokens } = useContext(AuthContext);
    const [rows, setRows] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const paginationModel = { page: 0, pageSize: 5 };
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'date', headerName: 'Date', width: 100 },
        { field: 'amount', headerName: 'Amount', width: 70 },
        { field: 'transaction_type', headerName: 'Type', width: 130 },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'category', headerName: 'Category', width: 100 },
        { field: 'budget', headerName: 'Budget', width: 100 },
        { field: 'is_recurring', headerName: 'IsRecurring', width: 100 },
        { field: 'next_occurrence', headerName: 'NextOccurrence', width: 100 },
    ];


    useEffect(() => {
        const fetchRows = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsLoading(true);
                const response = await api.get('/transaction/');
                setRows(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        };

        fetchRows();
    }, [authTokens]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Paper sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0 }}
            />
        </Paper>
    );
}