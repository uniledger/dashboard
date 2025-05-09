import React, { useState } from 'react';
import { SectionHeader, ErrorAlert, LoadingSpinner } from './index';
import DetailModal from '../shared/DetailModal';
import { AgGridReact } from 'ag-grid-react';
import { handleExportCsv } from '../../utils/Exporters'

import { jsonCellRenderer } from './jsonUtils';

import { ModuleRegistry } from 'ag-grid-community';
import {
  ClientSideRowModelModule,
  ColumnApiModule,
  CsvExportModule,
  ColumnAutoSizeModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  CellStyleModule,
  RowStyleModule,
  ValidationModule,
} from 'ag-grid-community';


// Register AG Grid modules globally
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnApiModule,
  CsvExportModule,
  ColumnAutoSizeModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  CellStyleModule,
  RowStyleModule,
  ValidationModule,
]);

/**
 * A reusable and configurable component for displaying data in a filterable, sortable, and exportable grid (AG Grid).
 * It handles common list view features such as row click navigation, JSON data viewing, refresh actions, search (if `onSearch` provided),
 * loading states, and error display. It automatically adds a column for viewing row data as JSON.
 *
 * @param {Object} props - Component props.
 * @param {Array<Object>} [props.data=[]] - The array of data objects to display in the grid.
 * @param {Array<import('ag-grid-community').ColDef>} props.columns - AG Grid column definitions.
 * @param {Object} [props.context] - AG Grid context object, passed to cell renderers. `jsonRowHandler` is automatically added.
 * @param {string} props.title - The title to display in the section header for the list.
 * @param {string} [props.emptyMessage="No items found"] - Message to display when the data array is empty.
 * @param {string} props.idField - The name of the field in the data objects that serves as a unique identifier (e.g., 'id', 'account_id').
 * @param {function} [props.onRowClick] - Callback function when a row is clicked. Receives the row data object.
 * @param {function} [props.onViewJson] - Optional custom callback to view JSON for a row. Receives row data. If not provided, a default modal is used.
 * @param {function} [props.onSearch] - Callback function for handling search. (Note: Search input UI not part of this component, expected to be external).
 * @param {React.ReactNode} [props.customHeader] - Optional custom elements to render below the main section header.
 * @param {function} [props.onRefresh] - Callback function to refresh the data.
 * @param {boolean} [props.loading=false] - Indicates if data is currently being loaded.
 * @param {Object|string} [props.error=null] - Error object or message to display if data fetching failed.
 * @returns {JSX.Element} The rendered GenericListView component.
 */
const GenericListView = ({
  data = [],
  columns,
  context,
  title,
  emptyMessage,
  idField,
  onRowClick,
  onViewJson,
  onSearch,
  customHeader,
  onRefresh,
  loading = false,
  error = null,
}) => {
  // JSON modal state
  const [jsonModalData, setJsonModalData] = useState(null);
  const handleInternalViewJson = (item) => setJsonModalData(item);
  const viewJsonHandler = onViewJson || handleInternalViewJson;

  // Ensure we have a context object with jsonRowHandler
  const contextWithHandler = context || {};
  contextWithHandler.jsonRowHandler = viewJsonHandler;
  context = contextWithHandler;

  // Only add JSON column if it doesn't already exist
  if (columns &&!columns.some(col => col.field === 'json')) {
    columns.unshift({
      field: 'json',
      headerName: '',
      filter: false,
      context: {
        suppressRowClickSelection: true
      },
      cellRenderer: jsonCellRenderer,
      cellStyle: { textAlign: 'center' },
      resizable: false,
      sortable: false,
      width: 40,
    });
  }

  // Default column definition
  const defaultColDef = {
    sortable: true,
    resizable: true,
    suppressMovable: false,
    filter: 'agTextColumnFilter',
    filterParams: { suppressMiniFilter: false },
    floatingFilter: false,  // Disable floating filter row; use filter icon in header
    enableRowGroup: false, // grouping UI requires ag-grid-enterprise
  };

  const triggerCsvExport = () => {
    handleExportCsv(title);
  }

  const render_section_header = () => {
    return (
      <SectionHeader
        title={
          <>
            <span>{title}</span>
            <span className="text-gray-500">  ({data.length})</span>
          </>
        }
        description=""
        actions={render_actions()}
      />
    );
  }

  // Render action buttons for the section header
  const render_actions = () => (
    <div className="flex items-center gap-2">
      {data.length > 0 && (
        <button
          className="p-2 rounded-full text-gray-500 bg-gray-50 hover:bg-gray-100"
          onClick={triggerCsvExport}
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
        className="p-2 rounded-full text-gray-500 bg-gray-50 hover:bg-gray-100"
        onClick={onRefresh}
        title="Refresh data"
      >
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );

  const render_grid_content = () => {
    return (
      <div className="ag-theme-alpine w-full h-auto border-b border-x border-gray-300 rounded-b-lg">
        <AgGridReact
          domLayout="autoHeight"
          rowData={data}
          columnDefs={columns}
          defaultColDef={defaultColDef}
          context={context}
          animateRows={true}
          onSearch={onSearch}
          onFirstDataRendered={(params) => {
            params.api.autoSizeAllColumns();
          }}
          onGridReady={(params) => {
            // Store gridApi 
            window.gridApi = params;
          }}
          getRowClass={(params) => {
            let classes = [];
            
            // Add negative balance class if applicable
            if (params.data && 'balance' in params.data && params.data.balance < 0) {
              classes.push('negative-balance-row');
            }
            
            // Add cursor pointer class if row click handler exists
            if (onRowClick) {
              classes.push('cursor-pointer');
            }
            
            return classes.join(' ');
          }}
          onCellClicked={(event) => {
            // If the cell click is on a column that suppresses row click selection, do nothing
            if (event.colDef?.context?.suppressRowClickSelection) {
              return;
            }
            // Otherwise, call the onRowClick handler if it exists
            onRowClick && onRowClick(event.data);
          }}
        />
      </div>
    );
  }

  return (
    <div className="ag-theme-alpine">
      {/* Render section header */}
      {render_section_header()}

      {/* Render error alert */}
      {error && (
        <ErrorAlert
          error={error}
          onRetry={onRefresh}
        />
      )}

      {/* Render custom header */}
      {customHeader}

      {/* Render the loading spinner */}
      {loading && (
        <div className="ag-theme-alpine w-full h-96 flex items-center justify-center border-b border-x border-gray-300 rounded-b-lg">
          <LoadingSpinner size="lg" message="Loading data..." />
        </div>
      )}

      {/* Render the empty message if there is no data and not loading */}
      {!loading && data.length === 0 && (
        <div className="py-12 text-center text-gray-500" data-testid="empty-message">
          {emptyMessage || "No items found"}
        </div>
      )}

      {/* Render the main grid content */}
      {!loading && data.length > 0 && render_grid_content()}

      {/* render JSON detail modal */}
      <DetailModal
        isOpen={!!jsonModalData}
        data={jsonModalData}
        title={`${title} Record`}
        onClose={() => setJsonModalData(null)}
      />
    </div>
  );
};

export default GenericListView;