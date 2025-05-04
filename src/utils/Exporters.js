  
  import { formatBalance } from "./formatters";
  

  // Handle CSV export - requires CsvExportModule
  export const handleExportCsv = (title) => {
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