import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import "./Map.css";

import RadiusSlider from '../RadiusSlider.jsx';
import ManualLocationInput from './ManualLocationInput.jsx';
import ErrorMessage from '../ErrorMessage.jsx';

import useGeoLocation from './useGeoLocation.jsx';
import useRandomCoordinates from './useRandomCoordinates.jsx';

import BigBtn from "../../buttons/Button.jsx";

const MapComponent = () => {
    const [position, setPosition] = useState([53.242, 50.221]);
    const [radius, setRadius] = useState(1000);

    const [markerPosition, setMarkerPosition] = useState(null);
    const [showCircle, setShowCircle] = useState(true);

    const [showGenerateBtn, setShowGenerateBtn] = useState(true);
    const [showGenerateNewBtn, setShowGenerateNewBtn] = useState(false);

    const [error, setError] = useState('');

    const geoLocation = useGeoLocation(setError);
    const generateRandomCoordinates = useRandomCoordinates();

    useEffect(() => {
        if (geoLocation) {
            setPosition(geoLocation);
        }
    }, [geoLocation]);

    const handleRadiusChange = (event) => {
        setRadius(event.target.value);
    };

    const handleGenerate = () => {
        if (position) {
            const [newLatitude, newLongitude] = generateRandomCoordinates(position, radius);
            setMarkerPosition([newLatitude, newLongitude]);
            setShowCircle(false);
            setShowGenerateBtn(false);
            setShowGenerateNewBtn(true);
        } else {
            setError('Position not determined. Please enter your location manually.');
        }
    };
    const handleGenerateNew = () => {
        setMarkerPosition(null);
        setShowCircle(true);
        setShowGenerateBtn(true);
        setShowGenerateNewBtn(false);
        setShowSlider(true);
    };

    const UpdateMapPosition = ({ position }) => {
        const map = useMap();

        useEffect(() => {
            if (position) {
                map.setView(position, map.getZoom());
            }
        }, [position, map]);

        return null;
    };

    return (
        <div className="map-container">
            <MapContainer center={position} zoom={13}>
                <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {position && <UpdateMapPosition position={position} />}
                {showCircle && position && <Circle center={position} radius={radius} />}
                {markerPosition && <Marker position={markerPosition} />}
            </MapContainer>
            <div className="controls-container">
                <RadiusSlider radius={radius} handleRadiusChange={handleRadiusChange} />
                <div>
                    {showGenerateBtn && <BigBtn onClick={handleGenerate}>Generate</BigBtn>}
                    {showGenerateNewBtn && <BigBtn onClick={handleGenerateNew}>Generate new</BigBtn>}
                </div>
                {error && <ErrorMessage message={error} />}
                <ManualLocationInput
                    setPosition={setPosition}
                    setError={setError}
                />
            </div>
        </div>
    );
};

export default MapComponent;
