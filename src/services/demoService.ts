/**
 * =====================================================
 * DEMO MODE SERVICE
 * =====================================================
 * 
 * Provides simulated data for offline/demo use.
 * Simulates vehicle movement along routes.
 * =====================================================
 */

import { Route, Vehicle, LiveLocation, Coordinate } from '../types';

// =====================================================
// MOCK DATA
// =====================================================

export const DEMO_ROUTES: Route[] = [];

export const DEMO_VEHICLES: Vehicle[] = [];

// =====================================================
// SIMULATION ENGINE
// =====================================================

// Vehicle progress along routes (0 to 1)
const vehicleProgress: Map<string, number> = new Map();

/**
 * Interpolate position along waypoints
 */
const interpolatePosition = (waypoints: Coordinate[], progress: number): Coordinate => {
  const totalSegments = waypoints.length - 1;
  const segmentProgress = progress * totalSegments;
  const segmentIndex = Math.min(Math.floor(segmentProgress), totalSegments - 1);
  const segmentFraction = segmentProgress - segmentIndex;

  const start = waypoints[segmentIndex];
  const end = waypoints[segmentIndex + 1];

  return {
    lat: start.lat + (end.lat - start.lat) * segmentFraction,
    lng: start.lng + (end.lng - start.lng) * segmentFraction,
  };
};

/**
 * Initialize demo vehicle positions
 */
export const initDemoVehicles = (): void => {
  vehicleProgress.clear();
  DEMO_VEHICLES.forEach((vehicle, index) => {
    // Spread vehicles along routes
    const initialProgress = (index + 1) / (DEMO_VEHICLES.length + 2);
    vehicleProgress.set(vehicle.id, initialProgress);
  });
};

/**
 * Update demo vehicle positions (call every few seconds)
 */
export const updateDemoVehicles = (): void => {
  DEMO_VEHICLES.forEach(vehicle => {
    let progress = vehicleProgress.get(vehicle.id) || 0;
    progress += 0.02; // Move 2% per update
    if (progress > 1) progress = 0;
    vehicleProgress.set(vehicle.id, progress);
  });
};

/**
 * Get current demo locations for a route
 */
export const getDemoLocations = (routeId: string): LiveLocation[] => {
  const route = DEMO_ROUTES.find(r => r.id === routeId);
  if (!route) return [];

  const vehicles = DEMO_VEHICLES.filter(v => v.routeId === routeId);

  return vehicles.map(vehicle => {
    const progress = vehicleProgress.get(vehicle.id) || 0;
    const position = interpolatePosition(route.waypoints, progress);

    return {
      vehicleId: vehicle.id,
      routeId: route.id,
      location: position,
      heading: Math.random() * 360,
      speed: 15 + Math.random() * 15,
      timestamp: Date.now(),
      source: 'gps' as const,
      accuracy: 10,
    };
  });
};

/**
 * Get all demo routes
 */
export const getDemoRoutes = (): Route[] => DEMO_ROUTES;

/**
 * Get demo vehicles for a route
 */
export const getDemoVehicles = (routeId: string): Vehicle[] => {
  return DEMO_VEHICLES.filter(v => v.routeId === routeId);
};

