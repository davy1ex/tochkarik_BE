import axios from 'axios'
import {axiosPublicInstance} from '../../../services/authService';
import moment from 'moment-timezone';
import tzlookup from 'tz-lookup';

const useLocationHandler = () => {
    const generateRandomCoordinates = (
        coordinates_of_local_position: [number, number],
        radius_for_generate: number
    ) => {
        const randomAngle = Math.random() * 2 * Math.PI;
        const randomRadius = Math.random() * radius_for_generate;

        const offsetX = randomRadius * Math.cos(randomAngle);
        const offsetY = randomRadius * Math.sin(randomAngle);

        const earthRadius = 6378137;
        const randomLatitude = coordinates_of_local_position[0] + (offsetY / earthRadius) * (180 / Math.PI);
        const randomLongitude = coordinates_of_local_position[1] + (offsetX / earthRadius) * (180 / Math.PI) / Math.cos(coordinates_of_local_position[0] * Math.PI / 180);

        return [randomLatitude, randomLongitude];
    }

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

    const checkPointsWithinRadius = async (position: [number, number], radius: number, rules: any[]) => {
        try {
            if (!Array.isArray(rules)) {
                throw new Error('Rules should be an array');
            }

            const nearbyRules = rules.filter(rule => {
                const [lat, lng] = rule.coordinates.map(parseFloat);
                console.log([lat, lng]);
                const distance = getDistance(position, [lat, lng]);
                return distance <= radius;
            });
            console.log('check position: ' + position + 'and rules ' + rules)
            console.log('finded nearby: ')
            console.log(nearbyRules)

            return nearbyRules;
        } catch (error) {
            console.error('Error in checkPointsWithinRadius:', error);
            // Дополнительная логика обработки ошибок, если необходимо
            return [];
        }
    };

    const isPointWithinAnyRuleRadius = async (point: [number, number]): Promise<boolean> => {
        const rules = await fetchGenerationRules();
        console.log("isPointWithinAnyRuleRadius")
        console.log(rules)

        if (rules.length === 0)
            return false;

        return rules.some(rule => {
            const [lat, lng] = rule.coordinates.map(parseFloat);
            const distance = getDistance(point, [lat, lng]);
            return distance <= rule.radius;
        });
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

    const getRandomCoordinatesWithPassability = async (position: [number, number], radius: number, maxAttempts: number): Promise<[number, number], boolean> => {
        let isPassable = false;
        let attempts = 0;
        maxAttempts = 10;

        while (!isPassable && attempts < maxAttempts) {
            const newCoordinates = generateRandomCoordinates(position, radius);
            isPassable = checkPassability(newCoordinates);

            if (isPassable) {
                console.log(`Found passable coordinates: ${newCoordinates[0]}, ${newCoordinates[1]}`);
                const rules = await fetchGenerationRules();
                const nearbyRules = await checkPointsWithinRadius(newCoordinates, radius, rules);
                const generatedByRule = nearbyRules.length > 0;
                return {coordinates: newCoordinates, generatedByRule};
            }

            attempts++;
        }

        if (!isPassable) {
            console.warn(`Could not find passable coordinates within ${maxAttempts} attempts.`);
            return { coordinates: position, generatedByRule: false };
        }

        return { coordinates: position, generatedByRule: false };
    }

    const fetchGenerationRules = async () => {
        try {
            const response = await axiosPublicInstance.get('generation_rules');
            return response.data.data;
        } catch (error) {
            console.error('Error finding nearby places:', error);
            return {newPosition: null, generatedByRule: false};
            if (error.response && error.response.status === 404) {
                console.error('Endpoint not found. Please check the URL.');
            }
            return [];
        }
    };

    const getDistance = (point1: [number, number], point2: [number, number]) => {
        const [lat1, lng1] = point1;
        const [lat2, lng2] = point2;
        const earthRadius = 6371000; // meters
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLng = (lng2 - lng1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c; // distance in meters
    };

    return {
        getRandomCoordinatesWithPassability,
        getStreetName,
        getFormattedTime,
        isPointWithinAnyRuleRadius
    };
};

export default useLocationHandler;
