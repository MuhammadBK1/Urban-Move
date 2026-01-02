/**
 * =====================================================
 * APP HEADER COMPONENT
 * =====================================================
 * 
 * Shared header with title and three-dot menu
 * Used across all main pages
 * =====================================================
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ThreeDotMenu } from './ThreeDotMenu';
import { TRANSLATIONS } from '../constants';

interface AppHeaderProps {
  title?: string;
  showSearch?: boolean;
  onSearchClick?: () => void;
  searchPlaceholder?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showSearch = false,
  onSearchClick,
  searchPlaceholder,
}) => {
  const location = useLocation();
  const { settings } = useApp();
  const lang = settings.language;

  // Don't show on login or map page (map has its own floating search)
  if (location.pathname === '/login' || location.pathname === '/map') {
    return null;
  }

  const displayTitle = title || TRANSLATIONS.appName[lang];

  return (
    <header className="sticky top-0 z-40" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E2E8F0' }}>
      <div className="flex items-center justify-between px-4 py-4 max-w-2xl mx-auto">
        <h1 className="text-xl font-semibold flex-1" style={{ color: '#0F172A', letterSpacing: '-0.02em' }}>
          {displayTitle}
        </h1>

        {showSearch && (
          <button
            onClick={onSearchClick}
            className="flex-1 mx-4 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-left text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span className="text-gray-400 mr-2">🔍</span>
            {searchPlaceholder || (lang === 'ur' ? 'تلاش کریں...' : 'Search...')}
          </button>
        )}

        <ThreeDotMenu />
      </div>
    </header>
  );
};

export default AppHeader;

