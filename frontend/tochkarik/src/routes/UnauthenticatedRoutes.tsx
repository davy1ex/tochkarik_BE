import React, {FC} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';

import LoginPage from "../pages/LoginPage/LoginPage";
import NewHomePage from "../pages/HomePage/NewHomePage";
import RegistrationPage from "../pages/RegisterPage/RegistrationPage";

import Header from "../components/Header/Header";

interface UnauthenticatedRoutesProps {
    setAuthToken: (token: string | null) => void;
}

const UnauthenticatedRoutes: FC<UnauthenticatedRoutesProps> = ({ setAuthToken }) => {
    return (
        <>
            <Header user_login={false} />
            <Routes>
                <Route path="/" element={<NewHomePage />} />
                <Route path="/login" element={<LoginPage setAuthToken={setAuthToken} />} />
                <Route path="/reg" element={<RegistrationPage setAuthToken={setAuthToken} />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </>
    );
}

export default UnauthenticatedRoutes;
