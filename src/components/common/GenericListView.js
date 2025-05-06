import React, { useState, useEffect } from 'react';
import { SectionHeader, FilterBadge, ErrorAlert, LoadingSpinner } from './index';
import DetailModal from '../shared/DetailModal';
import { AgGridReact } from 'ag-grid-react';
import { handleExportCsv } from '../../utils/Exporters'

import { jsonCellRenderer } from './CellRenderers';

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
  if (!columns.some(col => col.field === 'json')) {
    columns.unshift({
      field: 'json',
      headerName: '',
      filter: false,
      suppressRowClickSelection: true,
      cellRenderer: jsonCellRenderer,
      cellStyle: { textAlign: 'center' },
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

  // Display error state
  if (error) {
    console.log('GenericListView props:', {
      data: data,
      columns: columns,
      title: title,
      dataLength: data?.length,
      firstRow: data?.[0]
    });

    console.log('First column definition:', columns[0]);

    return (
    <div className="w-full overflow-x-auto">
      <div className="mb-6">
        <ErrorAlert error={error} onRetry={onRefresh} />
      </div>
    </div>
    );
  }

  const triggerCsvExport = () => {
    handleExportCsv(title);
  }

    // Render action buttons for the section header
    const renderActions = () => (
      <div className="flex items-center gap-2">
        {loading && <LoadingSpinner size="sm" />}
        {data.length > 0 && (
          <button
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
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
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
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

  // Check if data is empty
  if (!data || data.length === 0) {
    return (
      <div className="w-full overflow-x-auto">
        <SectionHeader
          title={
            <>
              <span>{title}</span>
              <span className="ml-2 text-sm text-gray-500">(0)</span>
            </>
          }
          description=""
          actions={renderActions()}
        />

        {error && (
          <ErrorAlert 
            error={error} 
            onRetry={onRefresh} 
            className="mb-4"
          />
        )}

        {customHeader}

        <div className="ag-theme-alpine w-full h-auto">
          <div className="text-center py-4 text-gray-500">
            {emptyMessage || `No ${title.toLowerCase()} found`}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <SectionHeader
        title={
          <>
            <span>{title}</span>
            <span className="ml-2 text-sm text-gray-500">({data.length})</span>
          </>
        }
        description=""
        actions={renderActions()}
      />

      {error && (
        <ErrorAlert 
          error={error} 
          onRetry={onRefresh} 
          className="mb-4"
        />
      )}

      {customHeader}

      <div className="ag-theme-alpine w-full h-auto">
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
            if (params.data && 'balance' in params.data && params.data.balance < 0) {
              return 'negative-balance-row';
            }
            return '';
          }}
          onCellClicked={(event) => {
            // If the cell click is on a column that suppresses row click selection, do nothing
            if(event.colDef?.suppressRowClickSelection){
              return;
            }
            // Otherwise, call the onRowClick handler if it exists
            onRowClick && onRowClick(event.data);
          }}
        />
      </div>

      {/* JSON detail modal */}
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