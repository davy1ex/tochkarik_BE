import { useState, useEffect } from 'react';
import setAuthToken from './api.token.js';

function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setAuthToken(token);
            setIsAuthenticated(true);
        }
    }, []);

    const handleSetAuthToken = (token) => {
        setAuthToken(token);
        setIsAuthenticated(!!token);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setIsAuthenticated(false);
    };

    return {
        isAuthenticated,
        setAuthToken: handleSetAuthToken,
        handleLogout
    };
}

export default useAuth;
