import React, {useEffect, useState} from "react";
import MapComponent from '../Map/MapComponent';
import RadiusSlider from '../../components/Map/Slider/RadiusSlider';
import ManualLocationInput from '../../components/Map/ManualLocation/ManualLocationInput';
import ErrorMessage from '../../components/Map/ErrorMessage/ErrorMessage';
import GeneratedPoint from '../../components/Map/GeneratedPoint/GeneratedPoint';
import useGeoLocation from '../../components/Map/hooks/useGeoLocation';
import BigButton from "../Buttons/BigButton";
import useLocationHandler from './hooks/useLocationHandler';

import '../../pages/HomePage/HomePage.css';
import '../../components/Map/Map.css'
import {alignProperty} from "@mui/material/styles/cssUtils";
const locationTypes = [
    {value: 'mall', label: 'Mall'},
    {value: 'supermarket', label: 'Supermarket'},
    {value: 'restaurant', label: 'Restaurant'},
    {value: 'park', label: 'Park'},
];

const TestLocationRulesWidget: React.FC = () => {
    const [locationType, setLocationType] = useState('mall'); // "mall" as default type
    const [places, setPlaces] = useState<any[]>([]);
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [radius, setRadius] = useState<number>(500);
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
    const [street, setStreet] = useState<string>('');
    const [showControls, setShowControls] = useState<boolean>(true);
    const [timeOfGenerate, setTimeOfGenerate] = useState<string>('');
    const [error, setError] = useState<string>('');

    const geoLocation = useGeoLocation(setError);
    const { generateRandomCoordinates, getStreetName, getFormattedTime, updatePositionWithNearbyPlace } = useLocationHandler();

    const [pointId, setPointId] = useState<number | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            setPosition([latitude, longitude]);
        });
    }, []);

    const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRadius(Number(event.target.value));
    };

    const handleGenerate = async () => {
        let newPosition = await updatePositionWithNearbyPlace(position!, radius, locationType, setPosition, setPlaces);
        if (!newPosition) {
            newPosition = position;
        }
        else {
            setRadius(100);
        }

        const [newLatitude, newLongitude] = await generateRandomCoordinates(newPosition!, radius);
        setMarkerPosition([newLatitude, newLongitude]);

        const streetName = await getStreetName(newLatitude, newLongitude);
        setStreet(streetName);

        const formattedTime = getFormattedTime(newLatitude, newLongitude);
        setTimeOfGenerate(formattedTime);

        setShowControls(false);
    };

    const handleCancel = () => {
        setMarkerPosition(null);
        setShowControls(true);
        setStreet('');
        setTimeOfGenerate('');
        setPointId(null);
    };

    return (
        <div className="home-container">
            <h2>AffilArik</h2>
            {position ? (
                <>
                    <MapComponent
                        coordinates={markerPosition}
                        showRadius={true}
                        radius={radius}
                        centerPosition={position}
                    />
                    {showControls ? (
                        <div className="controls-container">
                            <div className={"controls-container-wrapper"}>
                                {street}
                                <RadiusSlider radius={radius} handleRadiusChange={handleRadiusChange}/>
                                <BigButton onClick={handleGenerate}>Generate</BigButton>
                                <ManualLocationInput setPosition={setPosition} setError={setError}/>
                                {error && <ErrorMessage message={error}/>}
                            </div>
                        </div>
                    ) : (
                        <GeneratedPoint
                            pointId={pointId}
                            onSave={(id: number | null) => setPointId(id)}
                            street={street}
                            pointTitle="Point Generated"
                            isNew={true}
                            hasReport={false}  // Change this based on your logic
                            onCancel={handleCancel}
                            onCreateReport={}
                            onEditReport={}
                            coordinates={markerPosition}
                            timeOfGenerate={timeOfGenerate}
                        />
                    )}
                </>
            ) : (
                <>WAIT</>
            )}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default TestLocationRulesWidget;
