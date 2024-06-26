import React, {useEffect, useState} from "react";
import axios from "axios";
import moment from 'moment-timezone';
import tzlookup from 'tz-lookup';

import MapComponent from '../Map/MapComponent';
import RadiusSlider from '../../components/Map/Slider/RadiusSlider';
import ManualLocationInput from '../../components/Map/ManualLocation/ManualLocationInput';
import ErrorMessage from '../../components/Map/ErrorMessage/ErrorMessage';
import GeneratedPoint from '../../components/Map/GeneratedPoint/GeneratedPoint';
import useGeoLocation from '../../components/Map/hooks/useGeoLocation';
import useRandomCoordinates from '../Map/hooks/useRandomCoordinates';
import BigButton from "../Buttons/BigButton";
import getNearbyPlaces from './hooks/get.nearby.places';

import "../../pages/HomePage/HomePage.css";

const locationTypes = [
    {value: 'mall', label: 'Mall'},
    {value: 'supermarket', label: 'Supermarket'},
    {value: 'restaurant', label: 'Restaurant'},
    {value: 'park', label: 'Park'},
];

const TestLocationRulesWidget: React.FC = () => {
    const [locationType, setLocationType] = useState('mall'); // "mall" as default type
    const [places, setPlaces] = useState<any[]>([{}]);
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [radius, setRadius] = useState<number>(500);
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
    const [street, setStreet] = useState<string>('');
    const [showControls, setShowControls] = useState<boolean>(true);
    const [timeOfGenerate, setTimeOfGenerate] = useState<string>('');
    const [error, setError] = useState<string>('');

    const geoLocation = useGeoLocation(setError);
    const generateRandomCoordinates = useRandomCoordinates();

    const [pointId, setPointId] = useState<number | null>(null)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const {latitude, longitude} = position.coords;
            setPosition([latitude, longitude]);
        });
    }, []);

    const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRadius(Number(event.target.value));
    };


    const handleGenerate = async () => {
        const maxRetries = 3;
        let attempt = 0;

        if (!position) {
            alert('Position not available');
        }

        while (attempt < maxRetries) {
            try {

                console.log(position)
                console.log("RADIUS NEARBY PLACES", radius)
                const nearbyPlaces = await getNearbyPlaces(position[0], position[1], radius, locationType);
                setPlaces(nearbyPlaces);


                console.log("NEARBY", nearbyPlaces[0]);

                if (nearbyPlaces[0].type === 'node') {
                    setPosition([nearbyPlaces[0].lat, nearbyPlaces[0].lon])
                } else if (nearbyPlaces[0].type === 'way' && nearbyPlaces[0].center) {
                    setPosition([nearbyPlaces[0].center.lat, nearbyPlaces[0].center.lon])

                } else {
                    throw new Error('Unknown place type');
                }


                if (nearbyPlaces[0].lat !== undefined || nearbyPlaces[0].center.lat !== undefined) {
                    console.log("AFFILATION POSITION: ", position);

                    const updatedPosition = nearbyPlaces[0].type === 'node'
                        ? [nearbyPlaces[0].lat, nearbyPlaces[0].lon]
                        : [nearbyPlaces[0].center.lat, nearbyPlaces[0].center.lon];

                    const [newLatitude, newLongitude] = await generateRandomCoordinates(updatedPosition, 100);
                    setMarkerPosition([newLatitude, newLongitude]);

                    const response = await axios.get(`https://nominatim.openstreetmap.org/search?accept-language=ru&format=json&q=${newLatitude},${newLongitude}`);
                    setStreet(response.data[0].display_name);

                    setShowControls(false);

                    const timeZone = tzlookup(newLatitude, newLongitude);
                    const zonedTime = moment.tz(new Date(), timeZone);
                    const formattedTime = zonedTime.format('YYYY-MM-DD HH:mm:ss');
                    setTimeOfGenerate(formattedTime);

                    break;

                }


            } catch (error) {
                console.error('Error generating point:', error);
                attempt++;
            }


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
        <div>
            <h2>Select Location Type</h2>
            {position != null ? (
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

                            onCreateReport={handleCreateReport}
                            onEditReport={handleEditReport}
                            coordinates={position}
                            timeOfGenerate={timeOfGenerate}
                        />
                    )}
                </>) : (<> WAIT </>)}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default TestLocationRulesWidget;



