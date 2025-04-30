import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import UnifiedListView from './UnifiedListView';
import { AccountConfig } from './config/modelConfig';
import useAccounts from '../../hooks/useAccounts';
import { useDashboard } from '../../context/DashboardContext';

/**
 * Test page for UnifiedListView component using account data
 */
const TestAccountUnifiedList = () => {
  const navigate = useNavigate();
  const { handleViewJson } = useDashboard();
  const { 
    accounts, 
    loading, 
    error, 
    fetchAccounts, 
    refreshAccountBalances  // Get the dedicated refresh function
  } = useAccounts();
  
  // Verify refresh is actually working
  const handleRefresh = useCallback(() => {
    console.log('Refreshing accounts data...');
    return refreshAccountBalances(); // Use the dedicated refresh function
  }, [refreshAccountBalances]);

  // Fetch accounts on mount
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Map our modelConfig columns to AG Grid columnDefs format
  const columnDefs = AccountConfig.listColumns.map(col => {
    const def = {
      field: col.key,
      headerName: col.header,
      cellClass: col.cellClassName,
      sortable: true,
      filter: true,
      resizable: true,
    };
    
    // Add special handling for right-aligned balance column
    if (col.align === 'right') {
      def.cellStyle = { textAlign: 'right' };
    }

    if (col.render) {
      // AG Grid requires cell data for proper sorting, so we need to handle this carefully
      if (col.key === 'type' || col.key === 'account_type') {
        // For type columns, provide a value getter to extract the type value
        def.valueGetter = params => {
          return params.data.type || params.data.account_type || 
                 params.data.account_code?.type || '';
        };
        
        // Use AG Grid's built-in set filter with predefined values
        def.filter = 'agSetColumnFilter';
        
        // Use the original renderer function
        def.cellRenderer = params => col.render(params.data);
      } else if (col.key === 'account_code') {
        // For account code column which often has complex rendering
        def.valueGetter = params => {
          return params.data.account_code?.account_code || 
                 params.data.account_code || '';
        };
        
        // Use text filter for account codes
        def.filter = 'agTextColumnFilter';
        
        // Use the original renderer function
        def.cellRenderer = params => col.render(params.data);
      } else {
        // Standard cell renderer for other columns
        def.cellRenderer = params => col.render(params.data);
      }
    }
    return def;
  });

  return (
    <div className="p-4 max-w-full">
      <UnifiedListView
        data={accounts}
        columns={columnDefs}
        title="Unified Account List"
        idField={AccountConfig.idField}
        loading={loading}
        error={error}
        onRefresh={handleRefresh}
        onViewJson={handleViewJson}
        onRowClick={row => navigate(`/accounts/${row[AccountConfig.idField]}`)}
        pagination={true}
        paginationPageSize={25}
        paginationPageSizeOptions={[10,25,50,100]}
        collapsible={true}
        defaultCollapsed={false}
        collapseTitle="Show/Hide Accounts"
        gridHeight={500}
      />
    </div>
  );
};

export default TestAccountUnifiedList;
