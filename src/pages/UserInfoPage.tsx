/**
 * =====================================================
 * USER INFO PAGE
 * =====================================================
 * 
 * Collects and stores user information:
 * - Name
 * - Phone number
 * - Home address
 * - Optional profile picture
 * =====================================================
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MapPicker, AppHeader } from '../components';
import { Coordinate } from '../types';
import toast from 'react-hot-toast';

interface UserInfo {
  name: string;
  phone: string;
  homeAddress: string;
  homeCoordinates?: Coordinate;
  profilePicture?: string;
}

const STORAGE_KEY = 'urbanmove_user_info';

export const UserInfoPage: React.FC = () => {
  const { settings } = useApp();
  const lang = settings.language;

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    phone: '',
    homeAddress: '',
    profilePicture: '',
  });

  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [showMapPicker, setShowMapPicker] = useState(false);

  // Load saved user info
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserInfo(parsed);
        if (parsed.profilePicture) {
          setProfileImagePreview(parsed.profilePicture);
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    }
  }, []);

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(lang === 'ur' ? 'تصویر بہت بڑی ہے (زیادہ سے زیادہ 2MB)' : 'Image too large (max 2MB)');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUserInfo(prev => ({ ...prev, profilePicture: base64String }));
        setProfileImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!userInfo.name.trim() || !userInfo.phone.trim() || !userInfo.homeAddress.trim()) {
      toast.error(lang === 'ur' ? 'براہ کرم تمام فیلڈز بھریں' : 'Please fill all required fields');
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo));
    toast.success(lang === 'ur' ? 'معلومات محفوظ ہو گئیں' : 'Information saved successfully');
  };

  const handleMapSelect = (location: Coordinate, address?: string) => {
    setUserInfo(prev => ({
      ...prev,
      homeCoordinates: location,
      homeAddress: address || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`,
    }));
    setShowMapPicker(false);
  };

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      <AppHeader title={lang === 'ur' ? 'پروفائل' : 'Profile'} />
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">

        {/* Profile Picture Card */}
        <div className="card mb-6">
          <label className="block text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            {lang === 'ur' ? 'پروفائل تصویر' : 'Profile Picture'}
            <span className="ml-2 text-xs font-normal" style={{ color: '#64748B' }}>({lang === 'ur' ? 'اختیاری' : 'Optional'})</span>
          </label>
          <div className="flex items-center gap-5">
            <div 
              className="w-28 h-28 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{ 
                background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                boxShadow: '0 2px 8px rgba(15, 157, 88, 0.12)',
                border: '3px solid white'
              }}
            >
              {profileImagePreview ? (
                <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl">👤</span>
              )}
            </div>
            <label className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="btn-secondary text-center text-sm py-3">
                {lang === 'ur' ? 'تصویر منتخب کریں' : 'Choose Image'}
              </div>
            </label>
          </div>
        </div>

        {/* User Info Form */}
        <div className="card space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-3" style={{ color: '#0F172A' }}>
              {lang === 'ur' ? 'نام' : 'Name'} <span className="text-red-500 font-normal">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={userInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full"
              placeholder={lang === 'ur' ? 'اپنا نام درج کریں' : 'Enter your name'}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold mb-3" style={{ color: '#0F172A' }}>
              {lang === 'ur' ? 'فون نمبر' : 'Phone Number'} <span className="text-red-500 font-normal">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={userInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full"
              placeholder={lang === 'ur' ? '03XX-XXXXXXX' : '03XX-XXXXXXX'}
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-semibold mb-3" style={{ color: '#0F172A' }}>
              {lang === 'ur' ? 'گھر کا پتہ' : 'Home Address'} <span className="text-red-500 font-normal">*</span>
            </label>
            <div className="space-y-3">
              <textarea
                id="address"
                value={userInfo.homeAddress}
                onChange={(e) => handleInputChange('homeAddress', e.target.value)}
                rows={3}
                className="w-full resize-none"
                placeholder={lang === 'ur' ? 'نقشہ سے منتخب کریں یا درج کریں' : 'Select from map or enter'}
              />
              <button
                type="button"
                onClick={() => setShowMapPicker(!showMapPicker)}
                className="w-full btn-secondary text-sm py-3"
              >
                {showMapPicker 
                  ? (lang === 'ur' ? '🗺️ نقشہ چھپائیں' : '🗺️ Hide Map')
                  : (lang === 'ur' ? '🗺️ نقشہ سے منتخب کریں' : '🗺️ Select from Map')
                }
              </button>
              {showMapPicker && (
                <MapPicker
                  initialLocation={userInfo.homeCoordinates}
                  onLocationSelect={handleMapSelect}
                  className="mt-2"
                />
              )}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full btn-primary mt-8"
          >
            {lang === 'ur' ? 'محفوظ کریں' : 'Save Information'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfoPage;

