import {useEffect, useState} from 'react';
import setAuthToken from './api.token';

interface UseAuth {
    isAuthenticated: boolean;
    setAuthToken: (token: string | null) => void;
    handleLogout: () => void;
}

function useAuth(): UseAuth {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setAuthToken(token);
            setIsAuthenticated(true);
        }
    }, []);

    const handleSetAuthToken = (token: string | null): void => {
        setAuthToken(token);
        setIsAuthenticated(!!token);
    };

    const handleLogout = (): void => {
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
