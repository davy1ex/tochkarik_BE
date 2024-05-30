import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker } from 'react-leaflet';

import BigBtn from "../buttons/Button.jsx";"../buttons/Button.jsx"

import "leaflet/dist/leaflet.css";
import "./Map.css";

const MapComponent = () => {
    const [radius, setRadius] = useState(1000);
    let position = [53.242, 50.221];

    const [markerPosition, setMarkerPosition] = useState(null);
    const [showCircle, setShowCircle] = useState(true);


    const handleRadiusChange = (event) => {
        setRadius(event.target.value);
    };


    const generateRandomCoordinates = (center, radius) => {
        const randomAngle = Math.random() * 2 * Math.PI; // Случайный угол в радианах
        const randomRadius = Math.random() * radius; // Случайное расстояние от центра

        const offsetX = randomRadius * Math.cos(randomAngle); // Смещение по оси X
        const offsetY = randomRadius * Math.sin(randomAngle); // Смещение по оси Y

        const earthRadius = 6378137; // Радиус Земли в метрах
        const newLatitude = center[0] + (offsetY / earthRadius) * (180 / Math.PI);
        const newLongitude = center[1] + (offsetX / earthRadius) * (180 / Math.PI) / Math.cos(center[0] * Math.PI / 180);


        setMarkerPosition([newLatitude, newLongitude]);
        setShowCircle(false);

        console.log(newLatitude, newLongitude)

        return [newLatitude, newLongitude];
    };



    return (
        <div className="map-container">
            <MapContainer center={position} zoom={13}>
                <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {showCircle && <Circle center={position} radius={radius} />}
                {markerPosition && <Marker position={markerPosition} />}

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
                    <BigBtn onClick={() => generateRandomCoordinates(position, radius)}>Generate</BigBtn>
                </div>
            </div>
        </div>
    );
};

export default MapComponent;
