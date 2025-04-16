import React from 'react';

/**
 * Reusable loading spinner component with size variants
 * @param {Object} props - Component props
 * @param {string} props.size - Size variant (sm, md, lg)
 * @param {string} props.message - Optional loading message
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered component
 */
const LoadingSpinner = ({ size = 'md', message, className = '' }) => {
  // Define size classes
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4'
  };
  
  // Define text size classes
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-blue-500`}></div>
      {message && (
        <p className={`mt-2 text-gray-600 ${textSizeClasses[size]}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;