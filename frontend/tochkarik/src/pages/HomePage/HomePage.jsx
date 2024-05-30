import React from 'react';

import "./HomePage.css"

import Map from '../../components/Map/Map.jsx';
import BigBtn from "../../components/buttons/Button.jsx";



const HomePage = () => {
    return (
        <div className={"home-container"}>
            <Map/>
        </div>
    );
};

export default HomePage;
