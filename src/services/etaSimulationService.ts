/**
 * =====================================================
 * LIVE ETA SIMULATION SERVICE
 * =====================================================
 * 
 * Simulates real-time ETA updates for vehicles
 * Updates every few seconds with status indicators
 * =====================================================
 */

import { Coordinate } from '../types';
import { calculateDistance } from './mapService';

export type VehicleStatus = 'on-time' | 'delayed' | 'missed' | 'far';

export interface VehicleETA {
  vehicleId: string;
  routeId: string;
  currentLocation: Coordinate;
  destination: Coordinate;
  etaMinutes: number;
  status: VehicleStatus;
  lastUpdate: number;
  distance: number; // km
}

// const UPDATE_INTERVAL = 5000; // 5 seconds - reserved for future use
const STATUS_THRESHOLDS = {
  onTime: 2, // minutes variance for "on time"
  delayed: 5, // minutes for "delayed"
  missed: 10, // minutes for "missed"
  far: 20, // minutes for "far"
};

/**
 * Calculate ETA based on distance and average speed
 */
const calculateETA = (distance: number, vehicleType: 'metro' | 'bus' | 'orange-line'): number => {
  const speeds = {
    metro: 30, // km/h
    bus: 20, // km/h
    'orange-line': 40, // km/h
  };

  const speed = speeds[vehicleType] || 20;
  return Math.round((distance / speed) * 60); // minutes
};

/**
 * Determine vehicle status based on ETA
 */
const determineStatus = (etaMinutes: number): VehicleStatus => {
  if (etaMinutes <= STATUS_THRESHOLDS.onTime) return 'on-time';
  if (etaMinutes <= STATUS_THRESHOLDS.delayed) return 'delayed';
  if (etaMinutes <= STATUS_THRESHOLDS.missed) return 'missed';
  return 'far';
};

/**
 * Simulate vehicle movement and calculate ETA
 */
export const simulateVehicleETA = (
  vehicleId: string,
  routeId: string,
  currentLocation: Coordinate,
  destination: Coordinate,
  vehicleType: 'metro' | 'bus' | 'orange-line' = 'bus'
): VehicleETA => {
  const distance = calculateDistance(currentLocation, destination);
  const etaMinutes = calculateETA(distance, vehicleType);

  // Add some randomness to simulate real-world variance
  const variance = (Math.random() - 0.5) * 2; // -1 to +1 minutes
  const finalETA = Math.max(0, Math.round(etaMinutes + variance));

  return {
    vehicleId,
    routeId,
    currentLocation,
    destination,
    etaMinutes: finalETA,
    status: determineStatus(finalETA),
    lastUpdate: Date.now(),
    distance,
  };
};

/**
 * Update ETA for a vehicle (simulate movement)
 */
export const updateVehicleETA = (previousETA: VehicleETA): VehicleETA => {
  // Simulate vehicle moving closer (reduce distance by ~10% per update)
  const newLocation: Coordinate = {
    lat: previousETA.currentLocation.lat + (previousETA.destination.lat - previousETA.currentLocation.lat) * 0.1,
    lng: previousETA.currentLocation.lng + (previousETA.destination.lng - previousETA.currentLocation.lng) * 0.1,
  };

  return simulateVehicleETA(
    previousETA.vehicleId,
    previousETA.routeId,
    newLocation,
    previousETA.destination,
    'bus' // Could be determined from route
  );
};

/**
 * Get status color for UI
 */
export const getStatusColor = (status: VehicleStatus): string => {
  switch (status) {
    case 'on-time':
      return 'text-green-600 bg-green-100';
    case 'delayed':
      return 'text-yellow-600 bg-yellow-100';
    case 'missed':
    case 'far':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

/**
 * Get status icon
 */
export const getStatusIcon = (status: VehicleStatus): string => {
  switch (status) {
    case 'on-time':
      return '✓';
    case 'delayed':
      return '⚠';
    case 'missed':
      return '✕';
    case 'far':
      return '→';
    default:
      return '○';
  }
};

