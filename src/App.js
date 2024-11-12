import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Contact from './components/Contact';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Header from './components/Header';
import { CssBaseline, Box } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

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
    h1: {
      fontWeight: 700,
      fontSize: '2.2rem',
      color: '#333',
    },
    h2: {
      fontWeight: 600,
      color: '#333',
    },
  },
});

function App() {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Box>
        </Router>
      </ThemeProvider>
  );
}

export default App;