import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <AppBar position="sticky">
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
                    component={Link} to="/"
                >
                    Budget Bud
                </Typography>

                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/contact">Contact</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;