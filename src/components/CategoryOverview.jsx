import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext, api } from "../context/AuthContext";
import {
    Box, Button, Paper, Typography, Card, CardContent,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList} from 'recharts';
import Divider from "@mui/material/Divider";
import AddBoxIcon from '@mui/icons-material/AddBox';
import {useTheme} from "@mui/material/styles";
import CategoryHistory from "./CategoryHistory";
import CategoryForm from "../forms/CategoryForm";
import AlertHandler from "./AlertHandler";
import dayjs from "dayjs";
import DateRangeFilterForm from "../forms/DateRangeFilterForm";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function CategoryOverview({ familyView }) {
    const theme = useTheme();
    const { authTokens } = useContext(AuthContext);
    const [categoryData, setCategoryData] = useState([]);
    const [categoryHistoryData, setCategoryHistoryData] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [successAlertOpen, setSuccessAlertOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));
    const chartRef = useRef(null);


    const handleOpen = (type) => {
        setModalType(type);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setModalType('');
        setSuccessAlertOpen(false);
        setSelectedCategoryId(null);
    };

    const handleFormSuccess = () => {
        setSuccessAlertOpen(true);
        setTimeout(() => {
            handleClose();
        }, 5000);
    };

    useEffect(() => {
        const dataPayload = {
            start_date: startDate,
            end_date: endDate,
        };


        const fetchCategories = async () => {
            try {
                const response = await api.post('/category/data/', dataPayload, {
                    params: {
                        familyView: familyView
                    },
                });

                setCategoryData(response.data);
            } catch (err) {
                setError('Failed to fetch account data');
            }
        };

        const fetchCategoryHistory = async () => {
            try {
                const response = await api.post(`/category/history/line-chart/`, dataPayload,  {
                    params : {
                        familyView: familyView
                    },
                });

                setCategoryHistoryData(response.data);
            } catch (err) {
                setError('Failed to fetch account history');
            }
        };

        const fetchData = async () => {
            setIsLoading(true);
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            await Promise.all([
                fetchCategories(),
                fetchCategoryHistory(),
            ]);
            setIsLoading(false);
        };

        if (successAlertOpen) {
            fetchData();
        }

        fetchData();
    }, [authTokens, startDate, endDate ,familyView, successAlertOpen]);

    const handleStartDateChange = (newValue) => {
        setStartDate(newValue ? newValue.format('YYYY-MM-DD') : null);
    };

    const handleEndDateChange = (newValue) => {
        setEndDate(newValue ? newValue.format('YYYY-MM-DD') : null);
    };

    const chartData = categoryHistoryData ? categoryHistoryData.map((entry) => ({
        date: entry.date,
        ...entry
    })) : [];

    const downloadAsPDF = () => {
        if (chartRef.current) {
            html2canvas(chartRef.current).then((canvas) => {
                const pdf = new jsPDF('landscape');
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const headerText = `Category Expense ${startDate} - ${endDate}`;
                const headerFontSize = 16;
                pdf.setFontSize(headerFontSize);
                const textWidth = pdf.getStringUnitWidth(headerText) * headerFontSize / pdf.internal.scaleFactor;
                const textX = (pageWidth - textWidth) / 2;
                const textY = 15;
                pdf.text(headerText, textX, textY);
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = pageWidth - 20;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                const chartTopPosition = textY + 10;
                if (chartTopPosition + imgHeight > pageHeight) {
                    pdf.addPage();
                }
                pdf.addImage(imgData, 'PNG', 10, chartTopPosition, imgWidth, imgHeight);
                pdf.save(`Category_Expense_Report_${endDate}.pdf`);
            });
        } else {
            console.error("Chart element not found!");
        }
    };

    return (
        <div style={{ height: '100%', width: '75%', padding: '10px' }}>
            <DateRangeFilterForm
                startDate={startDate}
                endDate={endDate}
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
            />
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 5}}/>
            <Box display="flex" justifyContent="center" alignItems="center" sx={{padding: 2}}>
                <Paper
                    elevation={3}
                    sx={{display: 'flex', alignItems: 'center', padding: '10px 20px',cursor: 'pointer', backgroundColor: '#333333'}}
                    onClick={() => handleOpen('addCategory')}
                >
                    <IconButton edge="start" color="inherit">
                        <AddBoxIcon sx={{ color: theme.palette.primary.main }}/>
                    </IconButton>
                    <Typography variant="button" sx={{ ml: 1 , color: theme.palette.primary.main}}>
                        Add Category
                    </Typography>
                </Paper>
            </Box>
            <Dialog open={open && modalType === 'addCategory'} onClose={handleClose}>
                <DialogTitle sx={{ textAlign: 'center' }}>New Category</DialogTitle>
                <DialogContent>
                    <CategoryForm onSuccess={handleFormSuccess}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={successAlertOpen} onClose={handleClose}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <Typography>Addition Successful!</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
            <Grid display="flex" direction={{ xs: 'column', sm: 'row' }} justifyContent="center" alignItems="center" container spacing={4}>
                {categoryData.map((category) => (
                    <Grid item size={{ xs: 'full', sm: 'grow'}} key={category.id}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" textAlign='center' gutterBottom>
                                    {category.name}
                                </Typography>
                                <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2}}/>
                                <Typography variant="body1" textAlign='center'>
                                    Balance: ${parseFloat(category.balance).toFixed(2)}
                                </Typography>
                                <Grid container spacing={1} sx={{ marginTop: 2, justifyContent: 'center' }}>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => {
                                                setSelectedCategoryId(category.id);
                                                handleOpen('viewHistory');
                                            }}
                                        >
                                            View Category History
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={open && modalType === 'viewHistory'} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle sx={{ textAlign: 'center' }}>Category History</DialogTitle>
                <DialogContent>
                    {selectedCategoryId && <CategoryHistory category_id={selectedCategoryId} familyView={familyView}/>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={successAlertOpen} onClose={handleClose}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <Typography>Addition Successful!</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
            <Divider sx={{borderColor: '#1DB954', marginTop: 2, marginBottom: 2}}/>
            {categoryHistoryData && categoryHistoryData.length > 0 && (
                <Box sx={{ marginTop: 4 }} ref={chartRef}>
                    <Typography variant="h6" textAlign='center' gutterBottom>
                        Category Expense Over Time
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                                formatter={(value) => `$${value}`}
                            />
                            <Legend />
                            {categoryData.map((category) => (
                                <Line
                                    connectNulls
                                    key={category.id}
                                    type="monotone"
                                    dataKey={category.name}
                                    stroke="#1DB954"
                                    activeDot={{ r: 8 }}
                                >
                                    <LabelList dataKey="name" position="top" />
                                </Line>
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            )}
            <Box display="flex" justifyContent="center" alignItems="center" sx={{padding: 2}}>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={downloadAsPDF}
                >
                    Download as PDF
                </Button>
            </Box>
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