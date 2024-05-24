// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//
// import './App.css'
//
// import Header from './components/Header/Header.jsx'
//
// import HomePage from './pages/HomePage.jsx'
// import UserProfile from './pages/UserProfile/UserProfile.jsx';
// import LoginForm from "./pages/LoginForm.jsx";
//
//
// function App()  {
//   return (
//       <Router>
//           <Header />
//           <Routes>
//               <Route exact path="/" element={<HomePage />} />
//               <Route path="/profile" element={<UserProfile userId={1}/>} />
//               <Route path="/login" element={<LoginForm/> } />
//
//           </Routes>
//       </Router>
//   )
// }
//
// export default App



// src/App.jsx

import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';

import Header from './components/Header/Header.jsx';

import HomePage from './pages/HomePage.jsx';
import UserProfile from './pages/UserProfile/UserProfile.jsx';
import LoginForm from "./pages/LoginForm.jsx";

import setAuthToken from './api.token.js'
import AppRoutes from './components/route/routes.jsx'

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setAuthToken(token);
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <AppRoutes isAuthenticated={isAuthenticated} setAuthStatus={setIsAuthenticated} />
        // <BrowserRouter>
        //     <Routes>
        //         //страница, для посещения которой авторизация не требуется
        //         <Route path="/login" element={<LoginPage />} />
        //
        //         //страницы, для посещения которых требуется авторизация
        //         <Route path="/profile" element={<PrivateRoute  />}>
        //             <Route path="/:id" element={<UserProfile />} />
        //             {/*<Route path=":id" element={<UserPage />} />*/}
        //         </Route>
        //
        //         <Route path="*" element={<div>404... not found </div>} />
        //     </Routes>
        // </BrowserRouter>



        // <Router>
        //     <Header />
        //     <Routes>
        //         <Route exact path="/" element={<HomePage />} />
        //         <Route
        //             path="/profile"
        //             element={
        //                 isAuthenticated ? (
        //                     <UserProfile userId={1} />
        //                 ) : (
        //                     <Navigate to="/" />
        //                 )
        //             }
        //         />
        //         <Route
        //             path="/login"
        //             element={
        //                 isAuthenticated ? (
        //                     <Navigate to="/" />
        //                 ) : (
        //                     <LoginForm setAuthStatus={setIsAuthenticated} />
        //                 )
        //             }
        //         />
        //     </Routes>
        // </Router>

    );
}

export default App;
