import React, { useState, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { 
  ClientSideRowModelModule,
  CsvExportModule,
  ColumnAutoSizeModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule
} from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';
import { formatNumber, formatBalance } from '../../utils/formatters/index';

// Register AG Grid modules globally
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule,
  ColumnAutoSizeModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule
]);

// Helper for identifying numeric fields (same as in StandardList)
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
 * Unified list view component using AG Grid, following the spec exactly
 * @param {Object} props
 * @param {Array} props.data - Row data
 * @param {Array} props.columns - Column definitions (AG Grid columnDefs)
 * @param {string} props.title - Title for the list
 * @param {string} props.idField - Field to use as unique ID
 * @param {Function} props.onRefresh - Function to refresh data (returns Promise)
 * @param {Function} [props.onViewJson] - Optional JSON view handler
 * @param {Function} [props.onRowClick] - Optional row click handler
 * @param {boolean} [props.loading=false] - Loading state
 * @param {Object} [props.error=null] - Error object to display
 * @param {string} [props.emptyMessage='No items found'] - Message when no data
 * @param {boolean} [props.pagination=true] - Enable pagination
 * @param {number} [props.paginationPageSize=25] - Rows per page
 * @param {Array} [props.paginationPageSizeOptions=[10,25,50,100]] - Page size options
 * @param {boolean} [props.suppressPaginationPanel=false] - Hide pagination controls
 * @param {Object} [props.defaultColDef={sortable:true,filter:true,resizable:true}] - Default column properties
 * @param {boolean} [props.collapsible=false] - Enable collapse/expand
 * @param {boolean} [props.defaultCollapsed=false] - Initial collapsed state
 * @param {Function} [props.onCollapsedChange] - Callback on collapse change
 * @param {string} [props.collapseTitle='Toggle'] - Title for collapse button
 * @param {string} [props.gridHeight='auto'] - Grid height
 */
const UnifiedListView = ({
  data = [],
  columns = [],
  title = '',
  idField = '',
  onRefresh,
  onViewJson,
  onRowClick,
  loading = false,
  error = null,
  emptyMessage = 'No items found',
  pagination = true,
  paginationPageSize = 25,
  paginationPageSizeOptions = [10,25,50,100],
  suppressPaginationPanel = false,
  defaultColDef = { sortable: true, filter: true, resizable: true },
  collapsible = false,
  defaultCollapsed = false,
  onCollapsedChange,
  collapseTitle = 'Toggle',
  gridHeight = 'auto',
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const gridRef = useRef();

  // Toggle collapsed state
  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (onCollapsedChange) onCollapsedChange(next);
  };

  // Export to CSV using AG Grid's native exportDataAsCsv
  const handleExportCsv = () => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: `${title.replace(/\s+/g, '-').toLowerCase()}-export.csv`
      });
    }
  };

  // Process columns to add JSON view to first column if needed
  const processedColumns = useMemo(() => {
    // Create a clean copy without modifying the input columns
    const result = columns ? columns.map((col, index) => {
      // Start with a clean column definition
      const colDef = {
        field: col.field || col.key,
        headerName: col.headerName || col.header,
        filter: col.filter,
        sortable: true,
        resizable: true,
      };
      
      // Copy other non-sizing properties
      if (col.cellClass) colDef.cellClass = col.cellClass;
      if (col.cellClassName) colDef.cellClass = col.cellClassName;
      if (col.valueGetter) colDef.valueGetter = col.valueGetter;

      // Handle alignment property
      if (col.align) {
        if (col.align === 'right') {
          colDef.cellStyle = { textAlign: 'right' };
        } else if (col.align === 'center') {
          colDef.cellStyle = { textAlign: 'center' };
        }
      }

      // Check if this is a numeric field for formatting
      const isNumeric = isNumericField(col.field || col.key);
      
      // Set cell alignment and formatting for numeric fields
      if (isNumeric) {
        // Simple right alignment with standard AG Grid cellStyle
        colDef.cellStyle = { textAlign: 'right' };
        
        // Format numbers with comma separators
        colDef.valueFormatter = (params) => {
          if (params.value === null || params.value === undefined) return '';
          if (typeof params.value !== 'number') return params.value;
          
          const key = col.field || col.key;
          // Use appropriate formatter based on field type
          if (key === 'balance' || key.includes('balance')) {
            return formatBalance(params.value);
          } else {
            return formatNumber(params.value);
          }
        };
        
        // Better filter for numeric columns
        colDef.filter = 'agNumberColumnFilter';
      }

      // Handle JSON view button for first column
      if (index === 0 && onViewJson) {
        colDef.cellRenderer = (params) => {
          return (
            <div className="flex items-center">
              <button
                className="mr-1 p-1 text-gray-400 hover:text-gray-600"
                onClick={e => { e.stopPropagation(); onViewJson(params.data); }}
                title="View JSON"
              >
                <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </button>
              <span>
                {params.value}
              </span>
            </div>
          );
        };
      } else if (col.cellRenderer) {
        // Only add the cellRenderer if we're not on the first column with JSON button
        colDef.cellRenderer = col.cellRenderer;
      }
      
      return colDef;
    }) : [];

    return result;
  }, [columns, onViewJson]);

  // Calculate grid height based on data or fixed value
  const getGridHeight = () => {
    return gridHeight === 'auto' ? 'auto' : gridHeight;
  };

  // Render action buttons
  const renderActions = () => (
    <div className="flex items-center space-x-1">
      {onViewJson && (
        <button
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
          onClick={() => onViewJson(data)}
          title="View JSON"
        >
          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
      )}
      <button
        className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
        onClick={handleExportCsv}
        title="Export CSV"
      >
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </button>
      {onRefresh && (
        <button
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
          onClick={onRefresh}
          title="Refresh data"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin w-[18px] h-[18px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </button>
      )}
    </div>
  );

  return (
    <div className="unified-list-view">
      <div className="flex justify-between items-center mb-4 flex-nowrap">
        <div className="flex items-center">
          {collapsible && (
            <button 
              onClick={handleToggle} 
              className="mr-2 text-gray-700 hover:bg-gray-200 p-1 rounded"
            >
              {collapsed ? '▶' : '▼'} {collapseTitle}
            </button>
          )}
          <h3 className="text-lg font-medium text-gray-900 whitespace-nowrap">
            {title} <span className="text-sm text-gray-500">({data ? data.length : 0})</span>
          </h3>
        </div>
        {renderActions()}
      </div>

      {!collapsed && (
        <div className="ag-theme-alpine" style={{ width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            columnDefs={processedColumns}
            defaultColDef={{
              sortable: true,
              resizable: true,
              suppressMovable: false,
              filter: 'agSetColumnFilter',
              filterParams: { suppressMiniFilter: true },
              floatingFilter: false,
              enableRowGroup: true
            }}
            animateRows={true}
            onGridReady={(params) => {
              // Only auto-size columns to fit data
              if (params.columnApi?.autoSizeAllColumns) {
                params.columnApi.autoSizeAllColumns();
              }
              // Store reference to gridApi (like in StandardList)
              window.gridApi = params;
            }}
            onFirstDataRendered={(params) => {
              // Only auto-size columns to fit data
              if (params.columnApi?.autoSizeAllColumns) {
                params.columnApi.autoSizeAllColumns();
              }
            }}
            onRowClicked={(params) => {
              // Skip row click handling if clicking on JSON button
              const domEvent = params.event;
              if (domEvent?.target?.closest && domEvent.target.closest('button[title="View JSON"]')) {
                return;
              }
              
              // Otherwise handle row click
              if (onRowClick) {
                onRowClick(params.data);
              }
            }}
            pagination={pagination}
            paginationPageSize={paginationPageSize}
            paginationPageSizeOptions={paginationPageSizeOptions}
            suppressPaginationPanel={suppressPaginationPanel}
            suppressScrollOnNewData={false}
            domLayout="autoHeight"
          />
        </div>
      )}
      
      {!collapsed && error && (
        <div className="p-4 bg-red-100 text-red-600 rounded mt-2 flex justify-between items-center">
          <span>{typeof error === 'string' ? error : (error.message || 'An error occurred')}</span>
          {onRefresh && (
            <button onClick={onRefresh} className="text-red-600 hover:bg-red-200 px-2 py-1 rounded">
              Retry
            </button>
          )}
        </div>
      )}
      
      {!collapsed && !loading && data && data.length === 0 && !error && (
        <div className="p-4 text-gray-500 text-center">
          {emptyMessage}
        </div>
      )}
      
      {!collapsed && loading && (
        null
      )}
    </div>
  );
};

export default UnifiedListView;
