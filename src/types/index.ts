/**
 * =====================================================
 * URBAN-MOVE TYPE DEFINITIONS
 * =====================================================
 * 
 * TypeScript interfaces for the entire application.
 * Pakistan-specific transit types included.
 * =====================================================
 */

/**
 * Geographic coordinate point
 */
export interface Coordinate {
  lat: number;
  lng: number;
}

/**
 * Vehicle types for public transit
 * - metro: Metro Bus (BRT)
 * - orange-line: Orange Line Metro Train
 * - bus: Official bus service
 */
export type VehicleType = 'metro' | 'orange-line' | 'bus';

/**
 * Route definition for feeder transport
 */
export interface Route {
  id: string;
  name: string;                    // English name
  nameUrdu: string;                // Urdu name (اردو)
  startPoint: string;
  endPoint: string;
  waypoints: Coordinate[];         // Path coordinates for polyline
  color: string;                   // Route color on map
  vehicleType: VehicleType;
  averageSpeed: number;            // km/h
  fare: number;                    // PKR
  isActive: boolean;
  createdAt: number;
}

/**
 * Vehicle registered in the system
 */
export interface Vehicle {
  id: string;
  routeId: string;
  vehicleType: VehicleType;
  plateNumber: string;
  driverName?: string;
  driverPhone?: string;
  capacity: number;
  isActive: boolean;
  registeredAt: number;
}

/**
 * Real-time vehicle location
 * Stored in Firebase Realtime Database
 */
export interface LiveLocation {
  vehicleId: string;
  routeId: string;
  location: Coordinate;
  heading: number;                 // Direction 0-360
  speed: number;                   // km/h
  timestamp: number;
  source: 'gps' | 'checkin';
  accuracy: number;                // meters
}

/**
 * Crowd-sourced check-in
 */
export interface CheckIn {
  id: string;
  vehicleId?: string;
  routeId: string;
  location: Coordinate;
  timestamp: number;
  userId: string;
  stopName?: string;
}

/**
 * Confidence levels for ETA
 */
export type ConfidenceLevel = 'high' | 'medium' | 'low';

/**
 * ETA calculation result
 */
export interface ETAResult {
  minutes: number;
  confidence: ConfidenceLevel;
  basedOn: 'gps' | 'checkin' | 'schedule';
  lastUpdate: number;
  distance: number;
}

/**
 * App settings
 */
export interface AppSettings {
  language: 'en' | 'ur';
  demoMode: boolean;
  driverMode: boolean;
  highContrast: boolean;
  selectedRouteId?: string;
}

/**
 * User state (anonymous)
 */
export interface UserState {
  anonymousId: string;
  lastCheckIn?: number;
  checkInCount: number;
  isDriver: boolean;
  currentVehicleId?: string;
}

/**
 * Vehicle with calculated ETA
 */
export interface VehicleWithETA extends LiveLocation {
  eta: ETAResult;
}

