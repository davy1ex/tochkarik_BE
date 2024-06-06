import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import './App.css';
import useAuth from './hooks/useAuth';
import AppRoutes from './routes/AppRoutes';

function App() {
    const { isAuthenticated, setAuthToken, handleLogout } = useAuth();

    return (
        <Router>
            <div className="root-container">
                <AppRoutes
                    isAuthenticated={isAuthenticated}
                    setAuthToken={setAuthToken}
                    handleLogout={handleLogout}
                />
            </div>
        </Router>
    );
}

export default App;
