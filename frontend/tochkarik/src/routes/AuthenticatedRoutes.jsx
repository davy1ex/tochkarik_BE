import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import UserProfile from "../pages/UserProfile/UserProfile.jsx";
import HomePage from "../pages/HomePage/HomePage.jsx";
import Header from "../components/Header/Header.jsx";

function AuthenticatedRoutes({ logoutHandler }) {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/profile" element={<UserProfile userId={1} logoutHandler={logoutHandler} />} />
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default AuthenticatedRoutes;
