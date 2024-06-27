import axios from 'axios';
import moment from 'moment-timezone';
import tzlookup from 'tz-lookup';

import getNearbyPlaces from "./get.nearby.places";

const useLocationHandler = () => {
    const generateRandomCoordinates = async (center: [number, number], radius: number): Promise<[number, number]> => {
        let coordinates: [number, number] = [0, 0];
        let isPassable = false;

        while (!isPassable) {
            const randomAngle = Math.random() * 2 * Math.PI;
            const randomRadius = Math.random() * radius;

            const offsetX = randomRadius * Math.cos(randomAngle);
            const offsetY = randomRadius * Math.sin(randomAngle);

            const earthRadius = 6378137;
            const newLatitude = center[0] + (offsetY / earthRadius) * (180 / Math.PI);
            const newLongitude = center[1] + (offsetX / earthRadius) * (180 / Math.PI) / Math.cos(center[0] * Math.PI / 180);

            coordinates = [newLatitude, newLongitude];
            isPassable = await checkPassability(coordinates);

            if (isPassable) {
                console.log(`Found passable coordinates: ${newLatitude}, ${newLongitude}`);
            } else {
                console.log(`Generated coordinates are not passable: ${newLatitude}, ${newLongitude}. Regenerating...`);
            }
        }

        return coordinates;
    };

    const checkPassability = async (coordinates: [number, number]): Promise<boolean> => {
        const [lat, lng] = coordinates;
        const overpassQuery = `
        [out:json];
        (
          way(around:50,${lat},${lng})["highway"];
          way(around:50,${lat},${lng})["footway"];
        );
        out body;
        `;

        try {
            const response = await axios.post('https://overpass-api.de/api/interpreter',
                `data=${encodeURIComponent(overpassQuery)}`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            const data = response.data;
            return data.elements && data.elements.length > 0;
        } catch (error) {
            console.error('Error checking passability:', error);
            return false;
        }
    };

    const getStreetName = async (latitude: number, longitude: number): Promise<string> => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?accept-language=ru&format=json&q=${latitude},${longitude}`);
            return response.data[0].display_name;
        } catch (error) {
            console.error('Error fetching street name:', error);
            return '';
        }
    };

    const getFormattedTime = (latitude: number, longitude: number): string => {
        const timeZone = tzlookup(latitude, longitude);
        const zonedTime = moment.tz(new Date(), timeZone);
        return zonedTime.format('YYYY-MM-DD HH:mm:ss');
    };

    const updatePositionWithNearbyPlace = async (position: [number, number], radius: number, locationType: string, setPosition: (pos: [number, number]) => void, setPlaces: (places: any[]) => void): Promise<[number, number] | null> => {
        if (!position) {
            alert('Position not available');
            return { newPosition: null, generatedByRule: false };
        }

        try {
            const nearbyPlaces = await getNearbyPlaces(position[0], position[1], radius, locationType);
            console.log("FINDED RULES POSITION: ", nearbyPlaces[0])
            setPlaces(nearbyPlaces);

            if (nearbyPlaces.length > 0) {
                const place = nearbyPlaces[0];
                const newPosition = place.type === 'node'
                    ? [place.lat, place.lon]
                    : [place.center.lat, place.center.lon];

                setPosition(newPosition);
                return { newPosition, generatedByRule: true };
            } else {
                throw new Error('No nearby places found');
            }
        } catch (error) {
            console.error('Error finding nearby places:', error);
            return { newPosition: null, generatedByRule: false };
        }
    };

    return {
        generateRandomCoordinates,
        getStreetName,
        getFormattedTime,
        updatePositionWithNearbyPlace,
    };
};

export default useLocationHandler;
