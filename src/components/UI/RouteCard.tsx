/**
 * =====================================================
 * ROUTE CARD COMPONENT
 * =====================================================
 * 
 * Displays route information in a tappable card.
 * Shows route name, vehicle type, fare, and vehicle count.
 * =====================================================
 */

import React from 'react';
import { Route } from '../../types';
import { VEHICLE_CONFIG, t } from '../../constants';
import { useApp } from '../../context/AppContext';

// =====================================================
// PROPS
// =====================================================

interface RouteCardProps {
  route: Route;
  vehicleCount?: number;
  isSelected?: boolean;
  onClick: () => void;
}

// =====================================================
// COMPONENT
// =====================================================

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  vehicleCount = 0,
  isSelected = false,
  onClick,
}) => {
  const { settings } = useApp();
  const lang = settings.language;
  const vehicleConfig = VEHICLE_CONFIG[route.vehicleType];

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-2xl border-l-4 transition-all duration-200
        ${isSelected 
          ? 'bg-white shadow-lg scale-[1.02]' 
          : 'bg-white/90 hover:bg-white hover:shadow-md'
        }
      `}
      style={{ borderLeftColor: route.color }}
    >
      {/* Route Name */}
      <h3 className={`font-bold text-lg text-gray-900 mb-1 ${lang === 'ur' ? 'text-urdu' : ''}`}>
        {lang === 'ur' ? route.nameUrdu : route.name}
      </h3>

      {/* Endpoints */}
      <p className="text-sm text-gray-600 mb-3">
        {route.startPoint} <span className="text-primary font-bold">→</span> {route.endPoint}
      </p>

      {/* Footer: Vehicle Type, Fare, Count */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Vehicle Type Badge */}
        <span 
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm font-medium"
          style={{ backgroundColor: vehicleConfig.color }}
        >
          <span>{vehicleConfig.icon}</span>
          <span>{vehicleConfig.label}</span>
        </span>

        {/* Fare */}
        <span className="text-sm text-gray-600">
          {t('fare', lang)}: <span className="font-bold text-primary">{route.fare} {t('pkr', lang)}</span>
        </span>

        {/* Vehicle Count */}
        {vehicleCount > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
            {vehicleCount} 🚗
          </span>
        )}
      </div>
    </button>
  );
};

export default RouteCard;

