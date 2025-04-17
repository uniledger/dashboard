import React, { useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import useEntities from '../../hooks/useEntities';
import useLedgers from '../../hooks/useLedgers';
import useAccounts from '../../hooks/useAccounts';
import useDashboardData from '../../hooks/useDashboardData';
import useReferenceData from '../../hooks/useReferenceData';
import useInterval from '../../utils/useInterval';
import { filterUtils } from '../../utils/filterUtils';

// Components
import DetailModal from '../shared/DetailModal';
import DashboardView from './DashboardView';
import EntityList from '../entities/EntityList';
import EntityDetail from '../entities/EntityDetail';
import LedgerList from '../ledgers/LedgerList';
import LedgerDetail from '../ledgers/LedgerDetail';
import AccountDetail from '../accounts/AccountDetail';
import AccountList from '../accounts/AccountList';
import CurrenciesList from '../reference/CurrenciesList';
import CountriesList from '../reference/CountriesList';
import AccountCodesList from '../reference/AccountCodesList';
import TemplatesPage from '../templates/TemplatesPage';
import ProcessedEventsView from '../processed-events/ProcessedEventsView';
import RulesView from '../rules/RulesView';
import { LoadingSpinner } from '../common';

/**
 * Dashboard Router component that handles navigation between dashboard tabs
 * and fetches appropriate data for each view
 */
const DashboardRouter = () => {
  // Get context and hook data
  const {
    activeTab,
    selectedEntityId,
    selectedLedgerId,
    selectedAccountId,
    accountsFilter,
    autoRefreshEnabled,
    refreshInterval,
    detailModal,
    handleCloseModal,
    handleViewJson,
    setSelectedEntityId,
    setSelectedLedgerId,
    setSelectedAccountId,
    handleEntitySelection,
    handleLedgerSelection,
    handleAccountSelection,
    handleDrillToAccounts,
    clearFilter
  } = useDashboard();
  
  const {
    entities,
    selectedEntity,
    entityLedgers,
    entityAccounts,
    loading: entitiesLoading,
    fetchEntities,
    fetchEntityById,
    refreshEntityAccounts,
    clearSelectedEntity
  } = useEntities();
  
  const {
    ledgers,
    selectedLedger,
    ledgerAccounts,
    loading: ledgersLoading,
    fetchLedgers,
    fetchLedgerById,
    refreshLedgerAccounts,
    clearSelectedLedger
  } = useLedgers();
  
  const {
    accounts,
    selectedAccount,
    loading: accountsLoading,
    fetchAccounts,
    selectAccount,
    clearSelectedAccount,
    refreshAccountBalances: refreshAccounts
  } = useAccounts();
  
  const {
    dashboardData,
    loading: dashboardLoading,
    fetchAllDashboardData,
    refreshAccountBalances: refreshDashboardAccounts
  } = useDashboardData();
  
  const {
    currencies,
    countries,
    accountCodes,
    loading: referenceLoading,
    fetchCurrencies,
    fetchCountries,
    fetchAccountCodes
  } = useReferenceData();

  // Aggregate loading state
  const isLoading = 
    dashboardLoading || 
    entitiesLoading || 
    ledgersLoading || 
    accountsLoading || 
    (referenceLoading && 
      (referenceLoading.currencies || 
      referenceLoading.countries || 
      referenceLoading.accountCodes));

  // Load initial data for active tab
  useEffect(() => {
    const loadTabData = async () => {
      switch(activeTab) {
        case 'dashboard':
          fetchAllDashboardData();
          break;
        case 'entities':
          if (!entities.length) {
            await fetchEntities();
          }
          if (selectedEntityId) {
            await fetchEntityById(selectedEntityId);
          }
          break;
        case 'ledgers':
          if (!ledgers.length) {
            await fetchLedgers();
          }
          if (selectedLedgerId) {
            await fetchLedgerById(selectedLedgerId);
          }
          break;
        case 'accounts':
          if (!accounts.length) {
            await fetchAccounts();
          }
          if (selectedAccountId) {
            selectAccount(selectedAccountId);
          }
          break;
        case 'currencies':
          if (!currencies.length) {
            await fetchCurrencies();
          }
          break;
        case 'countries':
          if (!countries.length) {
            await fetchCountries();
          }
          break;
        case 'account-codes':
          if (!accountCodes.length) {
            await fetchAccountCodes();
          }
          break;
        case 'templates':
          // Make sure ledgers and accounts are loaded for the templates view
          if (!ledgers.length) {
            await fetchLedgers();
          }
          if (!accounts.length) {
            await fetchAccounts();
          }
          break;
        default:
          break;
      }
    };
    
    loadTabData();
  }, [activeTab, selectedEntityId, selectedLedgerId, selectedAccountId]);

  // Targeted refresh function that only updates necessary data
  const refreshCurrentView = async () => {
    switch(activeTab) {
      case 'dashboard':
        await refreshDashboardAccounts();
        break;
      case 'entities':
        if (selectedEntityId) {
          await refreshEntityAccounts(selectedEntityId);
        } else {
          await fetchEntities();
        }
        break;
      case 'ledgers':
        if (selectedLedgerId) {
          await refreshLedgerAccounts(selectedLedgerId);
        } else {
          await fetchLedgers();
        }
        break;
      case 'accounts':
        await refreshAccounts();
        break;
      default:
        break;
    }
  };

  // Set up auto-refresh for account balances
  useInterval(() => {
    if (!autoRefreshEnabled) return;
    console.log('Auto-refreshing balances...');
    refreshCurrentView();
  }, refreshInterval);

  // Handle drilling down to accounts by specific type
  const handleDrillDown = async (type) => {
    // Make sure accounts are loaded before setting the filter
    await fetchAccounts();
    // Now use the handleDrillToAccounts from context
    handleDrillToAccounts(type);
  };

  // Handler functions for selecting entities, ledgers, and accounts
  // These ensure both the hooks and context state are updated

  // Handle selecting an entity from any view
  const handleViewEntity = (entityId) => {
    // Make sure we have a string ID
    const id = typeof entityId === 'object' ? entityId.entity_id : entityId;
    
    // Set the context state
    setSelectedEntityId(id);
    handleEntitySelection(id);
    // Also fetch the entity data
    fetchEntityById(id);
  };

  // Handle selecting a ledger from any view
  const handleViewLedger = (ledgerId) => {
    // Make sure we have a string ID
    const id = typeof ledgerId === 'object' ? ledgerId.ledger_id : ledgerId;
    
    // Set the context state
    setSelectedLedgerId(id);
    handleLedgerSelection(id);
    // Also fetch the ledger data
    fetchLedgerById(id);
  };

  // Handle selecting an account from any view
  const handleViewAccount = (account) => {
    // Always pass a clean ID, not an object
    const accountId = (typeof account === 'object')
      ? (account.account_id || account.account_extra_id)
      : account;
      
    // First select the account in the accounts hook
    selectAccount(accountId);
    // Then set the context state
    setSelectedAccountId(accountId);
    handleAccountSelection(accountId);
  };
  
  // Filter accounts by type if a filter is active
  const filteredAccounts = accountsFilter.active 
    ? filterUtils.filterAccountsByType(accounts, accountsFilter.type)
    : accounts;
  
  // Loading state
  if (isLoading && (!dashboardData && !entities.length && !ledgers.length && !accounts.length)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <LoadingSpinner size="lg" message="Loading data..." />
      </div>
    );
  }

  return (
    <>
      <DetailModal 
        isOpen={detailModal.isOpen}
        data={detailModal.data}
        title={detailModal.title}
        onClose={handleCloseModal}
      />
      
      <main className="flex-1 overflow-auto">
        <div className="max-w-full px-2 py-3">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && dashboardData && (
            <DashboardView 
              entities={dashboardData.entities} 
              ledgers={dashboardData.ledgers} 
              accounts={dashboardData.accounts}
              onRefresh={refreshDashboardAccounts}
              onDrillToAccounts={handleDrillDown}
            />
          )}

          {/* Entities Tab - List View */}
          {activeTab === 'entities' && !selectedEntityId && entities && (
            <EntityList 
              entities={entities}
              onViewDetails={handleViewEntity}
              onViewJson={handleViewJson}
              onRefresh={refreshCurrentView}
            />
          )}

          {/* Entities Tab - Detail View */}
          {activeTab === 'entities' && selectedEntityId && selectedEntity && (
            <EntityDetail 
              entity={selectedEntity}
              entityLedgers={entityLedgers}
              entityAccounts={entityAccounts}
              onBack={clearSelectedEntity}
              onViewJson={handleViewJson}
              onViewLedger={handleViewLedger}
              onViewAccount={handleViewAccount}
              onRefresh={() => fetchEntityById(selectedEntityId)}
            />
          )}

          {/* Ledgers Tab - List View */}
          {activeTab === 'ledgers' && !selectedLedgerId && ledgers && (
            <LedgerList 
              ledgers={ledgers}
              onViewDetails={handleViewLedger}
              onViewJson={handleViewJson}
              onRefresh={refreshCurrentView}
              onViewEntity={handleViewEntity}
            />
          )}

          {/* Ledgers Tab - Detail View */}
          {activeTab === 'ledgers' && selectedLedgerId && selectedLedger && (
            <LedgerDetail 
              ledger={selectedLedger}
              ledgerAccounts={ledgerAccounts}
              onBack={clearSelectedLedger}
              onViewJson={handleViewJson}
              onRefresh={() => fetchLedgerById(selectedLedgerId)}
              onViewEntity={handleViewEntity}
              onViewAccount={handleViewAccount}
            />
          )}

          {/* Accounts Tab */}
          {activeTab === 'accounts' && accounts && (
            !selectedAccountId ? (
              <AccountList 
                accounts={filteredAccounts}
                accountTypeFilter={accountsFilter.active ? accountsFilter.type : null}
                onViewJson={handleViewJson}
                onRefresh={refreshCurrentView}
                onViewEntity={handleViewEntity}
                onViewLedger={handleViewLedger}
                onViewAccount={handleViewAccount}
                onClearFilter={clearFilter}
              />
            ) : (
              <AccountDetail
                account={selectedAccount}
                onBack={clearSelectedAccount}
                onViewJson={handleViewJson}
                onRefresh={() => selectAccount(selectedAccountId)}
                onViewEntity={handleViewEntity}
                onViewLedger={handleViewLedger}
              />
            )
          )}

          {/* Currencies Tab */}
          {activeTab === 'currencies' && (
            <CurrenciesList 
              onViewJson={handleViewJson}
              onRefresh={fetchCurrencies}
            />
          )}

          {/* Countries Tab */}
          {activeTab === 'countries' && (
            <CountriesList 
              onViewJson={handleViewJson}
              onRefresh={fetchCountries}
            />
          )}

          {/* Account Codes Tab */}
          {activeTab === 'account-codes' && (
            <AccountCodesList 
              onViewJson={handleViewJson}
              onRefresh={fetchAccountCodes}
            />
          )}
          
          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <TemplatesPage 
              onViewJson={handleViewJson}
            />
          )}
          
          {/* Processed Events Tab */}
          {activeTab === 'processed-events' && (
            <ProcessedEventsView 
              onViewJson={handleViewJson}
            />
          )}
          
          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <RulesView 
              onViewJson={handleViewJson}
            />
          )}
        </div>
      </main>
    </>
  );
};

export default DashboardRouter;