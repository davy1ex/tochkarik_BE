import React, {useState} from 'react';

import getNearbyPlaces from './hooks/get.nearby.places'
import MapComponent from '../Map/MapComponent';
import {axiosInstance, setAuthToken} from '../../hooks/axiosConfig'


import GenerationRulesDashboard from "./LocationRulesDashboard";


const locationTypes = [
    {value: 'mall', label: 'Mall'},
    {value: 'supermarket', label: 'Supermarket'},
    {value: 'restaurant', label: 'Restaurant'},
    {value: 'park', label: 'Park'},
    // Добавьте другие типы локаций, если необходимо
];

const LocationRulesWidget: React.FC = () => {
    const [locationType, setLocationType] = useState('mall'); // "mall" as default type
    const [places, setPlaces] = useState<any[]>([]);
    const [center, setCenter] = useState<[number, number]>([53.242, 50.221]);
    const [radius, setRadius] = useState<number>(500);


    const handleSave = async () => {
        const token = localStorage.getItem('token');

        if (token) {
            setAuthToken(token);
        }

        const response = await axiosInstance.post('/generation_rules', {
            name: 'ruleInit',
            rules: {type: [locationType]}
        }).then((response) => {
            console.log(response)
            setLocationType(response.data.data)
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const {latitude, longitude} = position.coords;
                setCenter([latitude, longitude]);

                const places = await getNearbyPlaces(latitude, longitude, radius, locationType);
                setPlaces(places);
                console.log(places)
            });
        }
    };

    return (
        <div>
            <h2>Select Location Type</h2>
            <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
            >
                {locationTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                        {type.label}
                    </option>
                ))}
            </select>
            <GenerationRulesDashboard/>
            <button onClick={handleSave}>Save</button>
            <MapComponent
                coordinates={places.length > 0 ? [places[0].center.lat, places[0].center.lon] : [42, 42]}
                showRadius={true}
                radius={radius}
                centerPosition={center}
                places={places}
            />


        </div>
    );
};

export default LocationRulesWidget;
