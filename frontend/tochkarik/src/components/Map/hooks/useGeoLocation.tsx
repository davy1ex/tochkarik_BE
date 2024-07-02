import { useState, useEffect } from 'react';

/**
 * Retrieves the user's geolocation and updates the position state accordingly.
 *
 * @param {(error: string) => void} setError - A function to handle errors.
 * @return {[number, number] | null} The current position coordinates or null if unavailable.
 */
const useGeoLocation = (setError: (error: string) => void): [number, number] | null => {
    const [position, setPosition] = useState<[number, number] | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition([latitude, longitude]);
                },
                (error) => {
                    setError('Error detecting location. Please enter your city manually.');
                }
            );
        }
    }, [setError]);

    return position;
};

export default useGeoLocation;
