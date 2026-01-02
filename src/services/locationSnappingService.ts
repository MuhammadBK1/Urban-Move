/**
 * =====================================================
 * LOCATION SNAPPING SERVICE
 * =====================================================
 * 
 * Snaps user location to nearest transit stop
 * Finds walking route to nearest stop
 * =====================================================
 */

import { Coordinate } from '../types';
import { findNearestStop } from '../data/transitData';

export interface SnappedLocation {
  original: Coordinate;
  snapped: Coordinate;
  stopName: string;
  stopNameUrdu: string;
  distance: number; // meters
  walkingTime: number; // minutes
}

const SNAP_THRESHOLD = 500; // meters - only snap if within 500m

/**
 * Snap location to nearest transit stop
 */
export const snapToNearestStop = (location: Coordinate): SnappedLocation | null => {
  const nearest = findNearestStop(location, SNAP_THRESHOLD / 1000); // Convert to km

  if (!nearest) {
    return null;
  }

  const distance = nearest.distance * 1000; // Convert to meters
  const walkingTime = Math.round(distance / 80); // ~80 m/min walking speed

  return {
    original: location,
    snapped: { lat: nearest.lat, lng: nearest.lng },
    stopName: nearest.name,
    stopNameUrdu: nearest.nameUrdu || nearest.name,
    distance: Math.round(distance),
    walkingTime,
  };
};

/**
 * Get walking route coordinates to nearest stop
 */
export const getWalkingRouteToStop = (
  from: Coordinate,
  to: Coordinate,
  steps: number = 10
): Coordinate[] => {
  const route: Coordinate[] = [from];

  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    route.push({
      lat: from.lat + (to.lat - from.lat) * progress,
      lng: from.lng + (to.lng - from.lng) * progress,
    });
  }

  return route;
};

