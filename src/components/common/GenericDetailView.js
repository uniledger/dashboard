import React from 'react';
import { DetailCard, ErrorAlert, LoadingSpinner } from './index';

/**
 * Generic Detail View component for displaying any model type
 * This centralizes the pattern of showing detailed information about entities, accounts, ledgers, etc.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - The data object to display
 * @param {string} props.title - The title of the detail view (e.g., "Entity Detail")
 * @param {string} props.subtitle - The subtitle or name of the specific item
 * @param {Array} props.sections - Array of section objects to display in the detail card (basic info)
 * @param {Array} props.childrenSections - Optional array of child relationship sections with tables
 * @param {boolean} props.loading - Whether data is loading
 * @param {Object|string} props.error - Error state if present
 * @param {function} props.onBack - Handler for going back
 * @param {function} props.onRefresh - Handler for refreshing data
 * @param {function} props.onViewJson - Handler for viewing JSON data
 * @param {string} props.loadingMessage - Custom loading message
 * @param {React.ReactNode} props.customActions - Custom actions to display
 * @returns {JSX.Element}
 */
const GenericDetailView = ({
  data,
  title,
  subtitle,
  sections = [],
  childrenSections = [],
  loading = false,
  error = null,
  onBack,
  onRefresh,
  onViewJson,
  loadingMessage,
  customActions,
}) => {
  // Display error state
  if (error) {
    return (
      <div className="mb-6">
        <ErrorAlert error={error} onRetry={onRefresh} />
        <div className="mt-4">
          <button
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            onClick={onBack}
            title="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Handle missing data
  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No {title.toLowerCase()} selected.</p>
        <div className="mt-4">
          <button
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            onClick={onBack}
            title="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Standard actions for the detail card
  const defaultActions = (
    <div className="flex items-center gap-2">
      {/* Loading indicator */}
      {loading && (
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100" title="Loading...">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </button>
      )}
      {onViewJson && (
        <button
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
          onClick={() => onViewJson && onViewJson(data, `${title}: ${subtitle || ''}`)}
          title="View JSON"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M8 16h8" />
            <path d="M8 12h8" />
          </svg>
        </button>
      )}
      {onRefresh && (
        <button
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
          onClick={onRefresh}
          title="Refresh data"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      )}
      {onBack && (
        <button
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
          onClick={onBack}
          title="Back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
      )}
    </div>
  );

  // Filter out sections that should be skipped
  const filteredSections = sections.filter(section => !section.skipSection);
  
  // Automatically inject JSON view and fetchData handlers into child tables
  const injectedChildren = childrenSections.map(section => {
    if (!React.isValidElement(section.content)) {
      return section;
    }
    
    // Clone the element with the correct props
    return {
      ...section,
      content: React.cloneElement(section.content, { 
        onViewJson, 
        fetchData: onRefresh, // Use onRefresh as fetchData
        loading 
      })
    };
  });

  return (
    <div>
      <DetailCard
        title={title}
        subtitle={subtitle}
        sections={filteredSections}
        childrenSections={injectedChildren}
        actions={customActions || defaultActions}
      />
    </div>
  );
};

export default GenericDetailView;