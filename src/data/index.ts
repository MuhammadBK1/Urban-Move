/**
 * =====================================================
 * DATA INDEX - Export Station & Route Data
 * =====================================================
 */

import stationsData from './stations.json';
import feederRoutesData from './feederRoutes.json';

// Type definitions for exported data
export interface Station {
  id: string;
  name: string;
  nameUrdu: string;
  lat: number;
  lng: number;
}

export interface TransitLine {
  name: string;
  nameUrdu: string;
  color: string;
  icon: string;
  stations: Station[];
}

export interface Waypoint {
  lat: number;
  lng: number;
  name: string;
}

export interface FeederRoute {
  id: string;
  name: string;
  nameUrdu: string;
  vehicleType: 'metro' | 'orange-line' | 'bus';
  color: string;
  fare: number;
  avgSpeed: number;
  frequency: string;
  connectsTo: string;
  waypoints: Waypoint[];
}

export interface FeederVehicle {
  id: string;
  routeId: string;
  plateNumber: string;
  driverName: string;
  vehicleType: string;
  capacity: number;
  currentOccupancy: number;
  crowdedness: 'low' | 'moderate' | 'full';
}

// Export typed data
export const metroBusStations = stationsData.metroBus as TransitLine;
export const orangeLineStations = stationsData.orangeLine as TransitLine;
export const feederRoutes = feederRoutesData.routes as FeederRoute[];
export const feederVehicles = feederRoutesData.vehicles as FeederVehicle[];

// Utility functions
export const getStationById = (id: string): Station | undefined => {
  return [...metroBusStations.stations, ...orangeLineStations.stations].find(s => s.id === id);
};

export const getRouteById = (id: string): FeederRoute | undefined => {
  return feederRoutes.find(r => r.id === id);
};

export const getVehiclesForRoute = (routeId: string): FeederVehicle[] => {
  return feederVehicles.filter(v => v.routeId === routeId);
};

export const getAllStations = (): Station[] => {
  return [...metroBusStations.stations, ...orangeLineStations.stations];
};

