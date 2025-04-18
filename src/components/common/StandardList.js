import React, { useState } from 'react';
import { 
  SectionHeader, 
  ActionButton,
  ErrorAlert,
  LoadingSpinner
} from './index';
import { AgGridReact } from 'ag-grid-react';
import { 
  ClientSideRowModelModule,
  CsvExportModule,
  GridApi
} from 'ag-grid-community';
import { formatBalance, getCurrencyInfo } from '../../utils/formatters/index';
// Define locally to avoid circular dependency
const isNumericField = (fieldName) => {
  if (!fieldName) return false;
  
  const lowerName = fieldName.toLowerCase();
  
  return (
    lowerName === 'balance' ||
    lowerName === 'amount' ||
    lowerName === 'value' ||
    lowerName.includes('total') ||
    lowerName.includes('price') ||
    lowerName.includes('cost') ||
    lowerName.includes('fee') ||
    lowerName.includes('quantity') ||
    lowerName.includes('ratio')
  );
};

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
 * @param {number} props.gridHeight - Custom height for the AG Grid container (default: 500px)
 * @param {boolean} props.smallHeader - Use smaller header styling for embedded tables
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
  setSearchQuery: setExternalSearchQuery,
  gridHeight = 500,
  smallHeader = false
}) => {  
  // Use internal state if external search query is not provided
  const [, setInternalSearchQuery] = useState('');
  
  // Determine which function to use for search query updates
  const setSearchQuery = setExternalSearchQuery || setInternalSearchQuery;
  
  // Don't do client-side filtering, just use the data as is
  const filteredData = data;
  
  // Make sure the first column is the ID column and has proper click behavior
  const processedColumns = columns.map((column, index) => {
    // Process cellClassName into cellStyle
    const cellStyle = {};
    
    // Handle string-based cellClassName
    if (column.cellClassName && typeof column.cellClassName === 'string') {
      const classes = column.cellClassName.split(' ');
      classes.forEach(className => {
        switch(className) {
          case 'text-blue-600': cellStyle.color = '#2563eb'; break;
          case 'hover:underline': cellStyle.textDecoration = 'underline'; break;          
          case 'cursor-pointer': cellStyle.cursor = 'pointer'; break;
          case 'font-medium': cellStyle.fontWeight = '500'; break;
          case 'text-right': cellStyle.textAlign = 'right'; break;
          case 'text-center': cellStyle.textAlign = 'center'; break;
          case 'text-left': cellStyle.textAlign = 'left'; break;
          default: break;
        }
      });
    }
    
    // Support for function-based cellClassName (for DataTableSection compatibility)
    if (column.cellClassNameFn && typeof column.cellClassNameFn === 'function') {
      // We'll handle this in cellStyle function for AG Grid
      column.cellStyleFunction = column.cellClassNameFn;
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

      // Simplify numeric column detection to use the isNumericField function
      const isNumericColumn = isNumericField(column.key) && 
        // Exclude ID fields specifically
        !column.key.toLowerCase().includes('id') &&
        !column.key.toLowerCase().includes('code');

      const colDef = {
        headerName: column.header,
        field: column.key,
        sortable: true,
        resizable: true,
        cellRenderer: cellRenderer,
        onCellClicked: column.onClick ? (params) => {
            column.onClick(params.data);
        } : undefined
      };
      
      // Special handling for balance column
      if (column.key === 'balance') {
        colDef.type = 'numericColumn';
        colDef.cellStyle = function() {
          return { 'text-align': 'right' };
        };
        colDef.headerClass = 'balance-header right-align-header';
      }
      
      // Note: Balance column cellStyle is already set above
      
      // Handle dynamic styles from cellStyleFunction
      if (column.cellStyleFunction) {
        const originalCellStyle = colDef.cellStyle || {};
        
        colDef.cellStyle = (params) => {
          // Get the class names from the function
          const classNames = column.cellStyleFunction(params.data);
          if (!classNames) {
            // Always maintain numeric column alignment
            if (isNumericColumn || column.key === 'balance' || column.key === 'amount') {
              return { ...originalCellStyle, textAlign: 'right' };
            }
            return originalCellStyle;
          }
          
          // Convert class names to style object
          const dynamicStyle = {};
          const classes = classNames.split(' ');
          classes.forEach(className => {
            switch(className) {
              case 'text-blue-600': dynamicStyle.color = '#2563eb'; break;
              case 'hover:underline': dynamicStyle.textDecoration = 'underline'; break;          
              case 'cursor-pointer': dynamicStyle.cursor = 'pointer'; break;
              case 'font-medium': dynamicStyle.fontWeight = '500'; break;
              case 'text-right': dynamicStyle.textAlign = 'right'; break;
              case 'text-center': dynamicStyle.textAlign = 'center'; break;
              case 'text-left': dynamicStyle.textAlign = 'left'; break;
              case 'text-red-600': dynamicStyle.color = '#dc2626'; break;
              case 'text-green-600': dynamicStyle.color = '#059669'; break;
              default: break;
            }
          });
          
          // For numeric columns, always maintain right alignment
          if (isNumericColumn || column.key === 'balance' || column.key === 'amount') {
            return { 
              ...originalCellStyle,
              ...dynamicStyle,
              textAlign: 'right'
            };
          }
          
          // For other columns, merge styles normally
          return { ...originalCellStyle, ...dynamicStyle };
        };
      }
      
      return colDef;
  });
  

  // Handle CSV export - requires CsvExportModule
  const handleExportCsv = () => {
    if (window.gridApi && window.gridApi.api) {
      window.gridApi.api.exportDataAsCsv({
        fileName: `${title.toLowerCase().replace(/\s+/g, '-')}-export-${new Date().toISOString().slice(0, 10)}.csv`,
        processCellCallback: (params) => {
          try {
            // Get access to the full row data for context
            const rowData = params.node.data;
            
            // Handle null/undefined values
            if (params.value === null || params.value === undefined) {
              // Special handling for known column types that might need alternative values
              if (params.column.colId === 'account_id' && rowData) {
                // Try alternative ID fields
                return rowData.account_id || rowData.account_extra_id || '';
              }
              
              if (params.column.colId === 'currency' && rowData) {
                // Try to get currency from different possible locations
                if (rowData.r_currency && rowData.r_currency.currency_code) {
                  return rowData.r_currency.currency_code;
                } else if (rowData.currency_code) {
                  return rowData.currency_code;
                } else if (rowData.enriched_ledger && rowData.enriched_ledger.r_currency) {
                  return rowData.enriched_ledger.r_currency.currency_code;
                }
                return '';
              }
              
              return '';
            }
            
            // Special handling for known column types
            if (params.column.colId === 'balance' && typeof params.value === 'number') {
              return formatBalance(params.value, null, true, '');
            }
            
            // Handle specific columns directly
            if (params.column.colId === 'account_id') {
              return rowData.account_id || rowData.account_extra_id || params.value || '';
            }
            
            if (params.column.colId === 'currency') {
              // For currency column
              if (typeof params.value === 'string') {
                return params.value;
              } else if (rowData.currency_code) {
                return rowData.currency_code;
              } else if (rowData.r_currency && rowData.r_currency.currency_code) {
                return rowData.r_currency.currency_code;
              } else if (rowData.enriched_ledger && rowData.enriched_ledger.r_currency) {
                return rowData.enriched_ledger.r_currency.currency_code;
              }
              return '';
            }
            
            // Handle objects safely
            if (typeof params.value === 'object') {
              // Special case for account_code
              if (params.column.colId === 'account_code') {
                if (params.value && params.value.code) {
                  return params.value.code;
                } else if (params.value && params.value.type) {
                  return params.value.type;
                } else {
                  return '';
                }
              }
              
              // For entity/ledger columns
              if (params.column.colId === 'entity' || params.column.colId === 'ledger') {
                if (params.value && params.value.name) {
                  return params.value.name;
                }
              }
              
              // Avoid [object Object] in the export
              return '';
            }
            
            // For all other values, use them as is
            return params.value;
          } catch (error) {
            console.error('Error in CSV export:', error);
            return '';
          }
        }
      });
    }
  };

  // Render action buttons for the section header
  const renderActions = () => (
    <div className="flex items-center gap-2">
      {data.length > 0 && (
        <button
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
          onClick={handleExportCsv}
          title="Export to CSV"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      )}
      <button
        className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
        onClick={handleRefresh}
        title="Refresh data"
      >
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
  
  // AG Grid settings
  const defaultColDef = {
    sortable: true,
    resizable: true,
    suppressMovable: false,
    autoSize: false,
    filter: true,
    flex: 1
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
      {!smallHeader ? (
        <SectionHeader
          title={title}
          description={""}
          actions={renderActions()}
        />
      ) : (
        <div className="flex justify-between items-center mb-4">
          <div className="flex-grow">
            <h3 className="text-lg font-medium text-gray-900">{title || ''}</h3>
          </div>
          <div className="flex items-center gap-2">
            {data.length > 0 && (
              <button 
                onClick={handleExportCsv}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                title="Export to CSV"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            )}
            {onRefresh && (
              <button 
                onClick={handleRefresh}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                title="Refresh data"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <ErrorAlert 
          error={error} 
          onRetry={handleRefresh} 
          className="mb-4"
        />
      )}

      {/* Quick Filter */}
      {data.length > 5 && (
        <div className="mb-4">
          <input 
            type="text"
            placeholder="Filter table data..."
            className="w-full md:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => {
              if (window.gridApi) {
                if ('setQuickFilter' in window.gridApi) {
                  window.gridApi.setQuickFilter(e.target.value);
                } else if ('api' in window.gridApi && 'setQuickFilter' in window.gridApi.api) {
                  window.gridApi.api.setQuickFilter(e.target.value);
                } else {
                  console.warn('Quick filter not available');
                }
              }
            }}
          />
        </div>
      )}
      
      <div className="ag-theme-alpine" style={{ height: `${gridHeight}px`, width: '100%' }}>
        <AgGridReact
          rowData={filteredData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          modules={[ClientSideRowModelModule, CsvExportModule]}
          onGridReady={(params) => {
            // Store gridApi in window for easy access
            window.gridApi = params;
            
            // Automatically resize columns to fit content
            if (params.api && typeof params.api.sizeColumnsToFit === 'function') {
              // Initial sizing
              params.api.sizeColumnsToFit();
              
              // Also auto-size each column for content
              if (params.columnApi && typeof params.columnApi.autoSizeAllColumns === 'function') {
                params.columnApi.autoSizeAllColumns();
              } else if (params.api.autoSizeAllColumns) {
                params.api.autoSizeAllColumns();
              }
              
              // Add window resize handler for responsive sizing
              window.addEventListener('resize', () => {
                setTimeout(() => {
                  if (params.api && !params.api.isDestroyed()) {
                    params.api.sizeColumnsToFit();
                  }
                }, 100);
              });
            }
          }}
          getRowClass={(params) => {
            if (params.data && 'balance' in params.data && params.data.balance < 0) {
              return 'negative-balance-row';
            }
            return '';
          }}
          onRowClicked={(event) => {
            // Skip row click handling if there's no handler
            if (!onItemClick) return;
            
            const firstColumn = processedColumns[0];
            // Check if column exists before accessing properties
            if (event.column && event.column.colId && event.column.colId === firstColumn.key) {
                handleItemClick(event.data);
            } else if (event.column && event.column.colId && event.column.colId === firstColumn.key && firstColumn.onClick) {
                firstColumn.onClick(event.data);
            } else if (firstColumn.onClick && event.data && event.data[firstColumn.key]) {
                firstColumn.onClick(event.data);
            } else {
                // Default case: Just handle the item click
                handleItemClick(event.data);
            }
          }}
          domLayout='autoHeight'>
        </AgGridReact>
      </div>
    </div>
  );
};

export default StandardList;