import React, {FC} from 'react';

import "./HomePage.css"

import MapComponent from '../../components/Map/MapComponent.tsx';
// import BigBtn from "../../components/buttons/Button.tsx";


const HomePage: FC = () => {
    return (
        <div className={"home-container"}>
            <MapComponent/>
        </div>
    );
};

export default HomePage;
