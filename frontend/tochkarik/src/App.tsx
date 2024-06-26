import {useEffect} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

import {clearAuthTokens, setAuthToken} from './services/authService'
import {AuthProvider} from './services/AuthContext';

import AppRoutes from './routes/AppRoutes';
import './App.css';


function App() {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token)
            setAuthToken(token);
    }, [])

    const handleLogout = () => {
        clearAuthTokens();
    }

    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <AuthProvider>
            <Router>
                <div className="root-container">
                    <AppRoutes
                        isAuthenticated={isAuthenticated}
                        setAuthToken={setAuthToken}
                        handleLogout={handleLogout}
                    />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
