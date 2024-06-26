import React, {FC} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';

import Header from '../components/Header/Header';

import UserProfile from '../pages/UserProfile/UserProfile'
import UserPosts from '../pages/Post/UserPosts'
import HomePage from '../pages/HomePage/HomePage';
import Bookmarks from '../pages/Bookmarks/Bookmarks'
import TestLocationRulesWidget from '../components/LocationRulesWidget/TestGenerationAlgoritmComponent';

interface AuthenticatedRoutesProps {
    logoutHandler: () => void;
}


const AuthenticatedRoutes: FC<AuthenticatedRoutesProps> = ({ logoutHandler }) => {
    return (
        <>
            <Header/>

            <Routes>
                <Route path="/profile" element={<UserProfile userId={1} logoutHandler={logoutHandler} />} />
                <Route path="/user_posts" element={ <UserPosts /> } />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/GenerateByRule" element={<TestLocationRulesWidget/>}/>

                <Route path="/logout" logoutHandler/>

                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default AuthenticatedRoutes;
