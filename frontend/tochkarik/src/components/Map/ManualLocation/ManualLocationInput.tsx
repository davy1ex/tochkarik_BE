import React, {ChangeEvent, useState} from 'react';
import axios from 'axios';

import '../../../components/InputField/InputField.css';
import BigButton from '../../../components/Buttons/BigButton';

import './ManualLocationInput.css';

interface ManualLocationInputProps {
    setPosition: (position: [number, number]) => void;
    setError: (error: string) => void;
}

const ManualLocationInput: React.FC<ManualLocationInputProps> = ({ setPosition, setError }) => {
    const [manualLocation, setManualLocation] = useState<string>('');
    const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);

    const handleManualLocationChange = async (event: ChangeEvent<HTMLInputElement>) => {
        setManualLocation(event.target.value);

        if (event.target.value.length > 2) {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search?accept-language=ru&format=json&q=${event.target.value}`);
                const limitedSuggestions = response.data.slice(0, 3);
                setLocationSuggestions(limitedSuggestions);
            } catch (error) {
                console.error('Error fetching location suggestions:', error);
            }
        } else {
            setLocationSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion: any) => {
        setPosition([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);
        setLocationSuggestions([]);
        setManualLocation('');
        setError('');
    };

    const handleManualLocationSubmit = async () => {
        if (manualLocation) {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search?accept-language=ru&format=json&q=${manualLocation}`);
                if (response.data.length > 0) {
                    setPosition([parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)]);
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
            <div className="manual-location-control">
                <input
                    type="text"
                    value={manualLocation}
                    onChange={handleManualLocationChange}
                    placeholder="Enter city name"
                    className="manual-location-input"
                />
                <BigButton onClick={handleManualLocationSubmit}>Set Location</BigButton>
            </div>
            <div className="search-suggestion-container">
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
        </div>
    );
};

export default ManualLocationInput;
