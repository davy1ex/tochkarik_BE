import React from 'react';
import AuthenticatedRoutes from './AuthenticatedRoutes';
import UnauthenticatedRoutes from './UnauthenticatedRoutes';

function AppRoutes({ isAuthenticated, setAuthToken, handleLogout }) {
    return (
        <>
            {isAuthenticated ? (
                <AuthenticatedRoutes logoutHandler={handleLogout} />
            ) : (
                <UnauthenticatedRoutes setAuthToken={setAuthToken} />
            )}
        </>
    );
}

export default AppRoutes;
