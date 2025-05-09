import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericListView } from '../common';
import { AccountListConfig } from './AccountListConfig.js';
import useAccounts from '../../hooks/useAccounts';

/**
 * Renders a list of accounts using the `GenericListView` component.
 * It utilizes the `useAccounts` hook to fetch and manage account data.
 * Handles navigation to the detailed view of an account when a row is clicked.
 * The list configuration (columns, etc.) is sourced from `AccountListConfig`.
 * This component does not take any direct props.
 * 
 * @returns {JSX.Element} The rendered AccountList component.
 */
const AccountList = () => {
  const navigate = useNavigate();
  const { accounts, loading: accountsLoading, fetchAccounts } = useAccounts(); 
  
  // Fetch accounts when component mounts
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);
  
  // Navigate to account detail view
  const handleViewAccount = (account) => {
    const accountId = typeof account === 'object' 
      ? (account.account_id || account.account_extra_id) 
      : account;
    navigate(`/accounts/${accountId}`);
  };

  return (
    <GenericListView
      data={accounts}
      columns={AccountListConfig.listColumns}
      title="Accounts"
      idField="account_id"
      loading={accountsLoading}
      onRowClick={handleViewAccount}
      onRefresh={fetchAccounts}
      searchPlaceholder="Search accounts..."
      emptyMessage="No accounts found"
    />
  );
};

export default AccountList;