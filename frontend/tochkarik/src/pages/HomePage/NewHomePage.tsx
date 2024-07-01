import React, {useEffect, useState} from "react";
import MapComponent from '../Map/MapComponent';
import RadiusSlider from '../../components/Map/Slider/RadiusSlider';
import ManualLocationInput from '../../components/Map/ManualLocation/ManualLocationInput';
import ErrorMessage from '../../components/Map/ErrorMessage/ErrorMessage';
import GeneratedPoint from '../../components/Map/GeneratedPoint/GeneratedPoint';
import BigButton from "../Buttons/BigButton";

import {axiosPublicInstance} from "../../services/authService";

import useLocationHandler from './hooks/useLocationHandler';

import '../../pages/HomePage/HomePage.css';
import '../../components/Map/Map.css'


const TestLocationRulesWidget: React.FC = () => {
    const [locationType, setLocationType] = useState('mall'); // "mall" as default type
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [radius, setRadius] = useState<number>(500);
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
    const [street, setStreet] = useState<string>('');
    const [timeOfGenerate, setTimeOfGenerate] = useState<string>('');
    const [telemetryId, setTelemetryId] = useState<string>(0);

    const [showControls, setShowControls] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

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
        await axiosPublicInstance.get('/generation_rules')
            .then(response => {
                setLocationType(response.data.data[0].rules.type[0]);

            })

        const { newPosition, generatedByRule } = await updatePositionWithNearbyPlace(position!, radius, locationType, setPosition);
        let finalPosition = newPosition
        let radiusForGenerate = radius;
        if (!newPosition) {
            finalPosition = position;
        }
        else {
            radiusForGenerate = 100;
        }

        const [newLatitude, newLongitude] = await generateRandomCoordinates(finalPosition!, radiusForGenerate);
        setMarkerPosition([newLatitude, newLongitude]);

        const streetName = await getStreetName(newLatitude, newLongitude);
        setStreet(streetName);

        const formattedTime = getFormattedTime(newLatitude, newLongitude);
        setTimeOfGenerate(formattedTime);

        setShowControls(false);

        axiosPublicInstance.post('/point_telemetry', {
            name: 'Generated Point',
            coordinates: position,
            timeOfGenerate: formattedTime,
            description: street,
            isVisited: false,
            generatedByRule: generatedByRule
        }).then(response => {
            setTelemetryId(response.data.data.id);
            console.log("RETURNED POINTTELEMETRY: ", response.data.data)
        });
    };

    const handleCreateReport = () => {
        console.log("TRY PUT: ", telemetryId)

        axiosPublicInstance.put(`/point_telemetry/${telemetryId}`, {
            visited: true
        });
    }

    const handleCancel = () => {
        setMarkerPosition(null);
        setShowControls(true);
        setStreet('');
        setTimeOfGenerate('');
        setPointId(null);
    };

    return (
        <div className="home-container">
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
                            onCreateReport={(pointId: number) => handleCreateReport(pointId)}
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
