import {createTheme} from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: '#1DB954',
        },
        secondary: {
            main: '#191414',
        },
        background: {
            default: '#121212',
            paper: '#333333',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#B3B3B3',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
});

export default theme;