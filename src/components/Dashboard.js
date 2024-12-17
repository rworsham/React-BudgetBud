import React, { useState } from 'react';
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, SpeedDial, SpeedDialAction, SpeedDialIcon, IconButton } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CategoryIcon from '@mui/icons-material/Category';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TransactionPieChart from './TransactionPieChart';
import TransactionTableView from './TransactionTableView';
import TransactionBarChart from './TransactionBarChart';
import TransactionForm from '../forms/TransactionForm';
import CategoryForm from '../forms/CategoryForm';
import BudgetForm from '../forms/BudgetForm';

const actions = [
    { icon: <ReceiptLongIcon />, name: 'Transaction' },
    { icon: <CurrencyExchangeIcon />, name: 'Budget' },
    { icon: <CategoryIcon />, name: 'Category' },
    { icon: <PersonAddIcon />, name: 'Family' },
];

const NAVIGATION = [
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
    {
        segment: 'budget',
        title: 'Budget',
        icon: <ShoppingCartIcon />,
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'Analytics',
    },
    {
        segment: 'reports',
        title: 'Reports',
        icon: <BarChartIcon />,
        children: [
            {
                segment: 'transactions',
                title: 'Transactions',
                icon: <BarChartIcon />,
            },
            {
                segment: 'expenses',
                title: 'expenses',
                icon: <BarChartIcon />,
            },
        ],
    },
    {
        segment: 'integrations',
        title: 'Integrations',
        icon: <LayersIcon />,
    },
];

const Dashboard = () => {
    const [currentReport, setCurrentReport] = useState("report1");
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [collapsed, setCollapsed] = useState(false);

    const handleReportToggle = (report) => {
        setCurrentReport(report);
    };

    const handleActionClick = (actionName) => {
        setModalType(actionName);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setModalType('');
    };

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 2,
                backgroundColor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}>
                <IconButton onClick={toggleSidebar}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h4">Dashboard</Typography>
                <IconButton>
                    <AccountCircleIcon />
                </IconButton>
            </Box>

            <Box sx={{ display: 'flex', flexGrow: 1 }}>
                <Box sx={{
                    width: collapsed ? 60 : 240,
                    bgcolor: 'background.paper',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingTop: 2,
                    transition: 'width 0.3s ease, opacity 0.3s ease',
                    overflow: 'hidden',
                }}>
                    {NAVIGATION.map((item, index) => (
                        item.kind === 'header' ? (
                            <Box key={index} sx={{ padding: 2, opacity: collapsed ? 0 : 1 }}>
                                <Typography variant="subtitle1" sx={{ display: collapsed ? 'none' : 'block' }}>{item.title}</Typography>
                            </Box>
                        ) : item.kind === 'divider' ? (
                            <Box key={index} sx={{ borderBottom: '1px solid #ccc', marginBottom: 2 }} />
                        ) : (
                            <Button
                                key={index}
                                startIcon={item.icon}
                                sx={{
                                    textAlign: 'left',
                                    justifyContent: 'flex-start',
                                    paddingLeft: collapsed ? 2 : 3,
                                    marginBottom: 2,
                                    display: 'flex',
                                    width: '100%',
                                    opacity: collapsed ? 0.7 : 1,
                                }}
                            >
                                {collapsed ? '' : item.title}
                            </Button>
                        )
                    ))}
                </Box>

                <Box sx={{ flexGrow: 1, padding: 3 }}>
                    <Box display="flex" justifyContent="center" mb={3}>
                        <Button
                            variant={currentReport === "report1" ? "contained" : "outlined"}
                            color="primary"
                            onClick={() => handleReportToggle("report1")}
                            sx={{ marginRight: 2 }}
                        >
                            Transaction Overview
                        </Button>
                        <Button
                            variant={currentReport === "report2" ? "contained" : "outlined"}
                            color="primary"
                            onClick={() => handleReportToggle("report2")}
                            sx={{ marginRight: 2 }}
                        >
                            Transaction Bar Chart
                        </Button>
                        <Button
                            variant={currentReport === "report3" ? "contained" : "outlined"}
                            color="primary"
                            onClick={() => handleReportToggle("report3")}
                        >
                            Transaction Data
                        </Button>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "center", height: "70vh", alignItems: "center" }}>
                        {currentReport === "report1" ? (
                            <TransactionPieChart />
                        ) : currentReport === "report2" ? (
                            <TransactionBarChart />
                        ) : (
                            <TransactionTableView />
                        )}
                    </Box>

                    <SpeedDial
                        ariaLabel="SpeedDial basic example"
                        sx={{ position: 'absolute', bottom: 16, right: 16 }}
                        icon={<SpeedDialIcon />}
                    >
                        {actions.map((action) => (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                onClick={() => handleActionClick(action.name)}
                            />
                        ))}
                    </SpeedDial>

                    <Dialog open={open && modalType === 'Transaction'} onClose={handleClose}>
                        <DialogTitle>New Transaction</DialogTitle>
                        <DialogContent>
                            <TransactionForm />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">Close</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={open && modalType === 'Budget'} onClose={handleClose}>
                        <DialogTitle>Budget Modal</DialogTitle>
                        <DialogContent>
                            <BudgetForm />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">Close</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={open && modalType === 'Category'} onClose={handleClose}>
                        <DialogTitle>Category Modal</DialogTitle>
                        <DialogContent>
                            <CategoryForm />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">Close</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={open && modalType === 'Family'} onClose={handleClose}>
                        <DialogTitle>Family Modal</DialogTitle>
                        <DialogContent>
                            <p>Content related to the Family action goes here.</p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">Close</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;