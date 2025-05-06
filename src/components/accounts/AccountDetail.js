import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GenericDetailView from '../common/GenericDetailView.js';
import { AccountConfig } from './AccountConfig.js';
import useAccounts from '../../hooks/useAccounts';
import useAccountTransfers from '../../hooks/useAccountTransfers';
import { useDashboard } from '../../context/DashboardContext';
import AccountTransfersList from './AccountTransfersList';

/**
 * Account Detail component using GenericDetailView
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
  let sections = account ? [...AccountConfig.detailSections(account, entity, ledger)] : [];
  
  // Use GenericDetailView for consistent presentation with transfers below
  return (
    <div className="space-y-6">
      <GenericDetailView
        data={account}
        title={AccountConfig.title + " Detail"}
        subtitle={account?.name}
        sections={sections}
        onBack={handleBack}
        onRefresh={handleRefresh}
        onViewJson={handleViewJson}
        loading={loading}
        loadingMessage="Loading account details..."
      />
      
      {/* Directly render transfers table with auto-growing height */}
      <AccountTransfersList 
        transfers={accountTransfers || []} 
        accountId={accountId}
        onViewJson={handleViewJson}
        onRefresh={() => fetchAccountTransfers(accountId)}
        loading={loading}
      />
    </div>
  );
};

export default AccountDetail;