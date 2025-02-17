/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value, text, size = "default" }) => {
  // Calculate stars
  const fullStars = Math.floor(value);
  const hasHalfStar = value - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Size classes
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-5 h-5",
    large: "w-6 h-6"
  };

  // Render stars
  const renderStar = (type, index) => {
    const commonClasses = `${sizeClasses[size]} transition-colors duration-200`;
    
    switch (type) {
      case 'full':
        return (
          <Star
            key={`full-${index}`}
            className={`${commonClasses} text-yellow-400 fill-yellow-400`}
          />
        );
      case 'half':
        return (
          <div key="half" className="relative">
            <Star className={`${commonClasses} text-gray-300 fill-gray-300`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`${commonClasses} text-yellow-400 fill-yellow-400`} />
            </div>
          </div>
        );
      case 'empty':
        return (
          <Star
            key={`empty-${index}`}
            className={`${commonClasses} text-gray-300 fill-gray-300`}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[...Array(fullStars)].map((_, index) => renderStar('full', index))}
        {hasHalfStar && renderStar('half')}
        {[...Array(emptyStars)].map((_, index) => renderStar('empty', index))}
      </div>
      
      {text && (
        <span className="ml-2 text-sm text-gray-600">
          {text}
        </span>
      )}
    </div>
  );
};

Rating.defaultProps = {
  size: "default"
};

export default Rating;