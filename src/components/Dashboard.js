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
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardReports from './DashboardReports';
import BudgetTransactionOverview from './BudgetTransactionOverview';
import TransactionTableView from './TransactionTableView';
import TransactionForm from '../forms/TransactionForm';
import CategoryForm from '../forms/CategoryForm';
import BudgetForm from '../forms/BudgetForm';
import FamilyForm from "../forms/FamilyForm";
import AccountOverview from "./AccountOverview";

const drawerWidth = 240;
const actions = [
    { icon: <ReceiptLongIcon />, name: 'Transaction' },
    { icon: <CurrencyExchangeIcon />, name: 'Budget' },
    { icon: <CategoryIcon />, name: 'Category' },
    { icon: <PersonAddIcon />, name: 'Family' },
];

const NAVIGATION = [
    { kind: 'header', title: 'Main items' },
    { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
    { segment: 'budget', title: 'Budget', icon: <ShoppingCartIcon /> },
    { kind: 'divider' },
    { segment: 'reports', title: 'Reports', icon: <BarChartIcon /> },
    { segment: 'reports/transactions', title: 'Transactions', icon: <ReceiptLongIcon /> },
    { segment: 'reports/accounts', title: 'Accounts', icon: <AccountBalanceIcon /> },
    { segment: 'integrations', title: 'Integrations', icon: <LayersIcon /> },
];

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}));

const Dashboard = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentSegment, setCurrentSegment] = useState('dashboard');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [successAlertOpen, setSuccessAlertOpen] = useState(false);
    const navigate = useNavigate();

    const navigateToSegment = (segment) => setCurrentSegment(segment);

    const handleActionClick = (actionName) => {
        setModalType(actionName);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setModalType('');
        setSuccessAlertOpen(false);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleFormSuccess = () => {
        setSuccessAlertOpen(true);
        setTimeout(() => {
            handleClose();
        }, 5000);
    };

    const renderContent = () => {
        switch (currentSegment) {
            case 'dashboard':
                return <DashboardReports />;
            case 'budget':
                return <BudgetTransactionOverview />;
            case 'reports/transactions':
                return <TransactionTableView />;
            case 'reports/accounts':
                return <AccountOverview />;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
            <CssBaseline />
            <MuiAppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, backgroundColor: theme.palette.background.paper }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={() => setDrawerOpen(!drawerOpen)}>
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
                        }}
                    >
                        BudgetBud
                    </Typography>
                    <IconButton onClick={handleClick}>
                        <AccountCircleIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                        <MenuItem onClick={() => { handleCloseMenu(); console.log("Go to Profile"); }}>Profile</MenuItem>
                        <MenuItem onClick={() => { handleCloseMenu(); console.log("Logout"); navigate('/login') }}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </MuiAppBar>
            <Drawer variant="permanent" open={drawerOpen}>
                <List>
                    {NAVIGATION.map((item, index) => (
                        item.kind === 'header' ? (
                            <Typography key={index} variant="subtitle1" sx={{ padding: 2 }}>
                                {item.title}
                            </Typography>
                        ) : item.kind === 'divider' ? (
                            <Box key={index} sx={{ borderBottom: '1px solid black', marginBottom: 2 }} />
                        ) : (
                            <ListItem key={index} disablePadding>
                                    <ListItemButton
                                        onClick={() => {
                                            navigateToSegment(item.segment);
                                        }}
                                        sx={{
                                            backgroundColor: currentSegment === item.segment ? theme.palette.primary.light : 'transparent',
                                            boxShadow: currentSegment === item.segment ? '0px 4px 6px rgba(0, 0, 0, 0.5)' : 'none',
                                            '&:hover': {
                                                backgroundColor: currentSegment === item.segment ? theme.palette.primary.main : theme.palette.action.hover,
                                            },
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                    <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.title} sx={{ opacity: drawerOpen ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        )
                    ))}
                </List>
            </Drawer>
            <Box sx={{ flexGrow: 1, padding: 3, marginTop: 10 }}>
                <Box sx={{ display: "flex", justifyContent: "center", height: "90vh", alignItems: "center" }}>
                    {renderContent()}
                </Box>
                <SpeedDial
                    ariaLabel="SpeedDial"
                    sx={{ position: 'absolute', bottom: 16, right: 16 }}
                    icon={<SpeedDialIcon />}
                >
                    {actions.map((action) => (
                        <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} onClick={() => handleActionClick(action.name)} />
                    ))}
                </SpeedDial>
                <Dialog open={open && modalType === 'Transaction'} onClose={handleClose}>
                    <DialogTitle sx={{ textAlign: 'center' }}>New Transaction</DialogTitle>
                    <DialogContent><TransactionForm onSuccess={handleFormSuccess}/></DialogContent>
                    <DialogActions><Button onClick={handleClose} color="primary">Close</Button></DialogActions>
                </Dialog>
                <Dialog open={open && modalType === 'Budget'} onClose={handleClose}>
                    <DialogTitle sx={{ textAlign: 'center' }}>New Budget</DialogTitle>
                    <DialogContent><BudgetForm onSuccess={handleFormSuccess}/></DialogContent>
                    <DialogActions><Button onClick={handleClose} color="primary">Close</Button></DialogActions>
                </Dialog>
                <Dialog open={open && modalType === 'Category'} onClose={handleClose}>
                    <DialogTitle sx={{ textAlign: 'center' }}>New Category</DialogTitle>
                    <DialogContent><CategoryForm onSuccess={handleFormSuccess}/></DialogContent>
                    <DialogActions><Button onClick={handleClose} color="primary">Close</Button></DialogActions>
                </Dialog>
                <Dialog open={open && modalType === 'Family'} onClose={handleClose}>
                    <DialogTitle sx={{ textAlign: 'center' }}>New Family</DialogTitle>
                    <DialogContent><FamilyForm onSuccess={handleFormSuccess}/></DialogContent>
                    <DialogActions><Button onClick={handleClose} color="primary">Close</Button></DialogActions>
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
            </Box>
        </Box>
    );
};

export default Dashboard;