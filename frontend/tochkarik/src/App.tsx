import {useEffect} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

import useAuth from './hooks/useAuth';
import AppRoutes from './routes/AppRoutes';
import {checkTokenValidity, setAuthToken} from './hooks/axiosConfig'
import './App.css';


function App() {
    const {isAuthenticated, setAuthToken: setAuthTokenInState, handleLogout} = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            const interval = setInterval(async () => {
                const isValid = await checkTokenValidity(handleLogout);
                if (!isValid) {
                    handleLogout();
                }
            }, 5 * 60 * 1000); // every 5 min

            return () => clearInterval(interval); // clear timer on clean element
        }
    }, [isAuthenticated, handleLogout]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthToken(token);
            setAuthTokenInState(token);
        }
    }, [setAuthTokenInState]);

    return (
        <Router>
            <div className="root-container">
                <AppRoutes
                    isAuthenticated={isAuthenticated}
                    setAuthToken={setAuthTokenInState}
                    handleLogout={handleLogout}
                />
            </div>
        </Router>
    );
}

export default App;
