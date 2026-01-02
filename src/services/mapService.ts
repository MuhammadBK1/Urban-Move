/**
 * =====================================================
 * MAP SERVICE - Mapbox GL JS Utilities
 * =====================================================
 * 
 * Utility functions for Mapbox map operations.
 * Migrated from Google Maps to Mapbox GL JS.
 * =====================================================
 */

import mapboxgl from 'mapbox-gl';
import { Coordinate } from '../types';

// =====================================================
// MAPBOX INITIALIZATION
// =====================================================

/**
 * Check if Mapbox is configured
 */
export const isMapboxConfigured = (): boolean => {
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  return !!token && token !== 'your_mapbox_token_here';
};

/**
 * Get Mapbox access token
 */
export const getMapboxToken = (): string => {
  return import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';
};

// =====================================================
// COORDINATE UTILITIES
// =====================================================

/**
 * Convert Coordinate to Mapbox LngLat array
 */
export const toMapboxCoords = (coord: Coordinate): [number, number] => {
  return [coord.lng, coord.lat];
};

/**
 * Convert array of Coordinates to Mapbox coordinate array
 */
export const toMapboxPath = (coords: Coordinate[]): [number, number][] => {
  return coords.map(c => [c.lng, c.lat]);
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @returns distance in kilometers
 */
export const calculateDistance = (coord1: Coordinate, coord2: Coordinate): number => {
  const R = 6371; // Earth's radius in km
  const lat1Rad = (coord1.lat * Math.PI) / 180;
  const lat2Rad = (coord2.lat * Math.PI) / 180;
  const deltaLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const deltaLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Calculate total route distance
 */
export const calculateRouteDistance = (waypoints: Coordinate[]): number => {
  let totalDistance = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalDistance += calculateDistance(waypoints[i], waypoints[i + 1]);
  }
  return totalDistance;
};

/**
 * Interpolate position between two points
 */
export const interpolatePosition = (
  start: Coordinate,
  end: Coordinate,
  progress: number
): Coordinate => {
  return {
    lat: start.lat + (end.lat - start.lat) * progress,
    lng: start.lng + (end.lng - start.lng) * progress,
  };
};

// =====================================================
// GEOJSON UTILITIES
// =====================================================

/**
 * Create GeoJSON LineString from waypoints
 */
export const createLineStringGeoJSON = (
  waypoints: Coordinate[],
  properties: Record<string, unknown> = {}
): GeoJSON.Feature<GeoJSON.LineString> => {
  return {
    type: 'Feature',
    properties,
    geometry: {
      type: 'LineString',
      coordinates: toMapboxPath(waypoints),
    },
  };
};

/**
 * Create GeoJSON Point from coordinate
 */
export const createPointGeoJSON = (
  coord: Coordinate,
  properties: Record<string, unknown> = {}
): GeoJSON.Feature<GeoJSON.Point> => {
  return {
    type: 'Feature',
    properties,
    geometry: {
      type: 'Point',
      coordinates: [coord.lng, coord.lat],
    },
  };
};

/**
 * Create GeoJSON FeatureCollection from multiple features
 */
export const createFeatureCollection = (
  features: GeoJSON.Feature[]
): GeoJSON.FeatureCollection => {
  return {
    type: 'FeatureCollection',
    features,
  };
};

// =====================================================
// MAP BOUNDS UTILITIES
// =====================================================

/**
 * Create bounds from waypoints
 */
export const createBoundsFromCoords = (coords: Coordinate[]): mapboxgl.LngLatBounds => {
  const bounds = new mapboxgl.LngLatBounds();
  coords.forEach(coord => {
    bounds.extend([coord.lng, coord.lat]);
  });
  return bounds;
};

/**
 * Fit map to show all waypoints
 */
export const fitMapToBounds = (
  map: mapboxgl.Map,
  waypoints: Coordinate[],
  padding: number = 50
): void => {
  const bounds = createBoundsFromCoords(waypoints);
  map.fitBounds(bounds, { padding, duration: 1000 });
};

// =====================================================
// MARKER UTILITIES
// =====================================================

/**
 * Create custom marker element
 */
export const createMarkerElement = (options: {
  icon: string;
  color: string;
  size?: number;
}): HTMLDivElement => {
  const { icon, color, size = 32 } = options;
  
  const el = document.createElement('div');
  el.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    background: white;
    border: 3px solid ${color};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${size * 0.5}px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  `;
  el.innerHTML = icon;
  
  return el;
};

/**
 * Create user location marker element
 */
export const createUserLocationElement = (): HTMLDivElement => {
  const el = document.createElement('div');
  el.innerHTML = `
    <div style="
      position: relative;
      width: 20px;
      height: 20px;
    ">
      <div style="
        width: 20px;
        height: 20px;
        background: #4285F4;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        position: relative;
        z-index: 2;
      "></div>
      <div style="
        position: absolute;
        width: 40px;
        height: 40px;
        background: rgba(66, 133, 244, 0.2);
        border-radius: 50%;
        top: -10px;
        left: -10px;
        animation: pulse 2s infinite;
        z-index: 1;
      "></div>
    </div>
  `;
  return el;
};

// =====================================================
// ANIMATION UTILITIES
// =====================================================

/**
 * Animate marker along a path
 */
export const animateMarkerAlongPath = (
  marker: mapboxgl.Marker,
  path: Coordinate[],
  duration: number,
  onComplete?: () => void
): { stop: () => void } => {
  let animationId: number;
  let startTime: number;

  const animate = (timestamp: number) => {
    if (!startTime) startTime = timestamp;
    const progress = (timestamp - startTime) / duration;

    if (progress >= 1) {
      marker.setLngLat([path[path.length - 1].lng, path[path.length - 1].lat]);
      onComplete?.();
      return;
    }

    // Calculate current position on path
    const totalSegments = path.length - 1;
    const currentSegmentProgress = progress * totalSegments;
    const currentSegmentIndex = Math.floor(currentSegmentProgress);
    const segmentProgress = currentSegmentProgress - currentSegmentIndex;

    const start = path[currentSegmentIndex];
    const end = path[Math.min(currentSegmentIndex + 1, path.length - 1)];

    const currentPos = interpolatePosition(start, end, segmentProgress);
    marker.setLngLat([currentPos.lng, currentPos.lat]);

    animationId = requestAnimationFrame(animate);
  };

  animationId = requestAnimationFrame(animate);

  return {
    stop: () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    },
  };
};

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  isMapboxConfigured,
  getMapboxToken,
  toMapboxCoords,
  toMapboxPath,
  calculateDistance,
  calculateRouteDistance,
  interpolatePosition,
  createLineStringGeoJSON,
  createPointGeoJSON,
  createFeatureCollection,
  createBoundsFromCoords,
  fitMapToBounds,
  createMarkerElement,
  createUserLocationElement,
  animateMarkerAlongPath,
};
