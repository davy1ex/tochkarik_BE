import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from "../pages/LoginPage.jsx";
import RegistrationPage from "../pages/RegisterPage/RegistrationPage.jsx";

function UnauthenticatedRoutes({ setAuthToken }) {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage setAuthToken={setAuthToken} />} />
            <Route path="/reg" element={<RegistrationPage setAuthToken={setAuthToken} />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default UnauthenticatedRoutes;
