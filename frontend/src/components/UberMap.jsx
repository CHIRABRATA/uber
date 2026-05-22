import React, { useState, useEffect, useCallback, memo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

// Map container sizing to fill the parent entirely
const containerStyle = {
  width: '100%',
  height: '100%',
};

// Fallback coordinates: Central Kolkata/Salt Lake area
const fallbackCenter = {
  lat: 22.5726,
  lng: 88.3639,
};

// Premium dark mode map styles emphasizing road networks minimally
const darkMapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#121212' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#757575' }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#181818' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { featureType: 'poi.park', elementType: 'labels.text.stroke', stylers: [{ color: '#1b1b1b' }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#2c2c2c' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#373737' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3c3c3c' }] },
  { featureType: 'road.highway.controlled_access', elementType: 'geometry', stylers: [{ color: '#4e4e4e' }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d3d3d' }] },
];

const UberMap = () => {
  // Load the Google Maps API script efficiently
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY_HERE', 
  });

  // State to track user location, defaulting to fallback
  const [currentLocation, setCurrentLocation] = useState(fallbackCenter);
  const [map, setMap] = useState(null);

  // Fetch the user's real-time position upon mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Update state with actual user coordinates
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Geolocation blocked or failed. Using fallback coordinates.', error);
          // State remains on fallbackCenter securely avoiding app crash
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  // Memoized callback to store map instance when fully loaded
  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  // Memoized callback to cleanup map resources
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Render a sleek dark skeleton loader until the script is fully injected
  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-[#121212] flex items-center justify-center">
        <span className="text-gray-400 text-sm animate-pulse">Loading Map...</span>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentLocation}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: darkMapStyles,
        disableDefaultUI: true, // Hides satellite toggles, zoom buttons, and pegman
        gestureHandling: 'greedy', // Ensures touch events always pan the map rather than scrolling the page
      }}
    >
      {/* Rider's current location blue dot marker */}
      <MarkerF
        position={currentLocation}
        icon={{
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#4A90E2', // Uber/Premium blue tint
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        }}
      />
    </GoogleMap>
  );
};

// Wrapping in React.memo to prevent unnecessary re-renders of the heavy map component
export default memo(UberMap);