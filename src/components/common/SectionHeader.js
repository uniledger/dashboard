import React from 'react';

/**
 * Reusable section header component with title, description, and action buttons
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {string} props.description - Optional section description
 * @param {React.ReactNode} props.actions - Optional action buttons
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered component
 */
const SectionHeader = ({ title, description, actions, className = '' }) => {
  return (
    <div className={`bg-white px-6 py-4 border-t border-x border-gray-300 rounded-t-lg flex justify-between items-center ${className}`}>
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex space-x-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;