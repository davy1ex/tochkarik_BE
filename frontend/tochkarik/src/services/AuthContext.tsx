import React, {createContext, useContext, useEffect, useState} from 'react';

const AuthContext = createContext(null);

/**
 * Component that wraps its children with an AuthContext.
 *
 * @param {Object} props - The props object.
 * @param {ReactNode} props.children - The children to be rendered.
 * @return {JSX.Element} The AuthProvider component.
 */
export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);  // Set authenticated true if token exists
        }
    }, [localStorage.getItem('token')]);

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
