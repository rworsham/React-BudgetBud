import { useState, useEffect, useContext } from 'react';
import { Button, FormGroup, FormControl, Box, Typography, Select, MenuItem, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AuthContext, api } from "../context/AuthContext";

const ReportDashboardEditForm = ({ onSuccess }) => {
    const { authTokens } = useContext(AuthContext);
    const [selectedReport, setSelectedReport] = useState('');
    const [xSize, setXSize] = useState('');
    const [ySize, setYSize] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [reports, setReports] = useState([]);
    const theme = useTheme();

    useEffect(() => {
        const fetchReportChoices = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsLoading(true);
                const response = await api.get('/user/reports/');
                setReports(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching reports:', err);
                setError('Failed to fetch reports');
                setIsLoading(false);
            }
        };

        fetchReportChoices();
    }, [authTokens]);

    useEffect(() => {
        const selected = reports.find((report) => report.id === selectedReport);
        if (selected) {
            setXSize(selected.x_size);
            setYSize(selected.y_size);
        }
    }, [selectedReport, reports]);

    const validateForm = () => {
        if (!selectedReport || !xSize || !ySize) {
            setError('Please fill in all required fields');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setError('');

        try {
            const data = {
                report_id: selectedReport,
                x_size: xSize,
                y_size: ySize,
            };

            const response = await api.patch('/user/reports/', data);
            console.log('Report Added to Dashboard:', response.data);

            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setError('Failed to add Report to Dashboard. Please try again');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <form onSubmit={handleSubmit}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 'auto',
                        width: '100%',
                        minWidth: 300,
                        maxWidth: 400,
                        height: 'auto',
                        padding: 3,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <FormGroup sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

                        <FormControl sx={{ marginBottom: 2 }} fullWidth>
                            <InputLabel id="report-label">Select Report</InputLabel>
                            <Select
                                labelId="report-label"
                                variant="outlined"
                                value={selectedReport}
                                onChange={(e) => setSelectedReport(e.target.value)}
                                label="Select Report"
                                required
                            >
                                {reports.map((report) => (
                                    <MenuItem key={report.id} value={report.id}>
                                        {report.display_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ marginBottom: 2 }} fullWidth>
                            <InputLabel id="x-size-label">Select X Size</InputLabel>
                            <Select
                                labelId="x-size-label"
                                variant="outlined"
                                value={xSize}
                                onChange={(e) => setXSize(e.target.value)}
                                label="Select X Size"
                                required
                            >
                                <MenuItem value="33">Small</MenuItem>
                                <MenuItem value="66">Medium</MenuItem>
                                <MenuItem value="100">Large</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl sx={{ marginBottom: 2 }} fullWidth>
                            <InputLabel id="y-size-label">Select Y Size</InputLabel>
                            <Select
                                labelId="y-size-label"
                                variant="outlined"
                                value={ySize}
                                onChange={(e) => setYSize(e.target.value)}
                                label="Select Y Size"
                                required
                            >
                                <MenuItem value="33">Small</MenuItem>
                                <MenuItem value="66">Medium</MenuItem>
                                <MenuItem value="100">Large</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" type="submit" disabled={isLoading} fullWidth>
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </Button>
                        {error && (
                            <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>
                                {error}
                            </Typography>
                        )}
                    </FormGroup>
                </Box>
            </form>
        </div>
    );
};

export default ReportDashboardEditForm;