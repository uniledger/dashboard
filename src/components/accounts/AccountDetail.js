import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GenericDetailView, AccountConfig } from '../common';
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
  
  // Create entity and ledger link sections if available
  const entitySection = entity ? {
    label: 'Entity',
    content: (
      <Link 
        to={`/entities/${entity.entity_id}`} 
        className="text-blue-600 hover:text-blue-800 hover:underline"
      >
        {entity.name || entity.entity_id}
      </Link>
    )
  } : null;
  
  const ledgerSection = ledger ? {
    label: 'Ledger',
    content: (
      <Link 
        to={`/ledgers/${ledger.ledger_id}`} 
        className="text-blue-600 hover:text-blue-800 hover:underline"
      >
        {ledger.name || ledger.ledger_id}
      </Link>
    )
  } : null;

  // Get standard sections from model config
  let sections = account ? [...AccountConfig.detailSections(account, entity, ledger)] : [];
  
  // Add creation info if available
  if (account?.date_created) {
    sections.push({
      label: 'Created',
      content: new Date(account.date_created).toLocaleString()
    });
  }
  
  // Add entity and ledger link sections if available
  if (entitySection) {
    // Insert entity section after account type (index 3)
    sections.splice(3, 0, entitySection);
  }
  
  if (ledgerSection) {
    // Insert ledger section after entity section or after account type
    const insertIndex = entitySection ? 4 : 3;
    sections.splice(insertIndex, 0, ledgerSection);
  }
  
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
      />
    </div>
  );
};

export default AccountDetail;