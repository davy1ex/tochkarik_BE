import { useState, useEffect } from 'react';

const useGeoLocation = (setError) => {
    const [position, setPosition] = useState([53.242, 50.221]);

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
