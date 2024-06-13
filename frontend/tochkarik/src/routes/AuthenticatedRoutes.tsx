import {FC} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';

import Header from "../components/Header/Header";

import UserProfile from "../pages/UserProfile/UserProfile"
import HomePage from "../pages/HomePage/HomePage";
import Bookmarks from "../pages/Bookmarks/Bookmarks"

interface AuthenticatedRoutesProps {
    logoutHandler: () => void;
}


const AuthenticatedRoutes: FC<AuthenticatedRoutesProps> = ({ logoutHandler }) => {
    return (
        <>
            <Header user_login={true}/>

            <Routes>
                <Route path="/profile" element={<UserProfile userId={1} logoutHandler={logoutHandler} />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default AuthenticatedRoutes;
