import React, {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import Joyride from 'react-joyride';
import {
    Box,
    Button,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    IconButton,
    Menu,
    MenuItem,
    FormGroup, FormControlLabel, Switch, CircularProgress
} from '@mui/material';
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
import ReportDashboard from "./ReportDashboard";
import Profile from './Profile';
import {api, AuthContext} from "../context/AuthContext";

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
    { segment: 'transactions', title: 'Transactions', icon: <ReceiptLongIcon /> },
    { segment: 'accounts', title: 'Accounts', icon: <AccountBalanceIcon /> },
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


const steps = [
    {
        target: '.profile-icon',
        content: 'This is where you can access your profile and logout.',
        placement: 'right-start',
        placementBeacon: 'bottom',
        offset: 10,
    },
    {
        target: '.speed-dial',
        content: 'Use this button to quickly create new transactions, budgets, categories, or family members.',
        placement: 'left',
        offset: 5,
    },
    {
        target: '.nav-dashboard',
        content: 'This is your dashboard, where you can view a summary of your finances.',
        placement: 'right-start',
        offset: 5,
    },
    {
        target: '.nav-budget',
        content: 'Here you can add, view, and manage your budgets.',
        placement: 'right-start',
        offset: 5,
    },
    {
        target: '.nav-reports',
        content: 'Pick from pre-made reports to customize a report dashboard for convenient viewing',
        placement: 'right-start',
        offset: 5,
    },
    {
        target: '.nav-transactions',
        content: 'Here you can view and edit all transactions that have occurred with options to filter by date.',
        placement: 'right-start',
        offset: 5,
    },
    {
        target: '.nav-accounts',
        content: 'Here you can add, view, and manage your accounts.',
        placement: 'right-start',
        offset: 5,
    }
];

const Dashboard = () => {
    const theme = useTheme();
    const { authTokens } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentSegment, setCurrentSegment] = useState('dashboard');
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [successAlertOpen, setSuccessAlertOpen] = useState(false);
    const [runTour, setRunTour] = useState(false);
    const [isFamily, setIsFamily] = useState([]);
    const [isFamilyViewChecked, setIsFamilyViewChecked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setRunTour(true);
    }, []);

    useEffect(() => {
        const fetchFamily = async () => {
            if (!authTokens || !authTokens.access) {
                setError('No authorization token found');
                return;
            }

            try {
                setIsLoading(true);
                const response = await api.get('/family/');

                setIsFamily(response.data);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        };

        fetchFamily();
    }, [authTokens]);

    const navigateToSegment = (segment) => setCurrentSegment(segment);

    const handleFamilyViewChange = (event) => {
        setIsFamilyViewChecked(event.target.checked);
    };

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

    if (error) {
        return <div>{error}</div>;
    }

    const renderContent = () => {
        switch (currentSegment) {
            case 'dashboard':
                return <DashboardReports familyView={isFamilyViewChecked}/>;
            case 'budget':
                return <BudgetTransactionOverview familyView={isFamilyViewChecked}/>;
            case 'reports':
                return <ReportDashboard familyView={isFamilyViewChecked}/>
            case 'transactions':
                return <TransactionTableView familyView={isFamilyViewChecked}/>;
            case 'accounts':
                return <AccountOverview familyView={isFamilyViewChecked}/>;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
            <CssBaseline />
            <MuiAppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, backgroundColor: theme.palette.background.paper }} className={"profile-icon"}>
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
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                        }}
                    >
                        BudgetBud
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {isFamily && isFamily.length > 0 && (
                            <FormGroup>
                                <FormControlLabel
                                    control={<Switch checked={isFamilyViewChecked} onChange={handleFamilyViewChange} />}
                                    label="Family View"
                                />
                            </FormGroup>
                        )}
                        <IconButton onClick={handleClick}>
                            <AccountCircleIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                            <MenuItem onClick={() => { handleActionClick('Profile'); }}>Profile</MenuItem>
                            <MenuItem onClick={() => { handleCloseMenu(); console.log("Logout"); navigate('/login') }}>Logout</MenuItem>
                        </Menu>
                    </Box>
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
                                    className={`nav-${item.segment}`}
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
                    className="speed-dial"
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
                <Dialog open={open && modalType === 'Profile'} onClose={handleClose} maxWidth="lg" fullWidth>
                    <DialogTitle sx={{ textAlign: 'center' }}>User Profile</DialogTitle>
                    <DialogContent><Profile /></DialogContent>
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
            </Box>
            <Joyride
                steps={steps}
                run={runTour}
                continuous
                scrollToFirstStep
                showProgress
                showSkipButton
                callback={(data) => {
                    if (data.status === 'finished' || data.status === 'skipped') {
                        setRunTour(true);
                    }
                }}
            />
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
        </Box>
    );
};

export default Dashboard;