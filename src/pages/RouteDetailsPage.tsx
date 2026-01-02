/**
 * =====================================================
 * ROUTE DETAILS PAGE
 * =====================================================
 * 
 * Detailed view of a selected route.
 * Shows live vehicles, ETAs, check-in button, and driver mode.
 * =====================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Route, Vehicle, LiveLocation, VehicleWithETA, VehicleType } from '../types';
import { t, CONFIG, VEHICLE_CONFIG } from '../constants';
import { useApp } from '../context/AppContext';
import { ETACard, CheckInButton, DriverModeToggle } from '../components';
import { 
  DEMO_ROUTES, 
  DEMO_VEHICLES, 
  getDemoLocations, 
  updateDemoVehicles 
} from '../services/demoService';
import { fetchRoutes, fetchVehiclesForRoute, subscribeToLiveLocations, submitCheckIn } from '../firebase/operations';
import { isFirebaseConfigured } from '../firebase/config';
import { getNearestVehicles } from '../services/etaService';
import feederRoutesData from '../data/feederRoutes.json';

// =====================================================
// COMPONENT
// =====================================================

export const RouteDetailsPage: React.FC = () => {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const { settings, userLocation, userState } = useApp();
  const lang = settings.language;

  // State
  const [route, setRoute] = useState<Route | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [liveLocations, setLiveLocations] = useState<LiveLocation[]>([]);
  const [vehiclesWithETA, setVehiclesWithETA] = useState<VehicleWithETA[]>([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD ROUTE DATA
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      if (!routeId) return;
      setLoading(true);

      // Convert feeder routes to Route type
      const feederRoutes: Route[] = feederRoutesData.routes.map(route => ({
        id: route.id,
        name: route.name,
        nameUrdu: route.nameUrdu,
        startPoint: route.waypoints[0].name,
        endPoint: route.waypoints[route.waypoints.length - 1].name,
        waypoints: route.waypoints.map(wp => ({ lat: wp.lat, lng: wp.lng })),
        color: route.color,
        vehicleType: route.vehicleType as 'metro' | 'orange-line' | 'bus',
        averageSpeed: route.avgSpeed,
        fare: route.fare,
        isActive: true,
        createdAt: Date.now(),
      }));

      // Check feeder routes first
      const feederRoute = feederRoutes.find(r => r.id === routeId);
      if (feederRoute) {
        setRoute(feederRoute);
        // Get vehicles from feederRoutesData
        const feederVehicles = feederRoutesData.vehicles
          .filter(v => v.routeId === routeId)
          .map(v => ({
            id: v.id,
            routeId: v.routeId,
            plateNumber: v.plateNumber,
            driverName: v.driverName,
            vehicleType: v.vehicleType as VehicleType,
            capacity: v.capacity,
            isActive: true,
            registeredAt: Date.now(),
          }));
        setVehicles(feederVehicles);
        setLoading(false);
        return;
      }

      // Check demo routes
      const demoRoute = DEMO_ROUTES.find(r => r.id === routeId);
      if (demoRoute) {
        setRoute(demoRoute);
        setVehicles(DEMO_VEHICLES.filter(v => v.routeId === routeId));
        setLoading(false);
        return;
      }

      // Try Firebase if configured
      if (isFirebaseConfigured()) {
        try {
          const routes = await fetchRoutes();
          const foundRoute = routes.find(r => r.id === routeId);
          if (foundRoute) {
            setRoute(foundRoute);
            const firebaseVehicles = await fetchVehiclesForRoute(routeId);
            setVehicles(firebaseVehicles);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error loading route:', error);
        }
      }

      // Route not found
      setRoute(null);
      setVehicles([]);
      setLoading(false);
    };

    loadData();
  }, [routeId]);

  // =====================================================
  // SUBSCRIBE TO LIVE LOCATIONS
  // =====================================================

  useEffect(() => {
    if (!routeId) return;

    if (!isFirebaseConfigured()) {
      // Use demo/simulated locations
      const updateLocations = () => {
        updateDemoVehicles();
        setLiveLocations(getDemoLocations(routeId));
      };

      updateLocations();
      const interval = setInterval(updateLocations, CONFIG.DEMO_UPDATE_INTERVAL);
      return () => clearInterval(interval);
    } else {
      // Firebase subscription
      return subscribeToLiveLocations(routeId, setLiveLocations);
    }
  }, [routeId]);

  // =====================================================
  // CALCULATE ETAs
  // =====================================================

  useEffect(() => {
    if (!route || !userLocation || liveLocations.length === 0) {
      setVehiclesWithETA([]);
      return;
    }

    const nearest = getNearestVehicles(
      liveLocations,
      userLocation,
      route.waypoints,
      route.averageSpeed,
      3
    );

    setVehiclesWithETA(nearest);
  }, [route, userLocation, liveLocations]);

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleCheckIn = useCallback(async () => {
    if (!route || !userLocation) return;

    if (!settings.demoMode && isFirebaseConfigured()) {
      await submitCheckIn({
        routeId: route.id,
        location: userLocation,
        timestamp: Date.now(),
        userId: userState.anonymousId,
      });
    }
  }, [route, userLocation, settings.demoMode, userState.anonymousId]);

  // =====================================================
  // RENDER
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="spinner" />
      </div>
    );
  }

  if (!route) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <span className="text-6xl mb-4">🚫</span>
        <p className="text-xl text-gray-600 mb-4">
          {lang === 'ur' ? 'راستہ نہیں ملا' : 'Route not found'}
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">
          {t('back', lang)}
        </button>
      </div>
    );
  }

  const vehicleConfig = VEHICLE_CONFIG[route.vehicleType];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white p-4 safe-top">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
          >
            ←
          </button>
          <div>
            <h1 className={`text-xl font-bold ${lang === 'ur' ? 'text-urdu' : ''}`}>
              {lang === 'ur' ? route.nameUrdu : route.name}
            </h1>
            <p className="text-sm opacity-80">{t('routeDetails', lang)}</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6 pb-safe">
        {/* Route Info Card */}
        <div 
          className="bg-white rounded-2xl p-5 shadow-md border-l-4"
          style={{ borderLeftColor: route.color }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span 
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${vehicleConfig.color}20` }}
            >
              {vehicleConfig.icon}
            </span>
            <div>
              <p className="text-sm text-gray-500">{t('from', lang)}</p>
              <p className="font-medium">{route.startPoint}</p>
            </div>
            <span className="text-2xl text-primary">→</span>
            <div>
              <p className="text-sm text-gray-500">{t('to', lang)}</p>
              <p className="font-medium">{route.endPoint}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-gray-500">{t('fare', lang)}</span>
            <span className="text-2xl font-bold text-primary">
              {route.fare} {t('pkr', lang)}
            </span>
          </div>
        </div>

        {/* Live Vehicles */}
        <section>
          <h2 className={`text-lg font-bold mb-3 ${lang === 'ur' ? 'text-urdu' : ''}`}>
            {t('vehiclesNearby', lang)}
          </h2>

          {vehiclesWithETA.length > 0 ? (
            <div className="space-y-3">
              {vehiclesWithETA.map(vehicle => {
                const vehicleInfo = vehicles.find(v => v.id === vehicle.vehicleId);
                return (
                  <ETACard
                    key={vehicle.vehicleId}
                    eta={vehicle.eta}
                    vehicleType={route.vehicleType}
                    vehicleId={vehicle.vehicleId}
                    plateNumber={vehicleInfo?.plateNumber}
                  />
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center shadow-md">
              <span className="text-5xl block mb-3 opacity-50">🚌</span>
              <p className="text-gray-500">{t('noVehicles', lang)}</p>
            </div>
          )}
        </section>

        {/* Check-In */}
        <section>
          <h2 className={`text-lg font-bold mb-3 ${lang === 'ur' ? 'text-urdu' : ''}`}>
            {lang === 'ur' ? 'گاڑی کی اطلاع دیں' : 'Report Vehicle'}
          </h2>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <CheckInButton onCheckIn={handleCheckIn} />
          </div>
        </section>

        {/* Driver Mode */}
        <section>
          <DriverModeToggle
            routeId={route.id}
            vehicleId={vehicles[0]?.id}
          />
        </section>

        {/* Data Source */}
        <p className="text-center text-sm text-gray-500 pt-4">
          {settings.demoMode
            ? `🎮 ${t('demoModeOn', lang)}`
            : `📡 ${lang === 'ur' ? 'لائیو ڈیٹا' : 'Live Data'}`}
        </p>
      </main>
    </div>
  );
};

export default RouteDetailsPage;

