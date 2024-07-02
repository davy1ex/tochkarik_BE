import React, {FC} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';

import LoginPage from "../pages/LoginPage/LoginPage";
import HomePage from "../pages/HomePage/HomePage";
import RegistrationPage from "../pages/RegisterPage/RegistrationPage";

import Header from "../components/Header/Header";

interface UnauthenticatedRoutesProps {
    setAuthToken: (token: string | null) => void;
}

/**
 * Renders the routes for unauthenticated users.
 *
 * @param {FC<UnauthenticatedRoutesProps>} setAuthToken - Function to set authentication token.
 * @return {ReactElement} The rendered routes for unauthenticated users.
 */
const UnauthenticatedRoutes: FC<UnauthenticatedRoutesProps> = ({ setAuthToken }) => {
    return (
        <>
            <Header user_login={false} />
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/login" element={<LoginPage setAuthToken={setAuthToken} />} />
                <Route path="/reg" element={<RegistrationPage setAuthToken={setAuthToken} />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </>
    );
}

export default UnauthenticatedRoutes;
