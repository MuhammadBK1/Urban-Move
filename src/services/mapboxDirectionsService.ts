/**
 * =====================================================
 * MAPBOX DIRECTIONS SERVICE
 * =====================================================
 * 
 * Fetches routes from Mapbox Directions API
 * Supports multiple route options and ranking
 * =====================================================
 */

import { Coordinate } from '../types';
import { getMapboxToken } from './mapService';

export interface RouteOption {
  id: string;
  distance: number; // meters
  duration: number; // seconds
  geometry: GeoJSON.LineString;
  steps: RouteStep[];
  transfers?: number;
  eta?: number; // Estimated arrival time in seconds
}

export interface RouteStep {
  distance: number; // meters
  duration: number; // seconds
  instruction: string;
  type: 'walk' | 'bus' | 'metro' | 'drive';
  coordinates: [number, number][]; // [lng, lat]
}

export interface DirectionsResponse {
  routes: RouteOption[];
  waypoints: Array<{
    location: Coordinate;
    name?: string;
  }>;
}

/**
 * Profile types for Mapbox Directions API
 */
export type DirectionsProfile = 'driving' | 'walking' | 'cycling';

/**
 * Fetch directions from Mapbox Directions API
 */
export const fetchDirections = async (
  start: Coordinate,
  destination: Coordinate,
  profile: DirectionsProfile = 'driving',
  alternatives: boolean = true
): Promise<DirectionsResponse | null> => {
  const accessToken = getMapboxToken();
  
  if (!accessToken) {
    console.error('Mapbox token not available');
    return null;
  }

  try {
    // Build coordinates string: lng,lat;lng,lat
    const startCoords = `${start.lng},${start.lat}`;
    const destCoords = `${destination.lng},${destination.lat}`;
    
    // Request alternatives for multiple route options
    const alternativesParam = alternatives ? 'true' : 'false';
    
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${startCoords};${destCoords}?` +
      `alternatives=${alternativesParam}&` +
      `geometries=geojson&` +
      `steps=true&` +
      `overview=full&` +
      `access_token=${accessToken}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Directions API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      return null;
    }

    // Transform Mapbox response to our format
    const routes: RouteOption[] = data.routes.map((route: any, index: number) => {
      const steps: RouteStep[] = route.legs[0]?.steps?.map((step: any) => ({
        distance: step.distance,
        duration: step.duration,
        instruction: step.maneuver.instruction || '',
        type: determineStepType(step, profile),
        coordinates: step.geometry.coordinates,
      })) || [];

      return {
        id: `route-${index}`,
        distance: route.distance,
        duration: route.duration,
        geometry: route.geometry,
        steps,
        transfers: calculateTransfers(steps),
        eta: route.duration,
      };
    });

    return {
      routes,
      waypoints: [
        { location: start },
        { location: destination },
      ],
    };
  } catch (error) {
    console.error('Error fetching directions:', error);
    return null;
  }
};

/**
 * Determine step type from Mapbox step data
 */
const determineStepType = (step: any, profile: DirectionsProfile): RouteStep['type'] => {
  const instruction = step.maneuver.instruction?.toLowerCase() || '';
  
  // Check for transit keywords (this is a simplified check)
  // In a real app, you'd use Mapbox Matrix API or transit-specific APIs
  if (instruction.includes('bus') || instruction.includes('metro')) {
    return instruction.includes('metro') ? 'metro' : 'bus';
  }
  
  // Return based on profile
  if (profile === 'walking') {
    return 'walk';
  }
  
  // Default to driving for Mapbox driving profile
  return 'drive';
};

/**
 * Calculate number of transfers in route
 */
const calculateTransfers = (steps: RouteStep[]): number => {
  let transfers = 0;
  let currentType: RouteStep['type'] | null = null;

  for (const step of steps) {
    if (step.type !== 'walk' && step.type !== 'drive') {
      if (currentType && currentType !== step.type) {
        transfers++;
      }
      currentType = step.type;
    }
  }

  return transfers;
};

/**
 * Rank routes by ETA and transfers
 */
export const rankRoutes = (routes: RouteOption[]): RouteOption[] => {
  return [...routes].sort((a, b) => {
    // Primary: ETA (duration)
    if (Math.abs(a.duration - b.duration) > 60) {
      return a.duration - b.duration;
    }
    
    // Secondary: Transfers (fewer is better)
    const transfersA = a.transfers || 0;
    const transfersB = b.transfers || 0;
    if (transfersA !== transfersB) {
      return transfersA - transfersB;
    }
    
    // Tertiary: Distance (shorter is better)
    return a.distance - b.distance;
  });
};

/**
 * Format duration to human-readable string
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 
    ? `${hours}h ${remainingMinutes}min`
    : `${hours}h`;
};

/**
 * Format distance to human-readable string
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

