/**
 * =====================================================
 * BOTTOM NAVIGATION COMPONENT
 * =====================================================
 * 
 * Bottom navigation bar for switching between pages
 * Google Maps / Moovit style navigation
 * =====================================================
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface NavItem {
  path: string;
  icon: string;
  labelEn: string;
  labelUr: string;
}

const navItems: NavItem[] = [
  { path: '/user-info', icon: '👤', labelEn: 'Profile', labelUr: 'پروفائل' },
  { path: '/favorites', icon: '⭐', labelEn: 'Favorites', labelUr: 'پسندیدہ' },
  { path: '/map', icon: '🗺️', labelEn: 'Map', labelUr: 'نقشہ' },
  { path: '/best-route', icon: '🧭', labelEn: 'Route', labelUr: 'راستہ' },
  { path: '/app-info', icon: 'ℹ️', labelEn: 'Info', labelUr: 'معلومات' },
];

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useApp();
  const lang = settings.language;

  const isActive = (path: string) => {
    // Don't highlight on route details page
    if (location.pathname.startsWith('/route/')) {
      return false;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Hide navigation on login and route details pages
  if (location.pathname === '/login' || location.pathname.startsWith('/route/')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white z-50 shadow-lg border-t border-gray-100">
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                active
                  ? 'text-[#0F9D58]'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
            >
              <span className={`text-2xl mb-1 transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              <span className={`text-xs font-medium transition-colors ${active ? 'font-semibold' : ''}`}>
                {lang === 'ur' ? item.labelUr : item.labelEn}
              </span>
              {active && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-[#0F9D58] rounded-t-full transition-all duration-200" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;

