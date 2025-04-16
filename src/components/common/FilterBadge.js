import React from 'react';

/**
 * Badge component for showing active filters with clear option
 * @param {Object} props - Component props
 * @param {string} props.label - Filter description (e.g. "Account Type: Liability")
 * @param {function} props.onClear - Function to clear the filter
 * @param {number} props.count - Number of items matching the filter
 * @param {string} props.entityName - Name of the entity being filtered (e.g. "account")
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered component
 */
const FilterBadge = ({ 
  label, 
  onClear, 
  count = 0, 
  entityName = 'item', 
  className = '' 
}) => {
  return (
    <div className={`bg-blue-50 p-4 rounded-lg flex justify-between items-center ${className}`}>
      <div>
        <p className="text-blue-700 font-medium">{label}</p>
        <p className="text-sm text-blue-600">
          Showing {count} {count === 1 ? entityName : `${entityName}s`}
        </p>
      </div>
      <button
        onClick={onClear}
        className="px-3 py-1 bg-white border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50 text-sm flex items-center"
      >
        <span className="mr-1">Clear Filter</span>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default FilterBadge;