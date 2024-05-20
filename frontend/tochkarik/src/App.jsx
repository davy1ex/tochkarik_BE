import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css'

import Header from './components/Header/Header.jsx'

import HomePage from './pages/HomePage.jsx'
import UserProfile from './pages/UserProfile/UserProfile.jsx';


function App()  {
  return (
      <Router>
          <Header />
          <Routes>
              <Route exact path="/" element={<HomePage />} />
              <Route path="/user/1" element={<UserProfile />} />
          </Routes>
      </Router>
  )
}

export default App