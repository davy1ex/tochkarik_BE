import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';

import BigBtn from "../buttons/Button.jsx";"../buttons/Button.jsx"

import "leaflet/dist/leaflet.css";
import "./Map.css";

const MapComponent = () => {
    const [radius, setRadius] = useState(1000);
    const position = [51.505, -0.09];

    const handleRadiusChange = (event) => {
        setRadius(event.target.value);
    };


    return (
        <div className="map-container">
            <MapContainer center={position} zoom={13}>
                <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <Circle center={position} radius={radius} />
            </MapContainer>
            <div className="controls-container">
                <input
                    type="range"
                    min="100"
                    max="5000"
                    value={radius}
                    onChange={handleRadiusChange}
                    className="slider"
                />
                <div>
                    <span>{radius} meters</span>
                </div>

                <div>
                <BigBtn>Generate</BigBtn>
                </div>
            </div>
        </div>
    );
};

export default MapComponent;
