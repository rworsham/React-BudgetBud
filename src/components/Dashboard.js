import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, SpeedDial, SpeedDialAction, SpeedDialIcon, IconButton, Menu, MenuItem } from '@mui/material';
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
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TransactionTableView from './TransactionTableView';
import BudgetTransactionOverview from './BudgetTransactionOverview';
import DashboardReports from './DashboardReports';
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
                segment: 'reports/transactions',
                title: 'Transactions',
                icon: <ReceiptLongIcon />,
            },
            {
                segment: 'reports/accounts',
                title: 'Accounts',
                icon: <AccountBalanceIcon />,
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
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [collapsed, setCollapsed] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const [currentSegment, setCurrentSegment] = useState('dashboard');

    const navigateToSegment = (segment) => {
        setCurrentSegment(segment);
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

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const renderContent = () => {
        switch (currentSegment) {
            case 'dashboard':
                return (
                    <Box sx={{ display: "flex", justifyContent: "center", height: "70vh", alignItems: "center" }}>
                        <DashboardReports />
                    </Box>
                );
            case 'budget':
                return (
                    <Box sx={{ display: "flex", justifyContent: "center", height: "70vh", alignItems: "center", width: '100%' }}>
                        <Box sx={{ width: '100%', maxWidth: 1200 }}>
                            <BudgetTransactionOverview />
                        </Box>
                    </Box>
                );
            case 'reports/transactions':
                return (
                    <Box sx={{ display: "flex", justifyContent: "center", height: "70vh", alignItems: "center" }}>
                        <TransactionTableView />
                    </Box>
                );
            case 'reports/accounts':
                return (
                    <Box sx={{ display: "flex", justifyContent: "center", height: "70vh", alignItems: "center" }}>
                    </Box>
                );
            default:
                return null;
        }
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
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '2rem',
                        background: 'linear-gradient(45deg, #1DB954, #006400)',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        display: 'inline-block',
                        position: 'relative',
                    }}
                >
                    BudgetBud
                </Typography>
                <IconButton onClick={handleClick}>
                    <AccountCircleIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                >
                    <MenuItem onClick={() => { handleCloseMenu(); console.log("Go to Profile"); }}>Profile</MenuItem>
                    <MenuItem onClick={() => { handleCloseMenu(); console.log("Logout"); navigate('/login') }}>Logout</MenuItem>
                </Menu>
            </Box>
            <Box sx={{ display: 'flex', flexGrow: 1}}>
                <Box sx={{
                    width: collapsed ? '5%' : '10%',
                    height: '100%',
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
                                <Typography variant="subtitle1" sx={{ display: collapsed ? 'none' : 'block' }}>
                                    {item.title}
                                </Typography>
                            </Box>
                        ) : item.kind === 'divider' ? (
                            <Box key={index} sx={{ borderBottom: '1px solid #ccc', marginBottom: 2 }} />
                        ) : (
                            <Box key={index}>
                                <Button
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
                                    onClick={() => navigateToSegment(item.segment)}
                                >
                                    {collapsed ? '' : item.title}
                                </Button>

                                {item.children && !collapsed && (
                                    <Box sx={{ paddingLeft: 2 }}>
                                        {item.children.map((child, childIndex) => (
                                            <Button
                                                key={childIndex}
                                                startIcon={child.icon}
                                                sx={{
                                                    textAlign: 'left',
                                                    justifyContent: 'flex-start',
                                                    paddingLeft: collapsed ? 2 : 4,
                                                    marginBottom: 1,
                                                    display: 'flex',
                                                    width: '100%',
                                                    opacity: collapsed ? 0.7 : 1,
                                                }}
                                                onClick={() => navigateToSegment(child.segment)}
                                            >
                                                {collapsed ? '' : child.title}
                                            </Button>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        )
                    ))}
                </Box>
                <Box sx={{ flexGrow: 1, padding: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "center", height: "70vh", alignItems: "center" }}>
                        {renderContent()}
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