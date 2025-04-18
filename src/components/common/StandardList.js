import React, { useState, useCallback } from 'react';
import { 
  SectionHeader, 
  DataTable,
  DataTableSection,
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
  // Imports from AG Grid
  const { AgGridReact, AgGridColumn } = require('ag-grid-react');
  
  // Use internal state if external search query is not provided
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  
  // Determine whether to use external or internal search state
  const setSearchQuery = setExternalSearchQuery || setInternalSearchQuery;  
  
  // Don't do client-side filtering, just use the data as is
  const filteredData = data;
  
  // Make sure the first column is the ID column and has proper click behavior
  const processedColumns = columns.map((column, index) => {
    // Process cellClassName into cellStyle
    const cellStyle = {};
    if (column.cellClassName) {
      const classes = column.cellClassName.split(' ');
      classes.forEach(className => {
        switch(className) {
          case 'text-blue-600': cellStyle.color = '#2563eb'; break;
          case 'hover:underline': cellStyle.textDecoration = 'underline'; break;
          case 'cursor-pointer': cellStyle.cursor = 'pointer'; break;
          case 'font-medium': cellStyle.fontWeight = '500'; break;
        }
      });
    }
    
    if (index === 0 && column.key === idField) {
      return {
        ...column,
        cellStyle: cellStyle,
      };
    }
      return {
        ...column,
        cellStyle: cellStyle
      };
  });
  



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
  
  /**
   * Transform column definitions for AgGrid
   */
  const columnDefs = processedColumns.map(column => {
      let cellRenderer = undefined;

      // Handle custom render functions
      if (column.render) {
        cellRenderer = (params) => {
          return column.render(params.data);
        };
      }

      return {
        headerName: column.header,
        field: column.key,
        sortable: true,
        resizable: true,
        cellRenderer: cellRenderer,
        cellStyle: column.cellStyle,
        onCellClicked: column.onClick ? (params) => {
            column.onClick(params.data);
        } : undefined
      };
  });
  

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
  
  // AG Grid settings
  const defaultColDef = {
    sortable: true,
    resizable: true,
    suppressMovable: false
  };
  
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

      <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
        <AgGridReact
          rowData={filteredData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={() => {}}
          onRowClicked={(event) => {
            const firstColumn = processedColumns[0];
            if (event.column.colId === firstColumn.key) {
                handleItemClick(event.data);
            } else if(event.column.colId === firstColumn.key && firstColumn.onClick){
                firstColumn.onClick(event.data);
            } else if (firstColumn.onClick && event.data[firstColumn.key]){
                firstColumn.onClick(event.data);
            }
          }}
          domLayout='autoHeight'
        />
      />
    </div>
  );
};

export default StandardList;