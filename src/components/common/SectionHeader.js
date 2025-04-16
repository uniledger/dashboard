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
    <div className={`mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between ${className}`}>
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
        <div className="mt-3 flex sm:mt-0 sm:ml-4 space-x-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;