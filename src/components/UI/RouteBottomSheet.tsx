/**
 * =====================================================
 * ROUTE BOTTOM SHEET COMPONENT
 * =====================================================
 * 
 * Uber / Google Maps style route selection UI
 * - Collapsed/expanded states
 * - Route cards with ETA, cost, transfers, mode icons
 * - Smooth animations
 * - Mobile-first design
 * =====================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { Coordinate } from '../../types';
import { formatDuration, formatDistance } from '../../services/mapboxDirectionsService';

// =====================================================
// TYPES
// =====================================================

export interface RouteOption {
  id: string;
  type: 'driving' | 'transit' | 'multimodal';
  duration: number; // in seconds
  distance: number; // in meters
  cost: number; // in PKR
  transfers: number;
  steps: RouteStep[];
  geometry?: GeoJSON.LineString;
  isBest?: boolean;
}

export interface RouteStep {
  type: 'walk' | 'bus' | 'metro' | 'driving';
  from: Coordinate;
  to: Coordinate;
  fromName: string;
  toName: string;
  duration: number;
  distance: number;
  instruction: string;
}

interface RouteBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  routes: RouteOption[];
  selectedRouteId: string | null;
  onRouteSelect: (routeId: string) => void;
  onRouteExpand?: (routeId: string) => void;
  lang: 'en' | 'ur';
  routeStart: Coordinate | null;
  routeDestination: Coordinate | null;
}

// =====================================================
// COMPONENT
// =====================================================

export const RouteBottomSheet: React.FC<RouteBottomSheetProps> = ({
  isOpen,
  onClose,
  routes,
  selectedRouteId,
  onRouteSelect,
  onRouteExpand,
  lang,
  routeStart: _routeStart,
  routeDestination: _routeDestination,
}) => {
  const [height, setHeight] = useState(30); // Collapsed height (vh)
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const SNAP_POINTS = [30, 60, 90]; // Collapsed, Mid, Expanded (vh)

  useEffect(() => {
    if (isOpen) {
      setHeight(SNAP_POINTS[0]); // Start collapsed
    } else {
      setHeight(0);
      setExpandedRouteId(null);
    }
  }, [isOpen]);

  // Auto-expand when route is selected
  useEffect(() => {
    if (selectedRouteId && isOpen) {
      setExpandedRouteId(selectedRouteId);
      setHeight(SNAP_POINTS[2]); // Expand to full
    }
  }, [selectedRouteId, isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartHeight(height);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartHeight(height);
  };

  const handleMove = (clientY: number) => {
    if (!isDragging) return;
    const deltaY = startY - clientY;
    const newHeight = Math.max(
      SNAP_POINTS[0],
      Math.min(SNAP_POINTS[2], startHeight + (deltaY / window.innerHeight) * 100)
    );
    setHeight(newHeight);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    handleMove(e.touches[0].clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientY);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Snap to nearest point
    const nearest = SNAP_POINTS.reduce((prev, curr) =>
      Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev
    );
    setHeight(nearest);

    // Close if dragged to minimum
    if (nearest <= SNAP_POINTS[0] + 5) {
      onClose();
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, height, startY, startHeight]);

  const handleRouteClick = (route: RouteOption) => {
    onRouteSelect(route.id);
    if (onRouteExpand) {
      onRouteExpand(route.id);
    }
    setExpandedRouteId(route.id === expandedRouteId ? null : route.id);
    setHeight(route.id === expandedRouteId ? SNAP_POINTS[0] : SNAP_POINTS[2]);
  };

  const getModeIcon = (type: RouteStep['type']) => {
    switch (type) {
      case 'walk': return '🚶';
      case 'bus': return '🚌';
      case 'metro': return '🚇';
      case 'driving': return '🚗';
      default: return '📍';
    }
  };

  const getModeColor = (type: RouteStep['type']) => {
    switch (type) {
      case 'walk': return '#9E9E9E';
      case 'bus': return '#9C27B0';
      case 'metro': return '#FF6F00';
      case 'driving': return '#1A73E8';
      default: return '#666';
    }
  };

  if (!isOpen && height === 0) return null;

  const bestRoute = routes.find(r => r.isBest) || routes[0];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
          style={{ opacity: isOpen ? 1 : 0 }}
        />
      )}

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${100 - height}%)`,
          height: `${height}vh`,
          maxHeight: '90vh',
        }}
      >
        {/* Drag Handle */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleEnd}
          onMouseDown={handleMouseDown}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header - Collapsed View */}
        {height <= SNAP_POINTS[0] + 5 && (
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {routes.length} {lang === 'ur' ? 'راستے' : 'Routes'}
              </h2>
              {bestRoute && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white px-2 py-1 rounded" style={{ background: '#0F9D58' }}>
                    {lang === 'ur' ? 'بہترین' : 'BEST'}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    {formatDuration(bestRoute.duration)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div 
          className="overflow-y-auto px-4 pb-6"
          style={{ height: `calc(${height}vh - 60px)` }}
        >
          {/* Route Cards */}
          <div className="space-y-3">
            {routes.map((route, index) => {
              const isSelected = selectedRouteId === route.id;
              const isExpanded = expandedRouteId === route.id;
              const isBest = route.isBest || index === 0;

              return (
                <div
                  key={route.id}
                  className={`rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                    isSelected
                      ? 'shadow-xl scale-[1.02]'
                      : 'shadow-md hover:shadow-lg'
                  } ${
                    isBest
                      ? 'border-green-500 bg-gradient-to-br from-green-50 to-white'
                      : 'border-gray-200 bg-white'
                  }`}
                  onClick={() => handleRouteClick(route)}
                >
                  {/* Route Card Header */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {isBest && (
                            <span className="text-xs font-bold text-white px-2 py-1 rounded" style={{ background: '#0F9D58' }}>
                              {lang === 'ur' ? 'بہترین' : 'BEST'}
                            </span>
                          )}
                          <span className={`text-2xl font-bold ${isBest ? 'text-green-600' : 'text-gray-900'}`}>
                            {formatDuration(route.duration)}
                          </span>
                          {isSelected && (
                            <span className="text-xs text-green-600 font-medium">
                              ✓ {lang === 'ur' ? 'منتخب' : 'Selected'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>{formatDistance(route.distance)}</span>
                          <span>•</span>
                          <span>Rs. {route.cost}</span>
                          <span>•</span>
                          <span>
                            {route.transfers} {lang === 'ur' ? 'تبدیلی' : route.transfers === 1 ? 'transfer' : 'transfers'}
                          </span>
                        </div>
                      </div>
                      <div className="text-3xl">
                        {route.type === 'driving' ? '🚗' : route.type === 'transit' ? '🚌' : '🚇'}
                      </div>
                    </div>

                    {/* Mode Icons Preview */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {route.steps.slice(0, 4).map((step, idx) => (
                        <React.Fragment key={idx}>
                          <span
                            className="text-lg"
                            title={step.instruction}
                          >
                            {getModeIcon(step.type)}
                          </span>
                          {idx < route.steps.length - 1 && idx < 3 && (
                            <span className="text-gray-400 text-xs">→</span>
                          )}
                        </React.Fragment>
                      ))}
                      {route.steps.length > 4 && (
                        <span className="text-xs text-gray-500">
                          +{route.steps.length - 4} {lang === 'ur' ? 'مزید' : 'more'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Route Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
                      <div className="pt-4 space-y-3">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {lang === 'ur' ? 'راستے کے مراحل' : 'Route Steps'}
                        </h4>
                        {route.steps.map((step, stepIdx) => (
                          <div
                            key={stepIdx}
                            className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                          >
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                              style={{ backgroundColor: `${getModeColor(step.type)}20` }}
                            >
                              {getModeIcon(step.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm">
                                {step.instruction}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {step.fromName} → {step.toName}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                <span>{formatDuration(step.duration)}</span>
                                <span>•</span>
                                <span>{formatDistance(step.distance)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {routes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <span className="text-5xl mb-4">🗺️</span>
              <p className="text-gray-600 text-center">
                {lang === 'ur' ? 'کوئی راستہ نہیں ملا' : 'No routes found'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RouteBottomSheet;

