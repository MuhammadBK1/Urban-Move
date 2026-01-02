/**
 * =====================================================
 * FAVORITES PAGE
 * =====================================================
 * 
 * Manage favorite locations (Home, Work, etc.)
 * - Add, edit, and delete favorites
 * - Store persistently in localStorage
 * =====================================================
 */

import React, { useState, useEffect } from 'react';
import { Coordinate } from '../types';
import { useApp } from '../context/AppContext';
import { MapPicker, AppHeader } from '../components';
import toast from 'react-hot-toast';

interface FavoriteLocation {
  id: string;
  name: string;
  coordinates: Coordinate;
  icon?: string;
}

const STORAGE_KEY = 'urbanmove_favorites';

export const FavoritesPage: React.FC = () => {
  const { settings, userLocation } = useApp();
  const lang = settings.language;

  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', icon: '📍' });
  const [selectedLocation, setSelectedLocation] = useState<Coordinate | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  // Load favorites
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  const saveFavorites = (newFavorites: FavoriteLocation[]) => {
    setFavorites(newFavorites);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
  };

  const handleAdd = () => {
    if (!formData.name.trim()) {
      toast.error(lang === 'ur' ? 'نام درج کریں' : 'Please enter a name');
      return;
    }

    if (!selectedLocation) {
      toast.error(lang === 'ur' ? 'نقشہ سے مقام منتخب کریں' : 'Please select location from map');
      return;
    }

    const newFavorite: FavoriteLocation = {
      id: editingId || `fav_${Date.now()}`,
      name: formData.name,
      coordinates: selectedLocation,
      icon: formData.icon,
    };

    if (editingId) {
      const updated = favorites.map(f => f.id === editingId ? newFavorite : f);
      saveFavorites(updated);
      toast.success(lang === 'ur' ? 'مقام اپ ڈیٹ ہو گیا' : 'Location updated');
    } else {
      saveFavorites([...favorites, newFavorite]);
      toast.success(lang === 'ur' ? 'مقام شامل ہو گیا' : 'Location added');
    }

    setShowAddModal(false);
    setEditingId(null);
    setFormData({ name: '', icon: '📍' });
    setSelectedLocation(null);
    setSelectedAddress('');
  };

  const handleEdit = (favorite: FavoriteLocation) => {
    setFormData({
      name: favorite.name,
      icon: favorite.icon || '📍',
    });
    setSelectedLocation(favorite.coordinates);
    setEditingId(favorite.id);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(lang === 'ur' ? 'کیا آپ واقعی اس مقام کو حذف کرنا چاہتے ہیں؟' : 'Are you sure you want to delete this location?')) {
      const updated = favorites.filter(f => f.id !== id);
      saveFavorites(updated);
      toast.success(lang === 'ur' ? 'مقام حذف ہو گیا' : 'Location deleted');
    }
  };

  const handleMapSelect = (location: Coordinate, address?: string) => {
    setSelectedLocation(location);
    setSelectedAddress(address || '');
  };

  const commonIcons = ['🏠', '🏢', '🏥', '🛒', '🎓', '📍', '⭐', '❤️'];

  return (
    <div className="min-h-screen pb-20" style={{ background: '#F8FAFC' }}>
      <AppHeader title={lang === 'ur' ? 'پسندیدہ' : 'Favorites'} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {lang === 'ur' ? 'پسندیدہ مقامات' : 'Favorite Locations'}
            </h1>
            <p className="text-gray-600">
              {lang === 'ur' ? 'اپنے پسندیدہ مقامات کو محفوظ کریں' : 'Save your favorite locations'}
            </p>
          </div>
          <button
            onClick={() => {
              setFormData({ name: '', icon: '📍' });
              setEditingId(null);
              setShowAddModal(true);
            }}
            className="btn-primary"
          >
            {lang === 'ur' ? '+ شامل کریں' : '+ Add'}
          </button>
        </div>

        {/* Favorites List */}
        {favorites.length === 0 ? (
          <div className="card p-12 text-center">
            <span className="text-5xl mb-4 block">⭐</span>
            <p className="text-gray-600 mb-4">
              {lang === 'ur' ? 'ابھی تک کوئی پسندیدہ مقام نہیں' : 'No favorite locations yet'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-green-600 font-medium hover:underline"
            >
              {lang === 'ur' ? 'پہلا مقام شامل کریں' : 'Add your first location'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{favorite.icon || '📍'}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{favorite.name}</h3>
                      <p className="text-sm text-gray-500">
                        {favorite.coordinates.lat.toFixed(6)}, {favorite.coordinates.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(favorite)}
                      className="px-3 py-1 text-sm btn-secondary rounded-lg text-sm"
                    >
                      {lang === 'ur' ? 'ترمیم' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDelete(favorite.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all hover:shadow-sm"
                    >
                      {lang === 'ur' ? 'حذف' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingId 
                  ? (lang === 'ur' ? 'مقام ترمیم کریں' : 'Edit Location')
                  : (lang === 'ur' ? 'نیا مقام شامل کریں' : 'Add New Location')
                }
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {lang === 'ur' ? 'نام' : 'Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder={lang === 'ur' ? 'مثال: گھر، دفتر' : 'e.g., Home, Work'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {lang === 'ur' ? 'آئیکن' : 'Icon'}
                  </label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {commonIcons.map(icon => (
                      <button
                        key={icon}
                        onClick={() => setFormData(prev => ({ ...prev, icon }))}
                        className={`w-10 h-10 text-xl rounded-lg border-2 transition-colors ${
                          formData.icon === icon
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Or enter emoji"
                    maxLength={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {lang === 'ur' ? 'مقام منتخب کریں' : 'Select Location'} <span className="text-red-500">*</span>
                  </label>
                  <MapPicker
                    initialLocation={selectedLocation || userLocation || undefined}
                    onLocationSelect={handleMapSelect}
                    className="mb-2"
                  />
                  {selectedAddress && (
                    <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                      {selectedAddress}
                    </p>
                  )}
                  {userLocation && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLocation(userLocation);
                        handleMapSelect(userLocation);
                      }}
                      className="w-full mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      {lang === 'ur' ? '📍 موجودہ مقام استعمال کریں' : '📍 Use Current Location'}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingId(null);
                    setFormData({ name: '', icon: '📍' });
                    setSelectedLocation(null);
                    setSelectedAddress('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {lang === 'ur' ? 'منسوخ' : 'Cancel'}
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!selectedLocation}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingId 
                    ? (lang === 'ur' ? 'اپ ڈیٹ' : 'Update')
                    : (lang === 'ur' ? 'شامل کریں' : 'Add')
                  }
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;

