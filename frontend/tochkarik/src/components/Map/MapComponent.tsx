import React, {useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";

import "./Map.css";

interface MapComponentProps {
    coordinates: [number, number] | null;
    showRadius: boolean;
    radius: number;
    centerPosition: [number, number];
}

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
