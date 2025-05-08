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
 * Generic List View component for displaying any model type in a list
 * This centralizes the pattern of showing lists of entities, accounts, ledgers, etc.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - The data array to display
 * @param {Array} props.columns - Column definitions for the list
 * @param {Object} context - Component context
 * @param {string} props.title - Title for the list (e.g., "Accounts")
 * @param {string} props.emptyMessage - Message to display when the list is empty
 * @param {string} props.idField - The field to use as the ID (e.g., "account_id")
 * @param {function} props.onRowClick - Handler for clicking a row
 * @param {function} props.onViewJson - Handler for viewing JSON data
 * @param {function} props.onSearch - Custom search handler
 * @param {React.ReactNode} props.customHeader - Custom header content
 * @param {function} props.onRefresh - Handler for refreshing the list
 * @param {boolean} props.loading - Whether data is loading (external)
 * @param {Object|string} props.error - Error state if present
 * @returns {JSX.Element}
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

  const renderSectionHeader = () => {
    return (
      <SectionHeader
        title={
          <>
            <span>{title}</span>
            <span className="text-gray-500">  ({data.length})</span>
          </>
        }
        description=""
        actions={renderActions()}
      />
    );
  }

  // Render action buttons for the section header
  const renderActions = () => (
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

  const renderGridContent = () => {
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
      {renderSectionHeader()}

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

      {/* Render the main grid content */}
      {!loading && renderGridContent()}

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