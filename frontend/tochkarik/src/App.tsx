import {useEffect} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

import {clearAuthTokens, setAuthToken} from './services/authService'
import {AuthProvider} from './services/AuthContext';

import AppRoutes from './routes/AppRoutes';
import './App.css';


/**
 * Renders the main application component.
 *
 * This component initializes the authentication token from local storage and sets it as an
 * HTTP-only cookie using the `setAuthToken` function. It also defines the `handleLogout`
 * function to clear the authentication token from local storage and the `isAuthenticated`
 * variable to check if a token is present in local storage.
 *
 * The component uses the `AuthProvider` and `Router` components from React Router to provide
 * authentication context and routing functionality. The `AppRoutes` component is passed
 * the `isAuthenticated`, `setAuthToken`, and `handleLogout` functions as props to handle
 * authentication-related logic.
 *
 * @return {JSX.Element} The main application component.
 */
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
