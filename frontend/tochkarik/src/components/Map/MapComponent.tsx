import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet';

import axios from 'axios';

import "leaflet/dist/leaflet.css";

import "./Map.css";

import RadiusSlider from './Slider/RadiusSlider';
import ManualLocationInput from './ManualLocation/ManualLocationInput';
import ErrorMessage from './ErrorMessage/ErrorMessage';

import useGeoLocation from './hooks/useGeoLocation';
import useRandomCoordinates from './hooks/useRandomCoordinates';

import BigBtn from '../buttons/Button';

const MapComponent: React.FC = () => {
    const [position, setPosition] = useState<[number, number]>([53.242, 50.221]);
    const [radius, setRadius] = useState<number>(1000);

    const [street, setStreet] = useState<string>()

    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
    const [showCircle, setShowCircle] = useState<boolean>(true);

    const [showSlider, setShowSlider] = useState<boolean>(true);
    const [showGenerateBtn, setShowGenerateBtn] = useState<boolean>(true);
    const [showGenerateNewBtn, setShowGenerateNewBtn] = useState<boolean>(false);

    const [error, setError] = useState<string>('');


    const geoLocation = useGeoLocation(setError);
    const generateRandomCoordinates = useRandomCoordinates();

    useEffect(() => {
        if (geoLocation) {
            setPosition(geoLocation);
        }
    }, [geoLocation]);

    const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRadius(Number(event.target.value));
    };

    const handleGenerate = () => {
        if (position) {
            const [newLatitude, newLongitude] = generateRandomCoordinates(position, radius);
            setMarkerPosition([newLatitude, newLongitude]);

            axios.get(`https://nominatim.openstreetmap.org/search?accept-language=ru&format=json&q=${newLatitude} ${newLongitude}`)
                .then(response => {
                    console.log(response),
                    setStreet(response.data[0].display_name)
                })

            setShowCircle(false);
            setShowGenerateBtn(false);
            setShowGenerateNewBtn(true);
            setShowSlider(false);
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

    const UpdateMapPosition: React.FC<{ position: [number, number] }> = ({ position }) => {
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
                {street}
                {showSlider && <RadiusSlider radius={radius} handleRadiusChange={handleRadiusChange} />}
                {showGenerateBtn && <BigBtn onClick={handleGenerate}>Generate</BigBtn>}
                {showGenerateNewBtn && <BigBtn onClick={handleGenerateNew}>Cancel Journey</BigBtn>}
                {error && <ErrorMessage message={error} />}
                <ManualLocationInput setPosition={setPosition} setError={setError} />
            </div>
        </div>
    );
};

export default MapComponent;
