import React, {FC} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AuthenticatedRoutes from './AuthenticatedRoutes';
import UnauthenticatedRoutes from './UnauthenticatedRoutes';

import Error401 from '../pages/Errors/Error401.tsx'
import Error404 from '../pages/Errors/Error404.tsx'
import Error501 from '../pages/Errors/Error501.tsx'
import Error502 from '../pages/Errors/Error502.tsx'

interface AppRoutesProps {
    isAuthenticated: boolean;
    setAuthToken: (token: string | null) => void;
    handleLogout: () => void;
}


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
            <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
    );
}

export default AppRoutes;