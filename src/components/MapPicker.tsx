/**
 * =====================================================
 * MAP PICKER COMPONENT
 * =====================================================
 * 
 * Interactive map for selecting locations
 * Used in Profile and Favorites pages
 * =====================================================
 */

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Coordinate } from '../types';
import { getMapboxToken } from '../services/mapService';
import { DEFAULT_CENTER } from '../constants';

interface MapPickerProps {
  initialLocation?: Coordinate;
  onLocationSelect: (location: Coordinate, address?: string) => void;
  className?: string;
}

export const MapPicker: React.FC<MapPickerProps> = ({
  initialLocation,
  onLocationSelect,
  className = '',
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Coordinate | null>(initialLocation || null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const token = getMapboxToken();
    if (!token) {
      console.error('Mapbox token not configured');
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialLocation ? [initialLocation.lng, initialLocation.lat] : [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
      zoom: initialLocation ? 15 : 12,
    });

    mapRef.current = map;

    // Create marker
    const marker = new mapboxgl.Marker({
      draggable: true,
      color: '#1F8A70',
    })
      .setLngLat(initialLocation ? [initialLocation.lng, initialLocation.lat] : [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat])
      .addTo(map);

    markerRef.current = marker;

    // Handle marker drag end
    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      const location: Coordinate = { lat: lngLat.lat, lng: lngLat.lng };
      setSelectedLocation(location);
      reverseGeocode(location);
    });

    // Handle map click
    map.on('click', (e) => {
      const location: Coordinate = { lat: e.lngLat.lat, lng: e.lngLat.lng };
      marker.setLngLat([e.lngLat.lng, e.lngLat.lat]);
      setSelectedLocation(location);
      reverseGeocode(location);
    });

    // Reverse geocode function
    const reverseGeocode = async (location: Coordinate) => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.lng},${location.lat}.json?access_token=${token}`
        );
        const data = await response.json();
        const address = data.features[0]?.place_name || '';
        onLocationSelect(location, address);
      } catch (error) {
        console.error('Reverse geocode error:', error);
        onLocationSelect(location);
      }
    };

    // Initial reverse geocode if location provided
    if (initialLocation) {
      reverseGeocode(initialLocation);
    }

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className={`relative ${className}`} style={{ height: '400px', width: '100%' }}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg text-sm text-gray-700 z-10">
        {selectedLocation
          ? `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`
          : 'Click on map to select location'}
      </div>
    </div>
  );
};

export default MapPicker;

