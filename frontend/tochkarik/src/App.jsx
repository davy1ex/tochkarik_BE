import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';

import setAuthToken from './api.token.js'

import LoginPage from "./pages/LoginPage.jsx";
import UserProfile from "./pages/UserProfile/UserProfile.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";

import Header from "./components/Header/Header.jsx";


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // alert(token)
            setAuthToken(token);
            setIsAuthenticated(true);
        }
    }, []);
    const handleSetAuthToken = (token) => {
        setAuthToken(token);
        setIsAuthenticated(!!token);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div className={"root-container"} >
                {isAuthenticated ? (
                    <>
                    <Header />
                    </>
                ):(<></>)}

                    <Routes>
                    {isAuthenticated ? (
                        <>
                            <Route path="/profile" element={<UserProfile userId={1} logoutHandler={handleLogout}/>} />
                            <Route path="/" element={<HomePage/>} />

                            <Route path="*" element={<Navigate to="/" />} />
                        </>
                    ) : (
                        <>
                            <Route path="/login" element={<LoginPage setAuthToken={handleSetAuthToken} />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </>
                    )}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
