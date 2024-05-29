// src/components/Map.jsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css"

import "./Map.css"

const Map = () => {
    const [radius, setRadius] = useState(1000); // Радиус в метрах
    const position = [51.505, -0.09]; // Позиция пользователя (может быть динамической)

    const RadiusSlider = () => {
        const map = useMap();

        const handleRadiusChange = (event) => {
            setRadius(event.target.value);
            map.setView(position, map.getZoom()); // Обновление карты при изменении радиуса
        };

        return (
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
                <input
                    type="range"
                    min="100"
                    max="5000"
                    value={radius}
                    onChange={handleRadiusChange}
                />
                <span>{radius} meters</span>
            </div>
        );
    };

    return (
        <div className="map-container">  {/* Примените класс map-container */}

            <MapContainer center={position} zoom={13}>
                <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
            {/*<Circle center={position} radius={radius} />*/}
            {/*<RadiusSlider />*/}
            </MapContainer>
        </div>
    );
};

export default Map;
