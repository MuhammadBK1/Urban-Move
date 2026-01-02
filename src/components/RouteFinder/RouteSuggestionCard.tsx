/**
 * =====================================================
 * ROUTE SUGGESTION CARD COMPONENT
 * =====================================================
 * 
 * Displays a single route suggestion with steps and details
 * =====================================================
 */

import React from 'react';
import { RouteSuggestion } from '../../services/routeFinderService';

// =====================================================
// PROPS
// =====================================================

interface RouteSuggestionCardProps {
  suggestion: RouteSuggestion;
  lang: 'en' | 'ur';
  onSelect?: (suggestion: RouteSuggestion) => void;
}

// =====================================================
// COMPONENT
// =====================================================

export const RouteSuggestionCard: React.FC<RouteSuggestionCardProps> = ({
  suggestion,
  lang,
  onSelect,
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'walk': return '🚶';
      case 'metro': return '🚇';
      case 'bus': return '🚌';
      case 'feeder': return '🛺';
      default: return '📍';
    }
  };


  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div
      className="card p-4 hover:shadow-md transition cursor-pointer"
      onClick={() => onSelect?.(suggestion)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-base">
            {lang === 'ur' ? suggestion.titleUrdu : suggestion.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            {lang === 'ur' ? suggestion.descriptionUrdu : suggestion.description}
          </p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(suggestion.confidence)}`}>
          {suggestion.confidence === 'high' 
            ? (lang === 'ur' ? 'اعلی' : 'High')
            : suggestion.confidence === 'medium'
            ? (lang === 'ur' ? 'متوسط' : 'Medium')
            : (lang === 'ur' ? 'کم' : 'Low')
          }
        </span>
      </div>

      {/* Steps */}
      <div className="space-y-2 mb-3">
        {suggestion.steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span className="text-lg">{getTypeIcon(step.type)}</span>
            <div className="flex-1">
              <span className="font-medium">
                {lang === 'ur' ? step.fromUrdu || step.from : step.from}
              </span>
              <span className="mx-2 text-gray-400">→</span>
              <span className="font-medium">
                {lang === 'ur' ? step.toUrdu || step.to : step.to}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {step.time} {lang === 'ur' ? 'منٹ' : 'min'}
            </span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-gray-500">{lang === 'ur' ? 'کل وقت' : 'Total Time'}: </span>
            <span className="font-semibold">{suggestion.estimatedTime} {lang === 'ur' ? 'منٹ' : 'min'}</span>
          </div>
          <div>
            <span className="text-gray-500">{lang === 'ur' ? 'کرایہ' : 'Fare'}: </span>
            <span className="font-semibold text-green-600">Rs. {suggestion.totalFare}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteSuggestionCard;

