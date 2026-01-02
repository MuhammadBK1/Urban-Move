/**
 * =====================================================
 * THREE-DOT MENU COMPONENT
 * =====================================================
 * 
 * Overflow menu (⋮) for navigation
 * Google Maps style menu
 * =====================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface MenuItem {
  icon: string;
  labelEn: string;
  labelUr: string;
  path: string;
  action?: () => void;
}

export const ThreeDotMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useApp();
  const lang = settings.language;

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    if (window.confirm(lang === 'ur' ? 'کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟' : 'Are you sure you want to logout?')) {
      localStorage.removeItem('urbanmove_auth');
      navigate('/login', { replace: true });
    }
  };

  const menuItems: MenuItem[] = [
    { icon: '👤', labelEn: 'Profile', labelUr: 'پروفائل', path: '/user-info' },
    { icon: '⭐', labelEn: 'Favorites', labelUr: 'پسندیدہ', path: '/favorites' },
    { icon: '🗺️', labelEn: 'Map', labelUr: 'نقشہ', path: '/map' },
    { icon: '🧭', labelEn: 'Routes', labelUr: 'راستے', path: '/best-route' },
    { icon: 'ℹ️', labelEn: 'App Info', labelUr: 'ایپ کی معلومات', path: '/app-info' },
    { icon: '🚪', labelEn: 'Logout', labelUr: 'لاگ آؤٹ', path: '/login', action: handleLogout },
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.action) {
      item.action();
    } else {
      navigate(item.path);
    }
    setIsOpen(false);
  };

  // Don't show on login page
  if (location.pathname === '/login' || location.pathname.startsWith('/route/')) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label={lang === 'ur' ? 'مینو' : 'Menu'}
      >
        <span className="text-xl">⋮</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuItemClick(item)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                location.pathname === item.path ? 'bg-green-50 text-green-700' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="flex-1">{lang === 'ur' ? item.labelUr : item.labelEn}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThreeDotMenu;

