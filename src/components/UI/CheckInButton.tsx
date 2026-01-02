/**
 * =====================================================
 * CHECK-IN BUTTON COMPONENT
 * =====================================================
 * 
 * Button for crowd-sourced vehicle check-ins.
 * Includes cooldown timer and success feedback.
 * =====================================================
 */

import React, { useState, useEffect } from 'react';
import { t, CONFIG } from '../../constants';
import { useApp } from '../../context/AppContext';

// =====================================================
// PROPS
// =====================================================

interface CheckInButtonProps {
  onCheckIn: () => Promise<void>;
  disabled?: boolean;
}

// =====================================================
// COMPONENT
// =====================================================

export const CheckInButton: React.FC<CheckInButtonProps> = ({
  onCheckIn,
  disabled = false,
}) => {
  const { settings, userState, recordCheckIn, canUserCheckIn } = useApp();
  const lang = settings.language;

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Update cooldown timer
  useEffect(() => {
    const updateCooldown = () => {
      if (userState.lastCheckIn) {
        const remaining = Math.max(
          0,
          Math.ceil((CONFIG.CHECKIN_COOLDOWN - (Date.now() - userState.lastCheckIn)) / 1000)
        );
        setCooldown(remaining);
      } else {
        setCooldown(0);
      }
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);
    return () => clearInterval(interval);
  }, [userState.lastCheckIn]);

  // Handle click
  const handleClick = async () => {
    if (!canUserCheckIn || disabled || isLoading) return;

    setIsLoading(true);
    try {
      await onCheckIn();
      recordCheckIn();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Check-in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = !canUserCheckIn || disabled || isLoading;

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`
          flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-xl
          transition-all duration-200 min-w-[280px]
          ${showSuccess 
            ? 'bg-green-500 text-white' 
            : isDisabled 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-secondary text-white hover:bg-secondary-light active:scale-95 shadow-lg'
          }
        `}
      >
        {isLoading ? (
          <div className="spinner w-6 h-6 border-white border-t-transparent" />
        ) : showSuccess ? (
          <>
            <span>✓</span>
            <span>{t('checkInSuccess', lang)}</span>
          </>
        ) : (
          <>
            <span className="text-2xl">📍</span>
            <span>{t('vehicleArrived', lang)}</span>
          </>
        )}
      </button>

      {/* Cooldown indicator */}
      {cooldown > 0 && !showSuccess && (
        <p className="text-sm text-gray-500">
          {t('checkInCooldown', lang)} ({cooldown}s)
        </p>
      )}

      {/* Contribution count */}
      <p className="text-sm text-gray-500">
        {lang === 'ur' ? 'آپ کی مدد:' : 'Your contributions:'} {userState.checkInCount}
      </p>
    </div>
  );
};

export default CheckInButton;

