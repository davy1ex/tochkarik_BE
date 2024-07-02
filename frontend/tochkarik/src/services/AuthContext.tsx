import {createContext, useContext, useEffect, useState, ReactNode, FC} from 'react';


interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Component that wraps its children with an AuthContext.
 *
 * @param {Object} props - The props object.
 * @param {ReactNode} props.children - The children to be rendered.
 * @return {JSX.Element} The AuthProvider component.
 */
export const AuthProvider: FC<AuthProviderProps> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);  // Set authenticated true if token exists
        }
    }, [localStorage.getItem('token')]);

    const login = (token : string) => {
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

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
