import React, { useState, useEffect, useCallback } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Contact from './components/Contact';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Logout from './components/Logout';
import Header from './components/Header';
import { CssBaseline, Box } from '@mui/material';
import axios from 'axios';

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

function App() {
  const [authTokens, setAuthTokens] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginUser = async (username, password) => {
    try {
      const response = await axios.post('https://localhost:8000/api/token/', {
        username,
        password,
      });
      setAuthTokens(response.data);
      await getUserDetails(response.data.access);
    } catch (err) {
      console.error('Error during login:', err);
    }
  };

  const refreshToken = useCallback(async () => {
    if (!authTokens) return;
    try {
      const response = await axios.post('https://localhost:8000/api/token/refresh/', {
        refresh: authTokens.refresh,
      });
      setAuthTokens(response.data);
      await getUserDetails(response.data.access);
    } catch (err) {
      console.error('Error refreshing token:', err);
    }
  }, [authTokens]);

  const getUserDetails = async (accessToken) => {
    try {
      const response = await axios.get('https://localhost:8000/api/user/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  useEffect(() => {
    if (authTokens) {
      const expirationTime = JSON.parse(atob(authTokens.access.split('.')[1])).exp * 1000;
      const currentTime = Date.now();
      if (expirationTime < currentTime) {
        refreshToken();
      } else {
        getUserDetails(authTokens.access);
      }
    } else {
      setLoading(false);
    }
  }, [authTokens, refreshToken]);

  const PrivateRoute = ({ children }) => {
    return authTokens ? children : <Navigate to="/login" />;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login loginUser={loginUser} />} />
              <Route path="/logout" element={<Logout setAuthTokens={setAuthTokens} />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard user={user} authTokens={authTokens} /></PrivateRoute>} />
            </Routes>
          </Box>
        </Router>
      </ThemeProvider>
  );
}

export default App;