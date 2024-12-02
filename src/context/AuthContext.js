import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const api = axios.create({
    baseURL: 'https://localhost:8000/api/',
});

let refreshing = false;
let refreshSubscribers = [];

const setupAxiosInterceptors = (authTokens, refreshToken) => {
    api.interceptors.request.use(
        async (config) => {
            if (authTokens) {
                const expirationTime = JSON.parse(atob(authTokens.access.split('.')[1])).exp * 1000;
                const currentTime = Date.now();
                if (expirationTime < currentTime) {
                    if (!refreshing) {
                        refreshing = true;
                        await refreshToken();
                    }

                    return new Promise((resolve) => {
                        refreshSubscribers.push(() => {
                            config.headers['Authorization'] = `Bearer ${authTokens.access}`;
                            resolve(config);
                        });
                    });
                }
                config.headers['Authorization'] = `Bearer ${authTokens.access}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response && error.response.status === 401) {
                if (!refreshing) {
                    refreshing = true;
                    await refreshToken();
                }

                const newAccessToken = authTokens.access;
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

    const loginUser = async (username, password) => {
        try {
            const response = await axios.post('https://localhost:8000/api/token/', { username, password });
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
            refreshSubscribers.forEach((callback) => callback());
            refreshSubscribers = [];
        } catch (err) {
            console.error('Error refreshing token:', err);
        } finally {
            refreshing = false;
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

    useEffect(() => {
        if (authTokens) {
            setupAxiosInterceptors(authTokens, refreshToken);
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