/**
 * =====================================================
 * INSTALL PROMPT COMPONENT
 * =====================================================
 * 
 * Shows install button when PWA is installable
 * =====================================================
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { isAppInstalled, isInstallPromptAvailable, showInstallPrompt } from '../utils/pwaService';
import toast from 'react-hot-toast';

export const InstallPrompt: React.FC = () => {
  const { settings } = useApp();
  const lang = settings.language;
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (isAppInstalled()) {
      return;
    }

    // Listen for install prompt availability
    const handleInstallable = () => {
      setShowPrompt(true);
    };

    const handleInstalled = () => {
      setShowPrompt(false);
    };

    window.addEventListener('pwa-installable', handleInstallable);
    window.addEventListener('pwa-installed', handleInstalled);

    // Check if prompt is already available
    if (isInstallPromptAvailable()) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener('pwa-installable', handleInstallable);
      window.removeEventListener('pwa-installed', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    const installed = await showInstallPrompt();
    if (installed) {
      toast.success(lang === 'ur' ? 'ایپ انسٹال ہو گئی!' : 'App installed successfully!');
      setShowPrompt(false);
    }
  };

  if (!showPrompt || isAppInstalled()) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div className="card p-4 shadow-xl border-2" style={{ borderColor: '#0F9D58' }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">📱</span>
          <div className="flex-1">
            <h3 className="font-semibold" style={{ color: '#0F172A' }}>
              {lang === 'ur' ? 'Urban Move انسٹال کریں' : 'Install Urban Move'}
            </h3>
            <p className="text-sm" style={{ color: '#64748B' }}>
              {lang === 'ur' 
                ? 'آف لائن استعمال کریں اور تیز رسائی حاصل کریں'
                : 'Use offline and get quick access'
              }
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            className="flex-1 btn-primary text-sm py-2.5"
          >
            {lang === 'ur' ? 'انسٹال کریں' : 'Install'}
          </button>
          <button
            onClick={() => setShowPrompt(false)}
            className="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ background: '#F1F5F9', color: '#64748B' }}
          >
            {lang === 'ur' ? 'بعد میں' : 'Later'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;

