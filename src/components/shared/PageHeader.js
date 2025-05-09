import React from 'react';

/**
 * Renders a reusable page header.
 *
 * Displays a title and optionally a back button, a refresh button, and custom child elements. Used to provide consistent page headers across the dashboard.
 *
 * @param {Object} props - Component props.
 * @param {string} props.title - The main title to display in the header.
 * @param {boolean} [props.backButton] - If true, a back button is displayed.
 * @param {boolean} [props.refreshButton] - If true, a refresh button is displayed.
 * @param {function} [props.onBack] - Callback function for the back button.
 * @param {function} [props.onRefresh] - Callback function for the refresh button.
 * @param {React.ReactNode} [props.children] - Additional elements to render in the header.
 * @returns {JSX.Element} The rendered PageHeader component.
 */
const PageHeader = ({ title, backButton, refreshButton, onBack, onRefresh, children }) => {
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
        {children}
      </div>
      {refreshButton && (
        <button
          onClick={onRefresh}
          className="px-3 py-1 rounded border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 flex items-center"
        >
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      )}
    </div>
  );
};

export default PageHeader;