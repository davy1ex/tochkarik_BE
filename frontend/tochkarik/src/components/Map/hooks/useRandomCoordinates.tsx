import axios from 'axios';

/**
 * Generates random coordinates within a given radius from a center point,
 * ensuring that the generated coordinates are passable.
 *
 * @param {Array<number>} center - The center coordinates of the radius.
 * @param {number} radius - The radius in meters.
 * @return {Promise<Array<number>>} A Promise that resolves to an array of latitude and longitude coordinates.
 */
const useRandomCoordinates = () => {
    /**
     * Generates random coordinates within a given radius from a center point,
     * ensuring that the generated coordinates are passable.
     *
     * @param {Array<number>} center - The center coordinates of the radius.
     * @param {number} radius - The radius in meters.
     * @return {Promise<Array<number>>} A Promise that resolves to an array of latitude and longitude coordinates.
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
     * Checks the passability of a given set of coordinates.
     *
     * @param {[number, number]} coordinates - The coordinates to check.
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating whether the coordinates are passable.
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
    }
    return generateRandomCoordinates;
}

export default useRandomCoordinates;
