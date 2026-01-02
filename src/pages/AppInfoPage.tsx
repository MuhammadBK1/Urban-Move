/**
 * =====================================================
 * APP INFO & FEEDBACK PAGE
 * =====================================================
 * 
 * App description, version info, and feedback form
 * =====================================================
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components';
import toast from 'react-hot-toast';

const APP_VERSION = '1.0.0';

export const AppInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useApp();
  const lang = settings.language;

  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmitFeedback = () => {
    if (rating === 0) {
      toast.error(lang === 'ur' ? 'براہ کرم درجہ بندی منتخب کریں' : 'Please select a rating');
      return;
    }

    // Save feedback to localStorage (in real app, send to server)
    const feedbackData = {
      rating,
      feedback,
      timestamp: Date.now(),
      version: APP_VERSION,
    };

    const existing = JSON.parse(localStorage.getItem('urbanmove_feedback') || '[]');
    existing.push(feedbackData);
    localStorage.setItem('urbanmove_feedback', JSON.stringify(existing));

    toast.success(lang === 'ur' ? 'آپ کے تبصرے کا شکریہ!' : 'Thank you for your feedback!');
    setRating(0);
    setFeedback('');
  };

  const handleLogout = () => {
    if (window.confirm(lang === 'ur' ? 'کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟' : 'Are you sure you want to logout?')) {
      localStorage.removeItem('urbanmove_auth');
      toast.success(lang === 'ur' ? 'لاگ آؤٹ ہو گیا' : 'Logged out successfully');
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: '#F7F9FC' }}>
      <AppHeader title={lang === 'ur' ? 'معلومات' : 'Info'} />
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* App Description Card */}
        <div className="card p-6 mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {lang === 'ur' ? 'اربن موو کے بارے میں' : 'About Urban Move'}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {lang === 'ur' 
              ? 'اربن موو لاہور کے لیے ایک جدید پبلک ٹرانزٹ ٹریکنگ ایپ ہے۔ میٹرو بس، اورنج لائن، اور سرکاری بس سروسز کے لیے ریل ٹائم معلومات حاصل کریں۔'
              : 'Urban Move is a modern public transit tracking app for Lahore. Get real-time information for Metro Bus, Orange Line, and official bus services.'
            }
          </p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{lang === 'ur' ? 'ورژن' : 'Version'}</span>
              <span className="font-semibold text-gray-900">{APP_VERSION}</span>
            </div>
          </div>
        </div>

        {/* Features Card */}
        <div className="card p-6 mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {lang === 'ur' ? 'خصوصیات' : 'Features'}
          </h2>
          <ul className="space-y-3">
            {[
              { icon: '🗺️', en: 'Real-time route tracking', ur: 'ریل ٹائم راستہ ٹریکنگ' },
              { icon: '🚌', en: 'Metro Bus & Orange Line', ur: 'میٹرو بس اور اورنج لائن' },
              { icon: '⭐', en: 'Favorite locations', ur: 'پسندیدہ مقامات' },
              { icon: '📍', en: 'Live vehicle positions', ur: 'لائیو گاڑی کی پوزیشن' },
              { icon: '⏱️', en: 'ETA calculations', ur: 'متوقع وقت کا حساب' },
            ].map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-gray-700">{lang === 'ur' ? feature.ur : feature.en}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Feedback Form Card */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {lang === 'ur' ? 'تبصرہ بھیجیں' : 'Send Feedback'}
          </h2>

          {/* Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {lang === 'ur' ? 'درجہ بندی' : 'Rating'} <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-transform hover:scale-110 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Text */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {lang === 'ur' ? 'تبصرہ' : 'Feedback'}
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder={lang === 'ur' ? 'اپنا تبصرہ یہاں لکھیں...' : 'Write your feedback here...'}
            />
          </div>

          <button
            onClick={handleSubmitFeedback}
            className="w-full btn-primary"
          >
            {lang === 'ur' ? 'تبصرہ بھیجیں' : 'Submit Feedback'}
          </button>
        </div>

        {/* Logout Button */}
        <div className="card p-6 mt-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-all hover:shadow-md active:transform active:scale-95"
          >
            {lang === 'ur' ? 'لاگ آؤٹ کریں' : 'Logout'}
          </button>
        </div>

        {/* Contact Info */}
        <div className="card p-6 mt-4 text-center">
          <p className="text-gray-600 text-sm">
            {lang === 'ur' 
              ? 'Urban Move - آپ کی سواری، آپ کے ہاتھ میں'
              : 'Urban Move - Your ride, in your hands'
            }
          </p>
          <p className="text-gray-500 text-xs mt-2">
            {lang === 'ur' ? 'پاکستان کے لیے بنایا گیا' : 'Made for Pakistan'} 🇵🇰
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppInfoPage;

