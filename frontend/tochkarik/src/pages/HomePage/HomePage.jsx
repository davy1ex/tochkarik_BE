// src/pages/HomePage.js
import React from 'react';

import "./HomePage.css"

import sonic from '../../../public/sonic.gif'
import logo from '../../assets/logo.svg'



const HomePage = () => {

    return (
        <div className={"home-container"}>
            <h3>Welcome to NothingWorked App</h3>
            <img src={logo} width={'300px'}  alt=""/>
        </div>
    );
};

export default HomePage;
