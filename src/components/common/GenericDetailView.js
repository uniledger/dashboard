import React from 'react';
import { DetailCard, ActionButton, ErrorAlert, LoadingSpinner } from './index';

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
  // Display loading state
  if (loading && !data) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner size="lg" message={loadingMessage || `Loading ${title.toLowerCase()}...`} />
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="mb-6">
        <ErrorAlert error={error} onRetry={onRefresh} />
        <div className="mt-4">
          <ActionButton variant="primary" onClick={onBack}>
            Back
          </ActionButton>
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
          <ActionButton variant="primary" onClick={onBack}>
            Back
          </ActionButton>
        </div>
      </div>
    );
  }

  // Standard actions for the detail card
  const defaultActions = (
    <>
      <ActionButton
        variant="outline"
        onClick={() => onViewJson && onViewJson(data, `${title}: ${subtitle || ''}`)}
      >
        View JSON
      </ActionButton>
      <ActionButton
        variant="outline"
        onClick={onRefresh}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        }
      >
        Refresh
      </ActionButton>
      <ActionButton variant="secondary" onClick={onBack}>
        Back
      </ActionButton>
    </>
  );

  return (
    <div>
      <DetailCard
        title={title}
        subtitle={subtitle}
        sections={sections}
        childrenSections={childrenSections}
        actions={customActions || defaultActions}
      />
    </div>
  );
};

export default GenericDetailView;