// src/pages/HomePage.js
import React from 'react';
import sonic from '../../public/sonic.gif'



const HomePage = () => {

    return (
        <div style={{width: 'auto'}}>
            <h3>Welcome to NothingWorked App</h3>
            <img src={sonic} width={'300px'}  alt=""/>
        </div>
    );
};

export default HomePage;
