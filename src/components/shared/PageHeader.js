import React from 'react';

/**
 * Reusable page header component with action button
 */
const PageHeader = ({ title, buttonText, onButtonClick }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      {buttonText && (
        <button 
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default PageHeader;