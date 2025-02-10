import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const api = axios.create({
    baseURL: 'https://localhost:8000/api/',
});

let refreshing = false;
let refreshSubscribers = [];

const setupAxiosInterceptors = (authTokensRef, refreshToken) => {
    api.interceptors.request.use(
        async (config) => {
            if (authTokensRef.current) {
                const expirationTime = JSON.parse(atob(authTokensRef.current.access.split('.')[1])).exp * 1000;
                const currentTime = Date.now();
                if (expirationTime < currentTime) {
                    if (!refreshing) {
                        refreshing = true;
                        await refreshToken();
                    }

                    return new Promise((resolve) => {
                        refreshSubscribers.push(() => {
                            config.headers['Authorization'] = `Bearer ${authTokensRef.current.access}`;
                            resolve(config);
                        });
                    });
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
                if (!refreshing) {
                    refreshing = true;
                    await refreshToken();
                }

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

    const loginUser = async (username, password) => {
        try {
            const response = await axios.post('https://localhost:8000/api/token/', { username, password });
            setAuthTokens(response.data);
            authTokensRef.current = response.data;
            await getUserDetails(response.data.access);
        } catch (err) {
            console.error('Error during login:', err);
        }
    };

    const refreshToken = useCallback(async () => {
        const refresh = authTokensRef.current?.refresh;
        console.log('refresh token found step 1', refresh);

        if (!refresh) {
            console.log('No refresh token found, skipping refresh.');
            return;
        }

        if (refreshingRef.current) {
            console.log('Already refreshing, skipping this call.');
            return;
        }

        refreshingRef.current = true;

        try {
            console.log('attempting refresh api call', refresh);
            const response = await axios.post('https://localhost:8000/api/token/refresh/', { refresh });
            console.log('refresh token call complete?', response.data);

            setAuthTokens({
                access: response.data.access,
                refresh: authTokensRef.current.refresh
            });
            authTokensRef.current = {
                access: response.data.access,
                refresh: authTokensRef.current.refresh
            };

            await getUserDetails(response.data.access);

            refreshSubscribers.forEach((callback) => callback());
            refreshSubscribers = [];
        } catch (err) {
            console.error('Error refreshing token:', err);
        } finally {
            refreshingRef.current = false;
            setLoading(false);
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