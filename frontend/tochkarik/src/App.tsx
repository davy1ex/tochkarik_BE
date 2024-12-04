import React, {useEffect} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from './store/store';
import {validateToken} from './store/authAction';
import {clearAuthState} from "./store/authSlice";
import PrivateRoute from './components/routes/PrivateRoute';
import PublicRoute from './components/routes/PublicRoute';

import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import UserProfile from './pages/UserProfile/UserProfile';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import UserPosts from './pages/UserPosts/UserPosts';
import Bookmarks from './pages/Bookmarks/Bookmarks';
import HomePage from './pages/HomePage/HomePage';
import Header from "./components/Header/Header";
import Error401 from "./pages/Errors/Error401";
import Error404 from "./pages/Errors/Error404";
import Error501 from "./pages/Errors/Error501";
import Error502 from "./pages/Errors/Error502";

import './App.css';

function App() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            dispatch(validateToken());
        }
    }, [dispatch, isAuthenticated]);


    return (
        <>
            <Router>
                <div className="root-container">
                    <Header isAuthenticated={isAuthenticated} />
                    <Routes>
                        <Route path="/login"
                               element={<PublicRoute component={LoginPage} isAuthenticated={isAuthenticated}/>}/>
                        <Route path="/reg"
                               element={<PublicRoute component={RegisterPage} isAuthenticated={isAuthenticated}/>}/>

                        <Route path="/profile"
                               element={<PrivateRoute component={UserProfile} isAuthenticated={isAuthenticated}/>}/>
                        <Route path="/admindashboard"
                               element={<PrivateRoute component={AdminDashboard} isAuthenticated={isAuthenticated}/>}/>
                        <Route path="/user_posts"
                               element={<PrivateRoute component={UserPosts} isAuthenticated={isAuthenticated}/>}/>
                        <Route path="/bookmarks"
                               element={<PrivateRoute component={Bookmarks} isAuthenticated={isAuthenticated}/>}/>
                        <Route path="/logout" element={<PrivateRoute component={dispatch(clearAuthState)}
                                                                     isAuthenticated={isAuthenticated}/>}/>

                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/401" element={<Error401/>}/>
                        <Route path="/404" element={<Error404/>}/>
                        <Route path="/501" element={<Error501/>}/>
                        <Route path="/502" element={<Error502/>}/>

                        <Route path="*" element={<Navigate to="/"/>}/>
                    </Routes>
                </div>
            </Router>
        </>

    );
}

export default App;
