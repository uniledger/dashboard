import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GenericListView, AccountConfig } from '../common';
import { formatBalance, getBalanceClass, getCurrencyInfo } from '../../utils/formatters/index';
import useAccounts from '../../hooks/useAccounts';
import { useDashboard } from '../../context/DashboardContext';

/** 
 * Account List component using GenericListView
 */
const AccountList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const accountTypeFilter = searchParams.get('type');
  
  const { handleViewJson, setAccountsFilter } = useDashboard();
  const { accounts, loading: accountsLoading, fetchAccounts, refreshAccountBalances } = useAccounts(); 
  
  const [loading, setLoading] = useState(false);

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

  // Fetch accounts when component mounts
  useEffect(() => {
    setLoading(true);
    fetchAccounts()
      .finally(() => setLoading(false));
  }, [fetchAccounts]);


  const getCurrencyCode = (account) => {
    return (account.enriched_ledger && account.enriched_ledger.r_currency && account.enriched_ledger.r_currency.currency_code) || 
      account.currency_code || 
      'N/A';
  };
  
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
  
  // Add entity column
  columns.push({
    key: 'entity',
    header: 'Account Owner',
    render: (account) => {
      return account.entity?.name || 
             account.enriched_ledger?.entity?.name || 
             'N/A';
    },
    cellClassName: (account) => {
      const entityId = account.entity_id || 
                       (account.enriched_ledger && account.enriched_ledger.entity_id) || 
                       (account.entity && account.entity.entity_id);
      return entityId ? 'text-blue-600 cursor-pointer hover:underline' : 'text-gray-500';
    },
    onClick: (account) => {
      const entityId = account.entity_id || 
                       (account.enriched_ledger && account.enriched_ledger.entity_id) || 
                       (account.entity && account.entity.entity_id);
      if (entityId) {
        handleViewEntity(entityId);
        return true; // Prevent other click handlers
      }
      return false;
    },
    preventRowClick: true
  });

  // Add ledger column
  columns.push({
    key: 'ledger',
    header: 'Ledger',
    render: (account) => {
      return account.enriched_ledger?.name || 
             account.ledger?.name || 
             account.ledger_name || 
             'N/A';
    },
    cellClassName: (account) => {
      const ledgerId = account.ledger_id || 
                       (account.enriched_ledger && account.enriched_ledger.ledger_id);
      return ledgerId ? 'text-blue-600 cursor-pointer hover:underline' : 'text-gray-500';
    },
    onClick: (account) => {
      const ledgerId = account.ledger_id || 
                       (account.enriched_ledger && account.enriched_ledger.ledger_id);
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
    header: 'Currency',
    render: (account) => getCurrencyCode(account)
  });

  // Make sure balance column is using consistent formatting
  const balanceColumnIndex = columns.findIndex(col => col.key === 'balance');
  if (balanceColumnIndex !== -1) {
    columns[balanceColumnIndex] = {
      ...columns[balanceColumnIndex],
      cellClassName: (account) => getBalanceClass(account.balance),
      render: (account) => {
        const currency = getCurrencyInfo(account);
        return formatBalance(account.balance, currency, true);
      }
    };
  }

  // Get filtered accounts based on URL query parameter
  const filteredAccounts = accountTypeFilter 
    ? accounts.filter(account => 
        account.account_type === accountTypeFilter || 
        (account.account_code && account.account_code.type === accountTypeFilter))
    : accounts;

  // We don't need custom header anymore, we'll use the standard filter badge

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
      loading={loading || accountsLoading}
      onItemClick={handleViewAccount}
      onViewJson={handleViewJson}
      onRefresh={refreshAccountBalances}
      filter={filter}
      onClearFilter={handleClearFilter}
      searchPlaceholder="Search accounts..."
      emptyMessage="No accounts found"
    />
  );
};

export default AccountList;