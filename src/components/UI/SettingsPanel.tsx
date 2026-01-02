/**
 * =====================================================
 * SETTINGS PANEL COMPONENT
 * =====================================================
 * 
 * Bottom panel for app settings.
 * Includes language, demo mode, and high contrast toggles.
 * =====================================================
 */

import React from 'react';
import { t } from '../../constants';
import { useApp } from '../../context/AppContext';

// =====================================================
// PROPS
// =====================================================

interface SettingsPanelProps {
  onClose: () => void;
}

// =====================================================
// COMPONENT
// =====================================================

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const { settings, updateSettings } = useApp();
  const lang = settings.language;

  // Toggle switch component
  const Toggle: React.FC<{ value: boolean; onChange: () => void }> = ({ value, onChange }) => (
    <button
      onClick={onChange}
      className={`
        relative w-14 h-8 rounded-full transition-colors duration-200
        ${value ? 'bg-primary' : 'bg-gray-300'}
      `}
    >
      <span
        className={`
          absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200
          ${value ? 'translate-x-7' : 'translate-x-1'}
        `}
      />
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl p-6 pb-10 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-6" />

        {/* Language Toggle */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌐</span>
            <div>
              <p className="font-medium text-gray-900">{t('language', lang)}</p>
              <p className="text-sm text-gray-500">{lang === 'ur' ? 'اردو' : 'English'}</p>
            </div>
          </div>
          <button
            onClick={() => updateSettings({ language: lang === 'en' ? 'ur' : 'en' })}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full"
          >
            <span className={lang === 'en' ? 'font-bold text-primary' : 'text-gray-500'}>EN</span>
            <span className="text-gray-400">|</span>
            <span className={lang === 'ur' ? 'font-bold text-primary' : 'text-gray-500'}>اردو</span>
          </button>
        </div>

        {/* Demo Mode Toggle */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎮</span>
            <div>
              <p className="font-medium text-gray-900">{t('demoMode', lang)}</p>
              <p className="text-sm text-gray-500">
                {settings.demoMode ? t('demoModeOn', lang) : t('demoModeOff', lang)}
              </p>
            </div>
          </div>
          <Toggle
            value={settings.demoMode}
            onChange={() => updateSettings({ demoMode: !settings.demoMode })}
          />
        </div>

        {/* High Contrast Toggle */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👁️</span>
            <div>
              <p className="font-medium text-gray-900">
                {lang === 'ur' ? 'ہائی کنٹراسٹ' : 'High Contrast'}
              </p>
              <p className="text-sm text-gray-500">
                {lang === 'ur' ? 'بہتر نظر آنے کے لیے' : 'For better visibility'}
              </p>
            </div>
          </div>
          <Toggle
            value={settings.highContrast}
            onChange={() => updateSettings({ highContrast: !settings.highContrast })}
          />
        </div>

        {/* App Info */}
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold text-primary">Urban Move</h2>
          <p className="text-sm text-gray-500 mt-1">v1.0.0</p>
          <p className="text-sm text-gray-500 mt-2">
            {lang === 'ur'
              ? 'پاکستان کے لیے ریئل ٹائم ٹرانزٹ ٹریکر'
              : 'Real-time transit tracker for Pakistan'}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-gray-100 rounded-xl font-medium text-gray-700 hover:bg-gray-200 transition-colors"
        >
          {t('cancel', lang)}
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;

