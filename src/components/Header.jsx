import React, { useContext } from 'react';
import { AppBar, Box, Toolbar, Typography, Button, IconButton, MenuItem, Menu } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { authTokens, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={handleClick}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'menu-icon-button',
                        }}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        {authTokens && (
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        )}
                    </Menu>
                    <Typography variant="h6" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }} component={Link} to="/">
                        Budget Bud
                    </Typography>
                    {!authTokens ? (
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                    ) : (
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    )}
                    <Button color="inherit" component={Link} to="/contact">
                        Contact
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}