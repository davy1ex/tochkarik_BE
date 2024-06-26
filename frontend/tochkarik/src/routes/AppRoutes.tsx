import React, {FC} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';

import AuthenticatedRoutes from './AuthenticatedRoutes';
import UnauthenticatedRoutes from './UnauthenticatedRoutes';

import Error401 from '../pages/Errors/Error401'
import Error404 from '../pages/Errors/Error404'
import Error501 from '../pages/Errors/Error501'
import Error502 from '../pages/Errors/Error502'

interface AppRoutesProps {
    isAuthenticated: boolean;
    setAuthToken: (token: string | null) => void;
    handleLogout: () => void;
}

const Logout: FC<{ handleLogout: () => void }> = ({ handleLogout }) => {
    handleLogout();
    return <Navigate to="/login" />;
};

const AppRoutes: FC <AppRoutesProps> = ({ isAuthenticated, setAuthToken, handleLogout }) => {
    return (
        <Routes>
            {isAuthenticated ? (
                    <Route path="*" element={<AuthenticatedRoutes logoutHandler={handleLogout} />} />
                ) : (
                <Route path="*" element={<UnauthenticatedRoutes setAuthToken={setAuthToken} />} />
            )}
            <Route path="/401" element={<Error401 />} />
            <Route path="/404" element={<Error404 />} />
            <Route path="/501" element={<Error501 />} />
            <Route path="/502" element={<Error502 />} />
            <Route path="/logout" element={<Logout handleLogout={handleLogout}/>}/>
            <Route path="*" element={<Navigate to="/404" />} />
            <Route path="/logout" element={<Logout handleLogout={handleLogout} />} />
        </Routes>
    );
}

export default AppRoutes;
