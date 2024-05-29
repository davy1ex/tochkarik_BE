import React from 'react';

import "./HomePage.css"

import Map from '../../components/Map/Map.jsx';  // Импортируйте компонент карты
import BigBtn from "../../components/buttons/Button.jsx";



const HomePage = () => {

    return (
        <div className={"home-container"}>
            <Map/>

            <BigBtn>Generate</BigBtn>
        </div>

    );
};

export default HomePage;
