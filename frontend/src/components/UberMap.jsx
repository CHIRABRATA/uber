import React, { useState, useEffect, memo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fallback coordinates: Central Kolkata/Salt Lake area in Array format [lat, lng]
const fallbackCenter = [22.5726, 88.3639];

// Create a custom blue pulsing marker icon mimicking Uber's style
const userIcon = L.divIcon({
  className: 'custom-user-marker',
  html: `
    <div style="
      width: 16px; height: 16px; 
      background: #4A90E2; 
      border: 2px solid white; 
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(74, 144, 226, 0.8);
    ">
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10], // Centered
});

// Helper component to actively shift the map when geolocation completes
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  return null;
}

const UberMap = ({ pickupLocation, destinationLocation, currentSheetState }) => {
  const [currentLocation, setCurrentLocation] = useState(fallbackCenter);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn('Geolocation blocked or failed. Using fallback coordinates.', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer 
        center={currentLocation} 
        zoom={15} 
        zoomControl={false} 
        style={{ height: '100%', width: '100%', background: '#121212' }} 
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <Marker position={currentLocation} icon={userIcon} />
        <RecenterMap position={currentLocation} />
      </MapContainer>
    </div>
  );
};

export default memo(UberMap);