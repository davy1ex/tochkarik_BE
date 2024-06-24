import React, {FC, useEffect, useState} from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import tzlookup from 'tz-lookup';


import MapComponent from '../../components/Map/MapComponent';
import RadiusSlider from '../../components/Map/Slider/RadiusSlider';
import ManualLocationInput from '../../components/Map/ManualLocation/ManualLocationInput';
import ErrorMessage from '../../components/Map/ErrorMessage/ErrorMessage';
import GeneratedPoint from '../../components/Map/GeneratedPoint/GeneratedPoint';
import BigButton from '../../components/Buttons/BigButton';
import useGeoLocation from '../../components/Map/hooks/useGeoLocation';
import useRandomCoordinates from '../../components/Map/hooks/useRandomCoordinates';

import "./HomePage.css";
import '../../components/Map/Slider/RadiusSlider.css'


const HomePage: FC = () => {
    const [position, setPosition] = useState<[number, number]>([53.242, 50.221]);
    const [radius, setRadius] = useState<number>(1000);
    const [street, setStreet] = useState<string>('');
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
    const [showControls, setShowControls] = useState<boolean>(true);
    const [timeOfGenerate, setTimeOfGenerate] = useState<string>('');
    const [error, setError] = useState<string>('');

    const geoLocation = useGeoLocation(setError);
    const generateRandomCoordinates = useRandomCoordinates();

    const [pointId, setPointId] = useState<number | null>(null)

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
            const [newLatitude, newLongitude] = await generateRandomCoordinates(position, radius);
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
        setTimeOfGenerate('');
        setPointId(null)
    };


    const handleCreateReport = () => {
        // Implement create report logic here
    };

    const handleEditReport = () => {
        // Implement edit report logic here
    };

    return (
        <div className="home-container">
            <MapComponent
                coordinates={markerPosition}
                showRadius={showControls}
                radius={radius}
                centerPosition={position}
            />
            {showControls ? (
                <div className="controls-container">
                    <div className={"controls-container-wrapper"}>
                        {street}
                        <RadiusSlider radius={radius} handleRadiusChange={handleRadiusChange} />
                        <BigButton onClick={handleGenerate}>Generate</BigButton>
                        <ManualLocationInput setPosition={setPosition} setError={setError} />
                        {error && <ErrorMessage message={error} />}
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
                    
                    onCreateReport={handleCreateReport}
                    onEditReport={handleEditReport}
                    coordinates={markerPosition}
                    timeOfGenerate={timeOfGenerate}
                />
            )}
        </div>
    );
};

export default HomePage;
