import React from 'react';

/**
 * Badge component for showing active filters with clear option
 * @param {Object} props - Component props
 * @param {string} props.label - Filter label
 * @param {string} props.value - Filter value
 * @param {function} props.onClear - Function to clear the filter
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered component
 */
const FilterBadge = ({ label, value, onClear, className = '' }) => {
  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 ${className}`}>
      <span>{label}: <strong>{value}</strong></span>
      <button
        type="button"
        className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-200 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
        onClick={onClear}
      >
        <span className="sr-only">Remove filter</span>
        <svg className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default FilterBadge;