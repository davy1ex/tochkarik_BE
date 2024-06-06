const useRandomCoordinates = () => {
    const generateRandomCoordinates = (center: [number, number], radius: number): [number, number] => {
        const randomAngle = Math.random() * 2 * Math.PI;
        const randomRadius = Math.random() * radius;

        const offsetX = randomRadius * Math.cos(randomAngle);
        const offsetY = randomRadius * Math.sin(randomAngle);

        const earthRadius = 6378137;
        const newLatitude = center[0] + (offsetY / earthRadius) * (180 / Math.PI);
        const newLongitude = center[1] + (offsetX / earthRadius) * (180 / Math.PI) / Math.cos(center[0] * Math.PI / 180);

        return [newLatitude, newLongitude];
    };

    return generateRandomCoordinates;
};

export default useRandomCoordinates;
