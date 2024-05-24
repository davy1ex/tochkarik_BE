import React from "react";
import { Navigate, Routes, Route, BrowserRouter } from "react-router-dom";
import RouteGuard from "../RouteGuard.jsx"

//history
import { history } from './history.js';

//pages
import HomePage from "../../pages/HomePage.jsx"
import LoginPage from "../../pages/LoginPage.jsx"
import UserProfile from "../../pages/UserProfile/UserProfile.jsx";


function AppRoutes({ isAuthenticated, setAuthStatus }) {
    return (
        <BrowserRouter >
            <Routes>
                <Route
                    path="/"
                    element={
                        <RouteGuard
                            component={HomePage}
                            isAuthenticated={isAuthenticated}
                        />
                    }
                />
                <Route path="/login" element={<LoginPage setAuthStatus={setAuthStatus} />} />
                <Route
                    path="/profile"
                    element={
                        <RouteGuard
                            component={UserProfile}
                            isAuthenticated={isAuthenticated}
                            userId={1}
                        />
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes