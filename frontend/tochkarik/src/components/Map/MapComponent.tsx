import React, {useEffect} from 'react';
import {Circle, MapContainer, Marker, TileLayer, useMap} from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

import "./Map.css";

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
    coordinates: [number, number] | null;
    showRadius: boolean;
    radius: number;
    centerPosition: [number, number];
}

/**
 * Renders a map component with the given coordinates, radius, and center position.
 *
 * @param {MapComponentProps} props - The props object containing the following properties:
 *   - coordinates: An array of two numbers representing the latitude and longitude of the coordinates.
 *   - showRadius: A boolean indicating whether to show the radius on the map.
 *   - radius: A number representing the radius of the circle to be drawn on the map.
 *   - centerPosition: An array of two numbers representing the latitude and longitude of the center position.
 * @return {ReactElement} The rendered map component.
 */
const MapComponent: React.FC<MapComponentProps> = ({ coordinates, showRadius, radius, centerPosition }) => {
    const UpdateMapPosition: React.FC<{ position: [number, number] }> = ({ position }) => {
        const map = useMap();

        useEffect(() => {
            if (position) {
                map.setView(position, map.getZoom());
            }
        }, [position, map]);

        return null;
    };

    return (
        <div className="map-component">
            <div className="map-container">
                <MapContainer center={centerPosition} zoom={13}>
                    <TileLayer
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {centerPosition && <UpdateMapPosition position={centerPosition} />}
                    {showRadius && centerPosition && <Circle center={centerPosition} radius={radius} />}
                    {coordinates && <Marker position={coordinates} />}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapComponent;
