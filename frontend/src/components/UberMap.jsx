import React, { useState, useEffect, memo } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const fallbackCenter = [22.5726, 88.3639];

// Custom Pickup Icon (Blue Dot)
const pickupIcon = L.divIcon({
  className: 'custom-user-marker',
  html: `
    <div style="width: 16px; height: 16px; background: #4A90E2; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(74, 144, 226, 0.8);"></div>
  `,
  iconSize: [20, 20], iconAnchor: [10, 10],
});

// Custom Destination Icon (Square/Flag)
const destIcon = L.divIcon({
  className: 'custom-dest-marker',
  html: `
    <div style="width: 16px; height: 16px; background: #00D4AA; border: 2px solid white; border-radius: 4px; box-shadow: 0 0 10px rgba(0, 212, 170, 0.8);"></div>
  `,
  iconSize: [20, 20], iconAnchor: [10, 10],
});

// Helper component to auto-zoom the map to fit the entire route
function MapController({ pickupCoords, destCoords, routePath }) {
  const map = useMap();
  useEffect(() => {
    if (routePath && routePath.length > 0) {
      // If we have a route, zoom out to show the whole trip
      const bounds = L.latLngBounds(routePath);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    } else if (pickupCoords) {
      // If only pickup is selected, center on pickup
      map.setView(pickupCoords, 15);
    }
  }, [pickupCoords, destCoords, routePath, map]);
  return null;
}

const UberMap = ({ pickupCoords, destCoords }) => {
  const [currentLocation, setCurrentLocation] = useState(fallbackCenter);
  const [routePath, setRoutePath] = useState([]); // Stores the line coordinates

  // 1. Fetch initial user location
  useEffect(() => {
    if (navigator.geolocation && !pickupCoords) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentLocation([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn('Geolocation blocked.', err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, [pickupCoords]);

  // 2. Fetch the driving route from OSRM when destination exists
  useEffect(() => {
    const fetchRoute = async () => {
      // Use selected pickup, or fallback to current location if they didn't type a pickup
      const startLocation = pickupCoords || currentLocation;

      if (!startLocation || !destCoords) {
        setRoutePath([]);
        return;
      }
      
      try {
        // OSRM requires coordinates in [Longitude, Latitude] format for the URL!
        const startLng = startLocation[1];
        const startLat = startLocation[0];
        const endLng = destCoords[1];
        const endLat = destCoords[0];

        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`);
        const data = await res.json();

        if (data.routes && data.routes[0]) {
          // GeoJSON returns [lng, lat]. Leaflet needs [lat, lng], so we flip them.
          const formattedCoords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
          setRoutePath(formattedCoords);
        }
      } catch (error) {
        console.error("Failed to fetch route:", error);
      }
    };

    fetchRoute();
  }, [pickupCoords, destCoords, currentLocation]);

  // Determine what to show as the starting point
  const startMarker = pickupCoords || currentLocation;

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer 
        center={startMarker} 
        zoom={15} 
        zoomControl={false} 
        style={{ height: '100%', width: '100%', background: '#121212' }} 
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Render Pickup Marker */}
        <Marker position={startMarker} icon={pickupIcon} />
        
        {/* Render Destination Marker if selected */}
        {destCoords && <Marker position={destCoords} icon={destIcon} />}

        {/* Draw the glowing route line! */}
        {routePath.length > 0 && (
          <Polyline 
            positions={routePath} 
            color="#00D4AA" 
            weight={4} 
            opacity={0.8} 
            lineCap="round" 
            lineJoin="round"
          />
        )}

        {/* Auto-Adjust Map Zoom */}
        <MapController pickupCoords={pickupCoords} destCoords={destCoords} routePath={routePath} />
      </MapContainer>
    </div>
  );
};

export default memo(UberMap);