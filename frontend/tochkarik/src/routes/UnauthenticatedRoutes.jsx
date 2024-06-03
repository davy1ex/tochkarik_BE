import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from "../pages/LoginPage/LoginPage.jsx";
import HomePage from "../pages/HomePage/HomePage.jsx";
import RegistrationPage from "../pages/RegisterPage/RegistrationPage.jsx";

import Header from "../pages/../components/Header/Header.jsx"

function UnauthenticatedRoutes({ setAuthToken }) {
    return (
        <>
            <Header user_login={false}/>
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
