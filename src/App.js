import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Contact from './components/Contact';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Header from './components/Header';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#F8EDE3',
    },
    secondary: {
      main: '#BDD2B6',
    },
    background: {
      default: '#A2B29F',
      paper: '#798777',
    },
    text: {
      primary: '#333',
      secondary: '#555',
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
        <Router>
          <div>
            <Header />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
  );
}

export default App;