import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const api = axios.create({
    baseURL: 'https://localhost:8000/api/',
});

export const logout = (setAuthTokens, setUser) => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    localStorage.removeItem('user');
};

const setupAxiosInterceptors = (authTokensRef, refreshToken) => {
    api.interceptors.request.use(
        async (config) => {
            if (authTokensRef.current) {
                const expirationTime = JSON.parse(atob(authTokensRef.current.access.split('.')[1])).exp * 1000;
                const currentTime = Date.now();
                if (expirationTime < currentTime) {
                    await refreshToken();
                }
                config.headers['Authorization'] = `Bearer ${authTokensRef.current.access}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response && error.response.status === 401) {
                await refreshToken();
                const newAccessToken = authTokensRef.current.access;
                error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(error.config);
            }
            return Promise.reject(error);
        }
    );
};

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const authTokensRef = useRef(authTokens);
    const refreshingRef = useRef(false);

    const loginUser = async (loginParams) => {
        try {
            const response = await axios.post('https://localhost:8000/api/token/', loginParams);
            setAuthTokens(response.data);
            authTokensRef.current = response.data;
            await getUserDetails(response.data.access);
        } catch (err) {
            console.error('Error during login:', err);
        }
    };

    const refreshToken = useCallback(async () => {
        if (refreshingRef.current || !authTokensRef.current?.refresh) {
            return;
        }

        refreshingRef.current = true;
        const refresh = authTokensRef.current.refresh;
        try {
            const response = await axios.post('https://localhost:8000/api/token/refresh/', { refresh });
            setAuthTokens({
                access: response.data.access,
                refresh: authTokensRef.current.refresh,
            });
            authTokensRef.current = {
                access: response.data.access,
                refresh: authTokensRef.current.refresh,
            };
            await getUserDetails(response.data.access);
        } catch (err) {
            console.error('Error refreshing token:', err);
        } finally {
            refreshingRef.current = false;
        }
    }, []);

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
            setLoading(false);
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

    useEffect(() => {
        if (authTokens) {
            setupAxiosInterceptors(authTokensRef, refreshToken);
        }
    }, [authTokens, refreshToken]);

    const logout = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        localStorage.removeItem('user');
    };

    useEffect(() => {
        if (authTokens) {
            localStorage.setItem('authTokens', JSON.stringify(authTokens));
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('authTokens');
            localStorage.removeItem('user');
        }
    }, [authTokens, user]);

    const contextValue = {
        authTokens,
        user,
        loading,
        loginUser,
        logout,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};