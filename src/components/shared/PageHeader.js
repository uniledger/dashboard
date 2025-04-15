import React from 'react';

/**
 * Reusable PageHeader component that optionally includes back and refresh buttons
 */
const PageHeader = ({ title, backButton, refreshButton, onBack, onRefresh }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        {backButton && (
          <button
            onClick={onBack}
            className="mr-4 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
          >
            <span className="text-blue-600">← Back</span>
          </button>
        )}
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      {refreshButton && (
        <button
          onClick={onRefresh}
          className="px-3 py-1 rounded border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
        >
          Refresh
        </button>
      )}
    </div>
  );
};

export default PageHeader;