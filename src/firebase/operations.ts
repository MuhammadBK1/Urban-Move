/**
 * =====================================================
 * FIREBASE DATABASE OPERATIONS
 * =====================================================
 * 
 * All database read/write operations for Urban-Move.
 * Handles both Firestore and Realtime Database.
 * =====================================================
 */

import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import {
  ref,
  set,
  onValue,
  off,
  DataSnapshot,
} from 'firebase/database';

import { getFirestoreDb, getRealtimeDb } from './config';
import { Route, Vehicle, LiveLocation, CheckIn, Coordinate } from '../types';
import { CONFIG } from '../constants';

// =====================================================
// FIRESTORE OPERATIONS
// =====================================================

/**
 * Fetch all active routes
 */
export const fetchRoutes = async (): Promise<Route[]> => {
  const db = getFirestoreDb();
  const routesRef = collection(db, CONFIG.COLLECTION_ROUTES);
  const q = query(routesRef, where('isActive', '==', true));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Route[];
};

/**
 * Fetch vehicles for a route
 */
export const fetchVehiclesForRoute = async (routeId: string): Promise<Vehicle[]> => {
  const db = getFirestoreDb();
  const vehiclesRef = collection(db, CONFIG.COLLECTION_VEHICLES);
  const q = query(
    vehiclesRef,
    where('routeId', '==', routeId),
    where('isActive', '==', true)
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Vehicle[];
};

/**
 * Subscribe to route updates
 */
export const subscribeToRoutes = (
  callback: (routes: Route[]) => void
): Unsubscribe => {
  const db = getFirestoreDb();
  const routesRef = collection(db, CONFIG.COLLECTION_ROUTES);
  const q = query(routesRef, where('isActive', '==', true));
  
  return onSnapshot(q, (snapshot) => {
    const routes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Route[];
    callback(routes);
  });
};

// =====================================================
// REALTIME DATABASE OPERATIONS
// =====================================================

/**
 * Subscribe to live vehicle locations
 */
export const subscribeToLiveLocations = (
  routeId: string,
  callback: (locations: LiveLocation[]) => void
): (() => void) => {
  const rtdb = getRealtimeDb();
  const locationsRef = ref(rtdb, `${CONFIG.COLLECTION_LIVE_LOCATIONS}/${routeId}`);
  
  const handleValue = (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    
    const now = Date.now();
    const locations: LiveLocation[] = Object.values(data)
      .filter((loc: unknown) => {
        const location = loc as LiveLocation;
        return now - location.timestamp < CONFIG.OLD_DATA_THRESHOLD;
      }) as LiveLocation[];
    
    callback(locations);
  };
  
  onValue(locationsRef, handleValue);
  
  return () => off(locationsRef, 'value', handleValue);
};

/**
 * Update vehicle location (Driver Mode)
 */
export const updateVehicleLocation = async (
  vehicleId: string,
  routeId: string,
  location: Coordinate,
  heading: number,
  speed: number,
  accuracy: number
): Promise<void> => {
  const rtdb = getRealtimeDb();
  const locationRef = ref(rtdb, `${CONFIG.COLLECTION_LIVE_LOCATIONS}/${routeId}/${vehicleId}`);
  
  await set(locationRef, {
    vehicleId,
    routeId,
    location,
    heading,
    speed,
    accuracy,
    timestamp: Date.now(),
    source: 'gps',
  });
};

/**
 * Submit a check-in
 */
export const submitCheckIn = async (
  checkIn: Omit<CheckIn, 'id'>
): Promise<string> => {
  const db = getFirestoreDb();
  const rtdb = getRealtimeDb();
  const checkInsRef = collection(db, CONFIG.COLLECTION_CHECKINS);
  const docRef = doc(checkInsRef);
  
  await setDoc(docRef, {
    ...checkIn,
    timestamp: Date.now(),
  });
  
  // Update live location with check-in data
  if (checkIn.vehicleId) {
    const locationRef = ref(
      rtdb,
      `${CONFIG.COLLECTION_LIVE_LOCATIONS}/${checkIn.routeId}/${checkIn.vehicleId}`
    );
    
    await set(locationRef, {
      vehicleId: checkIn.vehicleId,
      routeId: checkIn.routeId,
      location: checkIn.location,
      heading: 0,
      speed: 0,
      accuracy: 50,
      timestamp: Date.now(),
      source: 'checkin',
    });
  }
  
  return docRef.id;
};

// =====================================================
// MOCK DATA FOR DEMO MODE
// =====================================================

/**
 * Insert mock data (for demo/development)
 */
export const insertMockData = async (): Promise<void> => {
  const db = getFirestoreDb();
  
  // Mock routes (empty - only public transit routes are supported)
  const routes: Route[] = [];
  
  // Insert routes
  for (const route of routes) {
    await setDoc(doc(db, CONFIG.COLLECTION_ROUTES, route.id), route);
  }
  
  console.log('✅ Mock data inserted');
};

