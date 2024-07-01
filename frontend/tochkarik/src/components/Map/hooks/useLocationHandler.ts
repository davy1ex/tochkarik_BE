import axios from 'axios';
import moment from 'moment-timezone';
import tzlookup from 'tz-lookup';

import getNearbyPlaces from "./get.nearby.places";

/**
 * Returns an object with functions for generating random coordinates, getting the street name,
 * getting the formatted time, and updating the position with nearby places.
 *
 * @return {{ generateRandomCoordinates: (center: [number, number], radius: number) => Promise<[number, number]>, getStreetName: (latitude: number, longitude: number) => Promise<string>, getFormattedTime: (latitude: number, longitude: number) => string, updatePositionWithNearbyPlace: (position: [number, number], radius: number, locationType: string | null, setPosition: (pos: [number, number]) => void) => Promise<{ newPosition: [number, number] | null, generatedByRule: boolean }>} }}
 */
const useLocationHandler = () => {
    /**
     * Generates random coordinates within a given radius from a center point.
     *
     * @param {[number, number]} center - The center point of the circle.
     * @param {number} radius - The radius of the circle.
     * @return {Promise<[number, number]>} A Promise that resolves to the generated coordinates.
     */
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

    /**
     * Checks if the given coordinates are passable by checking for any highways or footways within a 50-meter radius.
     *
     * @param {Array<number>} coordinates - The latitude and longitude coordinates to check.
     * @return {Promise<boolean>} A Promise that resolves to true if the coordinates are passable, false otherwise.
     */
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

    /**
     * Retrieves the street name based on the provided latitude and longitude coordinates.
     *
     * @param {number} latitude - The latitude of the location.
     * @param {number} longitude - The longitude of the location.
     * @return {Promise<string>} A promise that resolves to the street name if successful, or an empty string if an error occurs.
     */
    const getStreetName = async (latitude: number, longitude: number): Promise<string> => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?accept-language=ru&format=json&q=${latitude},${longitude}`);
            return response.data[0].display_name;
        } catch (error) {
            console.error('Error fetching street name:', error);
            return '';
        }
    };

    /**
     * A function that retrieves the formatted time based on the provided latitude and longitude coordinates.
     *
     * @param {number} latitude - The latitude coordinate.
     * @param {number} longitude - The longitude coordinate.
     * @return {string} The formatted date and time in 'YYYY-MM-DD HH:mm:ss' format.
     */
    const getFormattedTime = (latitude: number, longitude: number): string => {
        const timeZone = tzlookup(latitude, longitude);
        const zonedTime = moment.tz(new Date(), timeZone);
        return zonedTime.format('YYYY-MM-DD HH:mm:ss');
    };

    /**
     * A function that updates the position based on nearby places.
     *
     * @param {[number, number]} position - The current position coordinates.
     * @param {number} radius - The radius to search for nearby places.
     * @param {string | null} locationType - The type of location to search for.
     * @param {(pos: [number, number]) => void} setPosition - A function to set the new position.
     * @returns {{newPosition: [number, number] | null, generatedByRule: boolean}} An object containing the new position and a flag indicating if it was generated by a rule.
     */
    const updatePositionWithNearbyPlace = async (
        position: [number, number],
        radius: number,
        locationType: string | null,
        setPosition: (pos: [number, number])
    => void) => {
        if (!position || locationType == null) {
            alert('Position not available. Generate in state random mode');
            return {newPosition: null, generatedByRule: false};
        }

        try {
            const nearbyPlaces = await getNearbyPlaces(position[0], position[1], radius, locationType);
            console.log("FINDED RULES POSITION: ", nearbyPlaces[0])

            if (nearbyPlaces.length > 0) {
                const place = nearbyPlaces[0];
                const newPosition = place.type === 'node'
                    ? [place.lat, place.lon]
                    : [place.center.lat, place.center.lon];

                setPosition(newPosition);
                return {newPosition, generatedByRule: true};
            } else {
                throw new Error('No nearby places found');
            }
        } catch (error) {
            console.error('Error finding nearby places:', error);
            return {newPosition: null, generatedByRule: false};
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
