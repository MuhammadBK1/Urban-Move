/**
 * =====================================================
 * ETA CALCULATION SERVICE
 * =====================================================
 * 
 * Calculates estimated time of arrival for vehicles.
 * Uses distance and average speed with confidence levels.
 * =====================================================
 */

import { Coordinate, ETAResult, ConfidenceLevel, LiveLocation, VehicleWithETA } from '../types';
import { CONFIG, CONFIDENCE_COLORS } from '../constants';
import { calculateDistance } from './mapService';

/**
 * Get confidence level based on data freshness
 */
export const getConfidenceLevel = (
  timestamp: number,
  source: 'gps' | 'checkin'
): ConfidenceLevel => {
  const age = Date.now() - timestamp;

  if (source === 'gps') {
    if (age < CONFIG.STALE_GPS_THRESHOLD) return 'high';
    if (age < CONFIG.OLD_DATA_THRESHOLD) return 'medium';
  }

  if (source === 'checkin') {
    if (age < CONFIG.STALE_GPS_THRESHOLD * 2) return 'medium';
  }

  return 'low';
};

/**
 * Calculate distance along route path
 */
export const calculateRouteDistance = (
  from: Coordinate,
  to: Coordinate,
  waypoints: Coordinate[]
): number => {
  // Find nearest waypoint to 'from'
  let fromIndex = 0;
  let minFromDist = Infinity;
  
  waypoints.forEach((wp, index) => {
    const dist = calculateDistance(from, wp);
    if (dist < minFromDist) {
      minFromDist = dist;
      fromIndex = index;
    }
  });

  // Find nearest waypoint to 'to'
  let toIndex = waypoints.length - 1;
  let minToDist = Infinity;
  
  waypoints.forEach((wp, index) => {
    const dist = calculateDistance(to, wp);
    if (dist < minToDist) {
      minToDist = dist;
      toIndex = index;
    }
  });

  // Sum distances along path
  let totalDistance = minFromDist;
  
  for (let i = fromIndex; i < toIndex; i++) {
    totalDistance += calculateDistance(waypoints[i], waypoints[i + 1]);
  }
  
  totalDistance += minToDist;

  return totalDistance;
};

/**
 * Calculate ETA for a vehicle
 */
export const calculateETA = (
  vehicleLocation: Coordinate,
  userLocation: Coordinate,
  routeWaypoints: Coordinate[],
  averageSpeed: number,
  timestamp: number,
  source: 'gps' | 'checkin'
): ETAResult => {
  const distance = calculateRouteDistance(vehicleLocation, userLocation, routeWaypoints);
  const timeHours = distance / averageSpeed;
  const minutes = Math.round(timeHours * 60);
  const confidence = getConfidenceLevel(timestamp, source);

  return {
    minutes: Math.max(1, minutes),
    confidence,
    basedOn: source,
    lastUpdate: timestamp,
    distance,
  };
};

/**
 * Get nearest vehicles with ETA (sorted, limited)
 */
export const getNearestVehicles = (
  vehicles: LiveLocation[],
  userLocation: Coordinate,
  waypoints: Coordinate[],
  averageSpeed: number,
  limit: number = 3
): VehicleWithETA[] => {
  const now = Date.now();

  return vehicles
    .filter(v => now - v.timestamp < CONFIG.OLD_DATA_THRESHOLD)
    .map(vehicle => ({
      ...vehicle,
      eta: calculateETA(
        vehicle.location,
        userLocation,
        waypoints,
        averageSpeed,
        vehicle.timestamp,
        vehicle.source
      ),
    }))
    .sort((a, b) => a.eta.minutes - b.eta.minutes)
    .slice(0, limit);
};

/**
 * Get color for confidence level
 */
export const getConfidenceColor = (confidence: ConfidenceLevel): string => {
  return CONFIDENCE_COLORS[confidence];
};

/**
 * Format ETA for display
 */
export const formatETA = (minutes: number, lang: 'en' | 'ur'): string => {
  if (minutes <= 1) {
    return lang === 'ur' ? 'جلد آ رہا' : 'Arriving';
  }
  const unit = lang === 'ur' ? 'منٹ' : 'min';
  return `${minutes} ${unit}`;
};

/**
 * Format distance for display
 */
export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
};

