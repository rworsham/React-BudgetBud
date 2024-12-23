import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Home from './components/Home';
import SignUpForm from './forms/SignUpForm';
import Login from './components/Login';
import Logout from './components/Logout';
import Contact from './components/Contact';
import Dashboard from './components/Dashboard';
import theme from './theme';

const App = () => {
  const { authTokens, user, loading, loginUser, logout } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  const PrivateRoute = ({ children }) => {
    return authTokens ? children : <Navigate to="/login" />;
  };

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/SignUp" element={<SignUpForm />} />
              <Route path="/login" element={<Login loginUser={loginUser} />} />
              <Route path="/logout" element={<Logout logout={logout} />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard user={user} /></PrivateRoute>} />
              <Route path="/budget" element={<PrivateRoute></PrivateRoute>} />
              <Route path="/reports" element={<PrivateRoute></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute></PrivateRoute>} />
            </Routes>
          </Box>
        </Router>
      </ThemeProvider>
  );
};

const AppWithProvider = () => {
  return (
      <AuthProvider>
        <App />
      </AuthProvider>
  );
};

export default AppWithProvider;