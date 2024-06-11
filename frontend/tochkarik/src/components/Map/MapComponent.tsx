import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet';
import axios from 'axios';

import "leaflet/dist/leaflet.css";

import moment from 'moment-timezone';
import tzlookup from 'tz-lookup';

import RadiusSlider from './Slider/RadiusSlider';
import ManualLocationInput from './ManualLocation/ManualLocationInput';
import ErrorMessage from './ErrorMessage/ErrorMessage';

import useGeoLocation from './hooks/useGeoLocation';
import useRandomCoordinates from './hooks/useRandomCoordinates';
import GeneratedPoint from './GeneratedPoint/GeneratedPoint';
import BigBtn from '../buttons/Button';
import "./Map.css";


const MapComponent: React.FC = () => {
    const [position, setPosition] = useState<[number, number]>([53.242, 50.221]);
    const [radius, setRadius] = useState<number>(1000);
    const [street, setStreet] = useState<string>('');
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
    const [showControls, setShowControls] = useState<boolean>(true);
    const [timeOfGenerate, setTimeOfGenerate] = useState<string | null>(null);
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

    const handleGenerate = async () => {
        if (position) {
            const [newLatitude, newLongitude] = generateRandomCoordinates(position, radius);
            setMarkerPosition([newLatitude, newLongitude]);

            axios.get(`https://nominatim.openstreetmap.org/search?accept-language=ru&format=json&q=${newLatitude} ${newLongitude}`)
                .then(response => {
                    setStreet(response.data[0].display_name);
                });

            setShowControls(false);

            const timeZone = tzlookup(newLatitude, newLongitude);
            const zonedTime = moment.tz(new Date(), timeZone);
            const formattedTime = zonedTime.format('YYYY-MM-DD HH:mm:ss');
            setTimeOfGenerate(formattedTime);
        } else {
            setError('Position not determined. Please enter your location manually.');
        }
    };

    const handleCancel = () => {
        setMarkerPosition(null);
        setShowControls(true);
        setStreet('');
        setTimeOfGenerate(null);
    };

    const handleStartJourney = () => {
        // Implement start journey logic here
    };

    const handleCreateReport = () => {
        // Implement create report logic here
    };

    const handleEditReport = () => {
        // Implement edit report logic here
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
        <div className="map-component">
            <div className="map-container">
                <MapContainer center={position} zoom={13}>
                    <TileLayer
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {position && <UpdateMapPosition position={position} />}
                    {showControls && position && <Circle center={position} radius={radius} />}
                    {markerPosition && <Marker position={markerPosition} />}
                </MapContainer>
            </div>

            {showControls ? (
                <div className="controls-container">
                    <div className={"controls-container-wrapper"}>
                        {street}
                        <RadiusSlider radius={radius} handleRadiusChange={handleRadiusChange} />
                        <BigBtn onClick={handleGenerate}>Generate</BigBtn>
                        <ManualLocationInput setPosition={setPosition} setError={setError} />
                        {error && <ErrorMessage message={error} />}
                    </div>

                </div>
            ) : (
                <GeneratedPoint
                    street={street}
                    pointTitle="Point Generated"
                    isNew={true}
                    hasReport={false}  // Change this based on your logic
                    onCancel={handleCancel}
                    onStartJourney={handleStartJourney}
                    onCreateReport={handleCreateReport}
                    onEditReport={handleEditReport}

                    coordinates={position}
                    timeOfGenerate={timeOfGenerate}
                />
            )}
        </div>
    );
};

export default MapComponent;
