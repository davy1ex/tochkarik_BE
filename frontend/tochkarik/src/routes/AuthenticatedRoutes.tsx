import React, {FC} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import UserProfile from "../pages/UserProfile/UserProfile"
import HomePage from "../pages/HomePage/HomePage";
import Header from "../components/Header/Header";

interface AuthenticatedRoutesProps {
    logoutHandler: () => void;
}


const AuthenticatedRoutes: FC<AuthenticatedRoutesProps> = ({ logoutHandler }) => {
    return (
        <>
            <Header user_login={true}/>
            <Routes>
                <Route path="/profile" element={<UserProfile userId={1} logoutHandler={logoutHandler} />} />
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default AuthenticatedRoutes;
