import React, {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet';

import BigBtn from "../buttons/Button.jsx";"../buttons/Button.jsx"

import "leaflet/dist/leaflet.css";
import "./Map.css";

import axios from 'axios'

const MapComponent = () => {
    const [radius, setRadius] = useState(1000);

    const [markerPosition, setMarkerPosition] = useState(null);
    const [showCircle, setShowCircle] = useState(true);
    const [showSlider, setShowSlider] = useState(true);

    const [showGenerateBtn, setShowGenerateBtn] = useState(true)
    const [showGenerateNewBtn, setShowGenerateNewBtn] = useState(false)
    const [position, setPosition] = useState([53.242, 50.221]);
    const [locationError, setLocationError] = useState(false);

    const [locationSuccess, setLocationSuccess] = useState(false);
    const [manualLocation, setManualLocation] = useState("");


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


        setShowCircle(false);
        setShowGenerateBtn(false);
        setShowGenerateNewBtn(true);

        setShowSlider(false);
        setMarkerPosition([newLatitude, newLongitude]);

        //
        // console.log(newLatitude, newLongitude)
        //
        // return [newLatitude, newLongitude];
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {

                const {latitude, longitude} = position.coords;
                setPosition([latitude, longitude]);
                setLocationSuccess(true);
            },
            () => {
                setLocationSuccess(false);
                setLocationError(true)
            });
        }
    }, []);

    const handleManualLocationSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${manualLocation}`);
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];

                setPosition([parseFloat(lat), parseFloat(lon)]);
                setLocationSuccess(true);
                setLocationError(false);

            } else {
                alert("Location not found");
            }
        } catch (error) {
            console.error("Error fetching manual location:", error);
            alert("Error fetching location");
        }
    };

    const UpdateMapCenter = ({ position }) => {
        const map = useMap();

        useEffect(() => {
            if (position) {
                map.setView(position);
            }
        }, [position, map]);

        return null;
    };

    const handleGenerateNew = () => {
        setMarkerPosition(null);
        setShowCircle(true);
        setShowGenerateBtn(true);
        setShowGenerateNewBtn(false);
        setShowSlider(true);
    };


    return (
        <div className="map-container">
            <MapContainer center={position} zoom={13}>
                <UpdateMapCenter position={position} />

                <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {showCircle && <Circle center={position} radius={radius} />}
                {markerPosition && <Marker position={markerPosition} />}
            </MapContainer>
            <div className="controls-container">
                {showSlider && (
                    <>
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
                    </>
                )}

                <div>
                    {showGenerateBtn && <BigBtn onClick={() => generateRandomCoordinates(position, radius)}>Generate</BigBtn>}
                    {showGenerateNewBtn && <BigBtn onClick={handleGenerateNew}>Generate new</BigBtn>}
                </div>

                {locationError && (
                    <div className="location-error">
                        <p>Error detecting location. Please enter your city manually.</p>
                    </div>
                )}

                {!locationSuccess && (
                    <form onSubmit={handleManualLocationSubmit} className="manual-location-form">
                        <input
                            type="text"
                            value={manualLocation}
                            onChange={(e) => setManualLocation(e.target.value)}
                            placeholder="Enter city name"
                            required
                        />
                        <BigBtn type="submit">Set Location</BigBtn>
                    </form>
                )}
            </div>
        </div>
    );
};

export default MapComponent;
