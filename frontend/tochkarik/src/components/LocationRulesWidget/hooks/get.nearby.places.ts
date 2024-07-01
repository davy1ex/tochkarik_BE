import axios from "axios";

const getNearbyPlaces = async (latitude: number, longitude: number, radius: number, type: string) => {
    let typeQuery = '';
    console.log(type)
    switch(type) {
        case 'mall':
            typeQuery = `node["shop"="mall"](around:${radius},${latitude},${longitude});
                 way["shop"="mall"](around:${radius},${latitude},${longitude});
                 relation["shop"="mall"](around:${radius},${latitude},${longitude});`;
            break;
        case 'supermarket':
            typeQuery = `node["shop"="supermarket"](around:${radius},${latitude},${longitude});
                 way["shop"="supermarket"](around:${radius},${latitude},${longitude});
                 relation["shop"="supermarket"](around:${radius},${latitude},${longitude});`;
            break;
        case 'restaurant':
            typeQuery = `node["amenity"="restaurant"](around:${radius},${latitude},${longitude});
                 way["amenity"="restaurant"](around:${radius},${latitude},${longitude});
                 relation["amenity"="restaurant"](around:${radius},${latitude},${longitude});`;
            break;
        case 'park':
            typeQuery = `node["leisure"="park"](around:${radius},${latitude},${longitude});
                 way["leisure"="park"](around:${radius},${latitude},${longitude});
                 relation["leisure"="park"](around:${radius},${latitude},${longitude});`;
            break;
        default:
            throw new Error('Invalid location type');
    }

    const overpassQuery = `
        [out:json];
        (
            ${typeQuery}
        );
        out center;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
    const response = await axios.get(url);
    return response.data.elements;
};


export default getNearbyPlaces;