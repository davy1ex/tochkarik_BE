import axios from "axios";

const getNearbyPlaces = async (latitude: number, longitude: number, radius: number, type: string) => {
    const overpassQuery = `
        [out:json];
        (
            node["shop"="${type}"](around:${radius},${latitude},${longitude});
            way["shop"="${type}"](around:${radius},${latitude},${longitude});
            relation["shop"="${type}"](around:${radius},${latitude},${longitude});
        );
        out center;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
    const response = await axios.get(url);
    return response.data.elements;
};


export default getNearbyPlaces;