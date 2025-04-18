import React, { useState } from 'react';
import { 
  DataTable, 
  SectionHeader, 
  ActionButton,
  ErrorAlert,
  LoadingSpinner
} from './index';

/**
 * Standard List component that can be used for any type of data
 * Provides consistent behavior for ID column clicking and other common list features
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Data items to display
 * @param {Array} props.columns - Column definitions
 * @param {string} props.title - List title
 * @param {string} props.idField - Field name of the ID column
 * @param {boolean} props.loading - Loading state
 * @param {Object} props.error - Error state
 * @param {function} props.onItemClick - Function to call when an item is clicked
 * @param {function} props.onViewJson - Function to call to view item JSON
 * @param {function} props.onRefresh - Function to call to refresh the data
 * @param {function} props.onSearch - Function to call when search changes (optional)
 * @param {string} props.searchPlaceholder - Placeholder for search box
 * @param {string} props.emptyMessage - Message to display when no data is found
 * @param {string} props.searchQuery - External search query (optional)
 * @param {function} props.setSearchQuery - Function to update external search query (optional)
 * @returns {JSX.Element} - Rendered component
 */
const StandardList = ({ 
  data = [],
  columns,
  title,
  idField,
  loading = false,
  error = null,
  onItemClick,
  onViewJson,
  onRefresh,
  onSearch,
  searchPlaceholder = "Search...",
  emptyMessage = "No items found",
  searchQuery: externalSearchQuery,
  setSearchQuery: setExternalSearchQuery
}) => {
  // Use internal state if external search query is not provided
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  
  // Determine whether to use external or internal search state
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = setExternalSearchQuery || setInternalSearchQuery;
  
  // Don't do client-side filtering, just use the data as is
  const filteredData = data;
  
  // Make sure the first column is the ID column and has proper click behavior
  const processedColumns = columns.map((column, index) => {
    if (index === 0 && column.key === idField) {
      return {
        ...column,
        cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
      };
    }
    return column;
  });
  
  /**
   * Handle search input change
   * @param {Event} e - Input change event
   */
  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    
    if (onSearch) {
      onSearch(newValue);
    }
  };
  
  /**
   * Handle refreshing data
   */
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };
  
  /**
   * Handle clicking on an item
   * @param {Object} item - Item that was clicked
   */
  const handleItemClick = (item) => {
    if (onItemClick) {
      // Use the ID field to determine which ID to pass
      const itemId = item[idField];
      onItemClick(item, itemId);
    }
  };
  
  // Render action buttons for the section header
  const renderActions = () => (
    <>
      <ActionButton
        variant="outline"
        onClick={handleRefresh}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        }
      >
        Refresh Data
      </ActionButton>
    </>
  );
  
  // Show loading spinner if data is loading and there's no data
  if (loading && data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner size="lg" message={`Loading ${title.toLowerCase()}...`} />
      </div>
    );
  }
  
  return (
    <div>
      <SectionHeader
        title={title}
        description={`${filteredData.length} ${title.toLowerCase()} found`}
        actions={renderActions()}
      />
      
      {error && (
        <ErrorAlert 
          error={error} 
          onRetry={handleRefresh} 
          className="mb-4"
        />
      )}
      
      <DataTable
        columns={processedColumns}
        data={filteredData}
        loading={loading}
        onRowClick={handleItemClick}
        emptyMessage={emptyMessage}
        colSpan={columns.length}
        idField={idField}
      />
    </div>
  );
};

export default StandardList;