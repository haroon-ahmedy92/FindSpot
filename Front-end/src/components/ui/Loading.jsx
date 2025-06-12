import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Loading = ({ size = 'md', color, className = '' }) => {
  const { isDarkMode } = useTheme();
  
  // Default color based on theme if not provided
  const defaultColor = color || (isDarkMode ? '#00AFB9' : '#3D348B');
  
  // Size variants
  const sizeClasses = {
    'xs': 'w-4 h-4 border-2',
    'sm': 'w-6 h-6 border-2',
    'md': 'w-8 h-8 border-2',
    'lg': 'w-12 h-12 border-3', 
    'xl': 'w-16 h-16 border-4'
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  return (
    <div className={`${className} flex items-center justify-center`}>
      <div
        className={`${sizeClass} rounded-full border-t-transparent animate-spin`}
        style={{ borderColor: `${defaultColor}33`, borderTopColor: defaultColor }}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;