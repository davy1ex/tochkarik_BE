import React, {ChangeEvent, useState} from 'react';
import axios from 'axios';

import '../../../components/InputField/InputField.css';
import BigButton from '../../../components/Buttons/BigButton';

import './ManualLocationInput.css';

interface ManualLocationInputProps {
    setPosition: (position: [number, number]) => void;
    setError: (error: string) => void;
}

/**
 * Renders a component for manual location input.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.setPosition - Callback function to set the position.
 * @param {Function} props.setError - Callback function to set the error message.
 * @return {JSX.Element} The rendered component.
 */
const ManualLocationInput: React.FC<ManualLocationInputProps> = ({ setPosition, setError }) => {
    const [manualLocation, setManualLocation] = useState<string>('');
    const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);

    /**
     * Updates the manual location state and fetches location suggestions from OpenStreetMap API based on the input value.
     *
     * @param {ChangeEvent<HTMLInputElement>} event - The event object containing the input value.
     * @return {Promise<void>} - A promise that resolves when the function completes.
     */
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

    /**
     * Updates the position, location suggestions, manual location, and error state variables based on the selected suggestion.
     *
     * @param {any} suggestion - The selected suggestion object containing latitude and longitude information.
     * @return {void} - Does not return anything.
     */
    const handleSuggestionClick = (suggestion: any) => {
        setPosition([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);
        setLocationSuggestions([]);
        setManualLocation('');
        setError('');
    };

    /**
     * Asynchronously handles the submission of a manual location.
     * Fetches the latitude and longitude of the location from the OpenStreetMap API
     * and updates the position and error state variables accordingly.
     *
     * @return {Promise<void>} A Promise that resolves when the function completes.
     */
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
