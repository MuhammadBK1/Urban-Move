/**
 * =====================================================
 * ETA CARD COMPONENT
 * =====================================================
 * 
 * Displays ETA information for a vehicle.
 * Shows time, confidence level, and distance.
 * =====================================================
 */

import React from 'react';
import { ETAResult, VehicleType } from '../../types';
import { VEHICLE_CONFIG, t, CONFIDENCE_COLORS } from '../../constants';
import { useApp } from '../../context/AppContext';
import { formatDistance } from '../../services/etaService';

// =====================================================
// PROPS
// =====================================================

interface ETACardProps {
  eta: ETAResult;
  vehicleType: VehicleType;
  vehicleId: string;
  plateNumber?: string;
}

// =====================================================
// CONFIDENCE LABELS
// =====================================================

const getConfidenceLabel = (confidence: 'high' | 'medium' | 'low', lang: 'en' | 'ur'): string => {
  const labels = {
    high: { en: 'Live GPS', ur: 'لائیو جی پی ایس' },
    medium: { en: 'Recent', ur: 'حالیہ' },
    low: { en: 'Estimated', ur: 'تخمینی' },
  };
  return labels[confidence][lang];
};

// =====================================================
// COMPONENT
// =====================================================

export const ETACard: React.FC<ETACardProps> = ({
  eta,
  vehicleType,
  vehicleId: _vehicleId,
  plateNumber,
}) => {
  const { settings } = useApp();
  const lang = settings.language;
  const vehicleConfig = VEHICLE_CONFIG[vehicleType];
  const confidenceColor = CONFIDENCE_COLORS[eta.confidence];

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-md">
      {/* Vehicle Icon */}
      <div 
        className="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
        style={{ backgroundColor: `${vehicleConfig.color}20` }}
      >
        {vehicleConfig.icon}
      </div>

      {/* ETA Info */}
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-gray-900">{eta.minutes}</span>
          <span className="text-lg text-gray-500">{t('minutes', lang)}</span>
        </div>
        <p className="text-sm text-gray-500">{formatDistance(eta.distance)}</p>
        {plateNumber && (
          <p className="text-sm font-medium text-primary">{plateNumber}</p>
        )}
      </div>

      {/* Confidence Indicator */}
      <div className="flex flex-col items-center">
        <div 
          className="w-4 h-4 rounded-full mb-1"
          style={{ backgroundColor: confidenceColor }}
        />
        <span 
          className="text-xs font-medium text-center"
          style={{ color: confidenceColor }}
        >
          {getConfidenceLabel(eta.confidence, lang)}
        </span>
      </div>
    </div>
  );
};

// =====================================================
// MINI ETA BADGE
// =====================================================

interface MiniETABadgeProps {
  minutes: number;
  confidence: 'high' | 'medium' | 'low';
}

export const MiniETABadge: React.FC<MiniETABadgeProps> = ({ minutes, confidence }) => {
  const { settings } = useApp();
  const lang = settings.language;
  const bgColor = CONFIDENCE_COLORS[confidence];

  return (
    <span 
      className="inline-flex items-center justify-center px-3 py-1 rounded-full text-white text-sm font-bold"
      style={{ backgroundColor: bgColor }}
    >
      {minutes <= 1 ? (lang === 'ur' ? 'آ رہا' : 'Now') : `${minutes}m`}
    </span>
  );
};

export default ETACard;

