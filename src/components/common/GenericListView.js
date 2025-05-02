import React, { useState, useEffect } from 'react';
import { StandardList, FilterBadge, ErrorAlert, LoadingSpinner } from './index';
import DetailModal from '../shared/DetailModal';
import { AgGridReact } from 'ag-grid-react';

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

  // Display error state
  if (error) {
    return (
      <div className="mb-6">
        <ErrorAlert error={error} onRetry={onRefresh} />
      </div>
    );
  }

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