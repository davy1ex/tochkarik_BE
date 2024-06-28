import React, {FC} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';

import Header from '../components/Header/Header';

import UserProfile from '../pages/UserProfile/UserProfile'
import UserPosts from '../pages/UserPosts/UserPosts'
import Post from '../components/Post/Post'
import HomePage from '../pages/HomePage/HomePage';
import Bookmarks from '../pages/Bookmarks/Bookmarks'
import TestLocationRulesWidget from '../components/LocationRulesWidget/TestGenerationAlgoritmComponent';

import AdminDashboard from "../components/LocationRulesWidget/AdminDashboard";

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
                <Route path="/post" element={ <Post /> } />
                <Route path="/bookmarks" element={<Bookmarks />} />

                <Route path="/generatebyrule" element={<TestLocationRulesWidget/>}/>
                <Route path="/admindashboard" element={<AdminDashboard/>}/>

                <Route path="/logout" logoutHandler/>

                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default AuthenticatedRoutes;
