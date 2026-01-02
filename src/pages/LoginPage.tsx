/**
 * =====================================================
 * LOGIN PAGE
 * =====================================================
 * 
 * Initial login/signup page for Urban Move
 * Simple authentication with localStorage
 * =====================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'urbanmove_auth';

interface AuthData {
  isAuthenticated: boolean;
  userId: string;
  loginTime: number;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useApp();
  const lang = settings.language;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const auth = localStorage.getItem(STORAGE_KEY);
    if (auth) {
      try {
        const authData: AuthData = JSON.parse(auth);
        if (authData.isAuthenticated) {
          navigate('/map', { replace: true });
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    }
  }, [navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Login logic - phone required, name optional
    if (!formData.phone.trim()) {
      toast.error(lang === 'ur' ? 'فون نمبر درج کریں' : 'Please enter phone number');
      setLoading(false);
      return;
    }

    // Save user info if name provided
    if (formData.name.trim()) {
      const existingInfo = localStorage.getItem('urbanmove_user_info');
      const userInfo = existingInfo 
        ? { ...JSON.parse(existingInfo), name: formData.name, phone: formData.phone }
        : { name: formData.name, phone: formData.phone, createdAt: Date.now() };
      localStorage.setItem('urbanmove_user_info', JSON.stringify(userInfo));
    }

    // Create auth session
    const authData: AuthData = {
      isAuthenticated: true,
      userId: `user_${Date.now()}`,
      loginTime: Date.now(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    toast.success(lang === 'ur' ? 'خوش آمدید!' : 'Welcome!');
    navigate('/map', { replace: true });

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F7F9FC' }}>
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-green-600 text-white text-4xl font-bold px-6 py-3 rounded-2xl mb-4 shadow-lg">
            Urban Move
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {lang === 'ur' ? 'خوش آمدید' : 'Welcome'}
          </h1>
          <p className="text-gray-600">
            {lang === 'ur' ? 'لاگ ان کریں' : 'Sign in to continue'}
          </p>
        </div>

        {/* Login/Signup Card */}
        <div className="card p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {lang === 'ur' ? 'فون نمبر' : 'Phone Number'} <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full"
                placeholder={lang === 'ur' ? '03XX-XXXXXXX' : '03XX-XXXXXXX'}
                required
              />
            </div>

            {/* Name (Optional for first-time users) */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {lang === 'ur' ? 'نام' : 'Name'} <span className="text-gray-400 text-xs">({lang === 'ur' ? 'اختیاری' : 'Optional'})</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full"
                placeholder={lang === 'ur' ? 'اپنا نام درج کریں (پہلی بار)' : 'Enter your name (first time)'}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? (lang === 'ur' ? 'لوڈ ہو رہا ہے...' : 'Loading...')
                : (lang === 'ur' ? 'لاگ ان کریں' : 'Sign In')
              }
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            {lang === 'ur' 
              ? 'لاگ ان کر کے، آپ ہماری شرائط و ضوابط سے متفق ہیں'
              : 'By signing in, you agree to our Terms & Conditions'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

