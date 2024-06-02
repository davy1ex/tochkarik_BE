import React, { useState } from 'react';
import axios from 'axios';

import '../../../components/InputField/InputField.css'
import BigBtn from "../../buttons/Button.jsx";

const ManualLocationInput = ({ setPosition, setError }) => {
    const [manualLocation, setManualLocation] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState([]);

    const handleManualLocationChange = async (event) => {
        setManualLocation(event.target.value);
        if (event.target.value.length > 2) {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search?accept-language=ru&format=json&q=${event.target.value}`);
                setLocationSuggestions(response.data);
            } catch (error) {
                console.error('Error fetching location suggestions:', error);
            }
        } else {
            setLocationSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setPosition([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);  // Парсинг значений lat и lon
        setLocationSuggestions([]);
        setManualLocation('');
        setError('');

        console.log([parseFloat(suggestion.lat), parseFloat(suggestion.lon)])
    };

    const handleManualLocationSubmit = async () => {
        if (manualLocation) {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search?accept-language=ru&format=json&q=${manualLocation}`);
                if (response.data.length > 0) {
                    setPosition([parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)]);  // Парсинг значений lat и lon
                    setError('');
                } else {
                    setError('Location not found. Please try another city.');
                }
            } catch (error) {
                console.error('Error fetching manual location:', error);
                setError('Error fetching location. Please try again.');
            }
        }
    };

    return (
        <div className="manual-location">
            <input
                type="text"
                value={manualLocation}
                onChange={handleManualLocationChange}
                placeholder="Enter city name"
                className="manual-location-input"
            />
            <BigBtn onClick={handleManualLocationSubmit}>Set Location</BigBtn>
            {locationSuggestions.length > 0 && (
                <ul className="suggestions-list">
                    {locationSuggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ManualLocationInput;
