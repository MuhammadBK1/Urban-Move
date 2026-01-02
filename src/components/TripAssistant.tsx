/**
 * =====================================================
 * TRIP ASSISTANCE COMPONENT
 * =====================================================
 * 
 * Context-aware trip assistance:
 * - "Get ready to get off" alerts
 * - Next stop highlighting
 * - Transfer cues
 * =====================================================
 */

import React, { useState, useEffect } from 'react';
import { Coordinate } from '../types';
import { useApp } from '../context/AppContext';
import { calculateDistance } from '../services/mapService';

interface TripStep {
  type: 'walk' | 'bus' | 'metro';
  from: string;
  to: string;
  fromCoords?: Coordinate;
  toCoords?: Coordinate;
  currentStop?: string;
  nextStop?: string;
}

interface TripAssistantProps {
  activeTrip: {
    steps: TripStep[];
    currentStepIndex: number;
  } | null;
  onNextStopReached?: () => void;
}

const ALERT_DISTANCE = 0.3; // km - alert when 300m from stop

export const TripAssistant: React.FC<TripAssistantProps> = ({
  activeTrip,
  onNextStopReached,
}) => {
  const { settings, userLocation } = useApp();
  const lang = settings.language;
  const [alert, setAlert] = useState<string | null>(null);
  const [nextStopInfo, setNextStopInfo] = useState<{ name: string; distance: number } | null>(null);

  useEffect(() => {
    if (!activeTrip || !userLocation) {
      setAlert(null);
      setNextStopInfo(null);
      return;
    }

    const currentStep = activeTrip.steps[activeTrip.currentStepIndex];
    if (!currentStep || !currentStep.toCoords) {
      return;
    }

    const distanceToDestination = calculateDistance(userLocation, currentStep.toCoords);
    const distanceKm = distanceToDestination;

    // Check if approaching destination stop
    if (distanceKm <= ALERT_DISTANCE && distanceKm > 0.05) {
      setAlert(
        lang === 'ur' 
          ? `⚠️ ${currentStep.to} پر اترنے کے لیے تیار ہو جائیں`
          : `⚠️ Get ready to get off at ${currentStep.to}`
      );
    } else if (distanceKm <= 0.05) {
      setAlert(
        lang === 'ur'
          ? `✓ ${currentStep.to} پہنچ گئے`
          : `✓ Arrived at ${currentStep.to}`
      );
      if (onNextStopReached) {
        setTimeout(() => onNextStopReached(), 2000);
      }
    } else {
      setAlert(null);
    }

    // Show next stop info
    if (currentStep.nextStop && currentStep.toCoords) {
      setNextStopInfo({
        name: currentStep.nextStop,
        distance: distanceKm,
      });
    } else {
      setNextStopInfo(null);
    }
  }, [activeTrip, userLocation, lang, onNextStopReached]);

  if (!activeTrip || !alert) {
    return null;
  }

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔔</span>
          <div className="flex-1">
            <p className="font-semibold text-yellow-800">{alert}</p>
            {nextStopInfo && (
              <p className="text-sm text-yellow-700 mt-1">
                {lang === 'ur' 
                  ? `اگلا اسٹاپ: ${nextStopInfo.name} (${(nextStopInfo.distance * 1000).toFixed(0)}m)`
                  : `Next stop: ${nextStopInfo.name} (${(nextStopInfo.distance * 1000).toFixed(0)}m)`
                }
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripAssistant;

