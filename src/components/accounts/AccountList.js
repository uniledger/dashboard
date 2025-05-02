import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GenericListView, AccountConfig } from '../common';
import useAccounts from '../../hooks/useAccounts';
import { useDashboard } from '../../context/DashboardContext';
import { accountCurrencyCellRenderer, accountOwnerCellRenderer, ledgerNameCellRenderer } from '../common/CellRenderers';

/** 
 * Account List component using GenericListView
 */
const AccountList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const accountTypeFilter = searchParams.get('type');
  const ledgerIdFilter = searchParams.get('ledgerId');
  
  const { setAccountsFilter } = useDashboard();
  const { accounts, loading: accountsLoading, fetchAccounts } = useAccounts(); 
  
  // Fetch accounts when component mounts
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Apply filter based on URL query param if present
  useEffect(() => {
    if (accountTypeFilter) {
      // If URL has a filter, sync it to context
      setAccountsFilter({
        active: true,
        type: accountTypeFilter
      });
    } else {
      // If URL has no filter, clear the context filter
      setAccountsFilter({
        active: false,
        type: ''
      });
    }
  }, [accountTypeFilter, setAccountsFilter]);
  
  // Navigate to entity detail view
  const handleViewEntity = (entityId) => {
    navigate(`/entities/${entityId}`);
  };
  
  // Navigate to ledger detail view
  const handleViewLedger = (ledgerId) => {
    navigate(`/ledgers/${ledgerId}`);
  };
  
  // Navigate to account detail view
  const handleViewAccount = (account) => {
    const accountId = typeof account === 'object' 
      ? (account.account_id || account.account_extra_id) 
      : account;
    navigate(`/accounts/${accountId}`);
  };
  
  // Handle clearing the filter
  const handleClearFilter = () => {
    // Clear the URL parameters first
    setSearchParams({});
    // Then clear the context filter
    setAccountsFilter({
      active: false,
      type: ''
    });
  };

  // Define columns for the DataTable - start with the base AccountConfig columns
  const columns = [...AccountConfig.listColumns];
  
  // Add entity (Account Owner) column
  columns.push({
    key: 'entity',
    headerName: 'Account Owner',
    cellRenderer: accountOwnerCellRenderer,
    cellClassName: (account) => {
      const owner = account.r_entity || account.enriched_ledger?.r_entity;
      return owner?.entity_id ? 'text-blue-600 cursor-pointer hover:underline' : 'text-gray-500';
    },
    onClick: (account) => {
      const owner = account.r_entity || account.enriched_ledger?.r_entity;
      if (owner?.entity_id) {
        handleViewEntity(owner.entity_id);
        return true;
      }
      return false;
    },
    preventRowClick: true
  });

  // Add ledger column
  columns.push({
    key: 'ledger',
    headerName: 'Ledger',
    cellRenderer: ledgerNameCellRenderer,
    onClick: (props) => {
      const ledgerId = props.data.ledger_id || 
                       (props.data.enriched_ledger && props.data.enriched_ledger.ledger_id);
      if (ledgerId) {
        handleViewLedger(ledgerId);
        return true; // Prevent other click handlers
      }
      return false;
    },
    preventRowClick: true
  });

  // Add currency column
  columns.push({
    key: 'currency',
    headerName: 'Currency',
    cellRenderer: accountCurrencyCellRenderer,
  });

  // Get filtered accounts based on URL query parameters
  let filteredAccounts = accounts;
  if (accountTypeFilter) {
    filteredAccounts = filteredAccounts.filter(account => 
      account.account_type === accountTypeFilter || 
      (account.account_code && account.account_code.type === accountTypeFilter)
    );
  }
  if (ledgerIdFilter) {
    filteredAccounts = filteredAccounts.filter(account => {
      const accLedgerId = account.ledger_id || (account.enriched_ledger && account.enriched_ledger.ledger_id);
      return String(accLedgerId) === ledgerIdFilter;
    });
  }

  // Create filter object for GenericListView if filtering by account type
  const filter = accountTypeFilter ? {
    field: 'account_type',
    value: accountTypeFilter,
    label: 'Account Type'
  } : null;

  return (
    <GenericListView
      data={filteredAccounts}
      columns={columns}
      title="Accounts"
      idField="account_id"
      loading={accountsLoading}
      onItemClick={handleViewAccount}
      onRefresh={fetchAccounts}
      filter={filter}
      onClearFilter={handleClearFilter}
      searchPlaceholder="Search accounts..."
      emptyMessage="No accounts found"
    />
  );
};

export default AccountList;