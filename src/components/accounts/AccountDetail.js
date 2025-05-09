import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAccounts from '../../hooks/useAccounts';
import useAccountTransfers from '../../hooks/useAccountTransfers';
import { useDashboard } from '../../context/DashboardContext';

import GenericDetailView from '../common/GenericDetailView.js';
import GenericListView from '../common/GenericListView.js';
import { AccountDetailConfig } from './AccountDetailConfig.js';

/**
 * Displays detailed information for a specific account, including its transactions.
 * Fetches data using `useAccounts` and `useAccountTransfers` hooks and `useParams` for the account ID.
 * Renders content using `GenericDetailView` for account details and `GenericListView` for transfers.
 * 
 * @returns {JSX.Element} The rendered AccountDetail component, or null if no account data.
 */
const AccountDetail = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const { handleViewJson } = useDashboard();
  const { selectedAccount: account, loading, selectAccount } = useAccounts();
  const {
    accountTransfers,
    fetchAccountTransfers
  } = useAccountTransfers();

  const accountContext = { accountId };
  accountContext.accountId = accountId;

  // Fetch account data when component mounts or accountId changes
  useEffect(() => {
    if (accountId) {
      selectAccount(accountId);
      fetchAccountTransfers(accountId);
    }
  }, [accountId, selectAccount, fetchAccountTransfers]);

  if (!account) return null;

  // Handle navigation back to accounts list
  const handleBack = () => {
    navigate('/accounts');
  };

  // Handle refresh
  const handleRefresh = () => {
    selectAccount(accountId);
    fetchAccountTransfers(accountId);
  };

  // Extract entity and ledger information
  const entity = account?.entity || account?.enriched_entity ||
    (account?.enriched_ledger && account?.enriched_ledger.entity);

  const ledger = account?.ledger || account?.enriched_ledger;

  // Get standard sections from model config
  let sections = account ? [...AccountDetailConfig.detailSections(account, entity, ledger)] : [];

  // Use GenericDetailView for consistent presentation with transfers below
  return (
    <div className="space-y-6">
      <GenericDetailView
        data={account}
        title={AccountDetailConfig.title + " Detail"}
        subtitle={account?.name}
        sections={sections}
        onBack={handleBack}
        onRefresh={handleRefresh}
        onViewJson={handleViewJson}
        loading={loading}
        loadingMessage="Loading account details..."
      />

      <GenericListView
        title="Account Transfers"
        data={accountTransfers || []}
        columns={AccountDetailConfig.transferColumns}
        context={accountContext}
        idField="id"
        emptyMessage="No transfers found for this account"
        onViewJson={handleViewJson}
        onRefresh={() => fetchAccountTransfers(accountId)}
        loading={loading}
      />
    </div>
  );
};

export default AccountDetail;