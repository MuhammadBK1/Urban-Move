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
    <nav className="fixed bottom-0 left-0 right-0 z-50" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-2xl mx-auto border-t" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                  active
                    ? 'text-[#0F9D58]'
                    : 'text-[#64748B] hover:text-[#334155]'
                }`}
              >
                <span className={`text-xl mb-0.5 transition-all duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
                  {item.icon}
                </span>
                <span className={`text-[10px] font-medium transition-all ${active ? 'font-semibold' : 'font-normal'}`} style={{ letterSpacing: '0.02em' }}>
                  {lang === 'ur' ? item.labelUr : item.labelEn}
                </span>
                {active && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 rounded-full transition-all duration-200" style={{ background: '#0F9D58' }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;

