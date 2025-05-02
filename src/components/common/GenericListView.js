import React, { useState, useEffect } from 'react';
import { SectionHeader, FilterBadge, ErrorAlert, LoadingSpinner } from './index';
import DetailModal from '../shared/DetailModal';
import { AgGridReact } from 'ag-grid-react';
import { handleExportCsv } from '../../utils/Exporters'

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
 * @param {string} props.idField - The field to use as the ID (e.g., "account_id")
 * @param {function} props.onItemClick - Handler for clicking an item
 * @param {function} props.onViewJson - Handler for viewing JSON data
 * @param {Object} props.filter - Active filter (e.g., { field: 'type', value: 'ASSET' })
 * @param {function} props.onClearFilter - Handler for clearing the active filter
 * @param {function} props.onSearch - Custom search handler
 * @param {string} props.searchPlaceholder - Placeholder for the search input
 * @param {string} props.emptyMessage - Message to display when no data is found
 * @param {React.ReactNode} props.customHeader - Custom header content
 * @param {React.ReactNode} props.customActions - Custom actions for the list
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
  idField,
  onItemClick,
  onViewJson,
  filter = null,
  onClearFilter,
  onSearch,
  searchPlaceholder,
  emptyMessage,
  customHeader,
  customActions,
  onRefresh,
  loading = false,
  error = null,
}) => {
  // JSON modal state
  const [jsonModalData, setJsonModalData] = useState(null);
  const handleInternalViewJson = (item) => setJsonModalData(item);
  const viewJsonHandler = onViewJson || handleInternalViewJson;

    // AG Grid settings
    const defaultColDef = {
      sortable: true,
      resizable: true,
      suppressMovable: false,
      filter: 'agSetColumnFilter',
      filterParams: { suppressMiniFilter: true },
      floatingFilter: false,  // Disable floating filter row; use filter icon in header
      enableRowGroup: true, // grouping UI requires ag-grid-enterprise
    };

  // Display error state
  if (error) {
    return (
      <div className="mb-6">
        <ErrorAlert error={error} onRetry={onRefresh} />
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



  // Generate a filter badge if a filter is active
  const filterBadge = filter ? (
    <div className="mb-4">
      <FilterBadge
        label={`${filter.label || filter.field}: ${filter.value}`}
        onClear={onClearFilter}
        count={data.length}
        entityName={title.toLowerCase()}
      />
    </div>
  ) : null;

  return (


<div>
      
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
      {customHeader || filterBadge}
      
      {/* Render standard list with JSON view support */}
      {/* <StandardList
        data={data}
        columns={columns}
        title={title}
        idField={idField}
        onItemClick={onItemClick}
        onViewJson={viewJsonHandler}
        onRefresh={onRefresh}
        onSearch={onSearch}
        searchPlaceholder={searchPlaceholder || `Search ${title.toLowerCase()}...`}
        emptyMessage={emptyMessage || `No ${title.toLowerCase()} found`}
        smallHeader={false}
        loading={loading}
      /> */}
        <AgGridReact
          domLayout="autoHeight"
          rowData={data}
          columnDefs={columns}
          defaultColDef={defaultColDef}
          context={context}
          idField={idField}
          animateRows={true}
          onItemClick={onItemClick}
          onRefresh={onRefresh}
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
          onRowClicked={(event) => {
            // Prevent drilling when clicking the JSON button
            const domEvent = event.event;
            if (domEvent?.target?.closest && domEvent.target.closest('button[title="View JSON"]')) {
              return;
            }
            // Skip row click handling if there's no handler
            if (!onItemClick) return;
            
            const firstColumn =columns[0];
            // Check if column exists before accessing properties
            if (event.column?.colId === firstColumn.key) {
                onItemClick(event.data);
            } else if (event.column?.colId === firstColumn.key && firstColumn.onClick) {
                firstColumn.onClick(event.data);
            } else if (firstColumn.onClick && event.data && event.data[firstColumn.key]) {
                firstColumn.onClick(event.data);
            } else {
                // Default case: Just handle the item click
                onItemClick(event.data);
            }
          }}
          >
        </AgGridReact>

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