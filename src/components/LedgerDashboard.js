import React, { useState, useEffect } from 'react';
import DetailModal from './shared/DetailModal';
import EntityList from './entities/EntityList';
import EntityDetail from './entities/EntityDetail';
import LedgerList from './ledgers/LedgerList';
import LedgerDetail from './ledgers/LedgerDetail';
import AccountList from './accounts/AccountList';
import AccountDetail from './accounts/AccountDetail';
import DashboardView from './dashboard/DashboardView';
import CurrenciesList from './reference/CurrenciesList';
import CountriesList from './reference/CountriesList';
import AccountCodesList from './reference/AccountCodesList';
import TemplatesView from './templates/TemplatesView';
import ProcessedEventsView from './processed-events/ProcessedEventsView';
import RulesView from './rules/RulesView';
import useInterval from '../utils/useInterval';

const API_BASE_URL = 'https://ledger.dev.ledgerrocket.com';

/**
 * Main dashboard component that manages all views and API data
 */
const LedgerDashboard = () => {
  // State for active tab and detail views
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEntityId, setSelectedEntityId] = useState(null);
  const [selectedLedgerId, setSelectedLedgerId] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [accountDetail, setAccountDetail] = useState(null);
  
  // Tab-specific states replacing global state
  const [dashboardData, setDashboardData] = useState(null);
  const [entitiesList, setEntitiesList] = useState(null);
  const [entityDetail, setEntityDetail] = useState(null);
  const [entityLedgers, setEntityLedgers] = useState(null);
  const [entityAccounts, setEntityAccounts] = useState(null);
  const [ledgersList, setLedgersList] = useState(null);
  const [ledgerDetail, setLedgerDetail] = useState(null);
  const [ledgerAccounts, setLedgerAccounts] = useState([]);
  const [accountsList, setAccountsList] = useState(null);
  const [currenciesList, setCurrenciesList] = useState(null);
  const [countriesList, setCountriesList] = useState(null);
  const [accountCodesList, setAccountCodesList] = useState(null);
  
  // State for auto-refresh
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(10000); // 10 seconds
  
  // Tab-specific loading states
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [entitiesLoading, setEntitiesLoading] = useState(false);
  const [ledgersLoading, setLedgersLoading] = useState(false);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [currenciesLoading, setCurrenciesLoading] = useState(false);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [accountCodesLoading, setAccountCodesLoading] = useState(false);
  
  // Global error state
  const [error, setError] = useState(null);
  
  // State for detail modal
  const [detailModal, setDetailModal] = useState({ 
    isOpen: false, 
    data: null, 
    title: '' 
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setDashboardLoading(true);
    try {
      // Get counts and aggregate data for dashboard view
      const entitiesResponse = await fetch(`${API_BASE_URL}/api/v1/enriched-entities/`);
      const entitiesData = await entitiesResponse.json();
      
      const ledgersResponse = await fetch(`${API_BASE_URL}/api/v1/enriched-ledgers/`);
      const ledgersData = await ledgersResponse.json();
      
      const accountsResponse = await fetch(`${API_BASE_URL}/api/v1/enriched-accounts/`);
      const accountsData = await accountsResponse.json();
      
      setDashboardData({
        entities: entitiesData,
        ledgers: ledgersData,
        accounts: accountsData
      });
      
      setDashboardLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'An error occurred while fetching dashboard data');
      setDashboardLoading(false);
    }
  };

  // Fetch only accounts data for dashboard
  const fetchDashboardAccounts = async () => {
    try {
      const accountsResponse = await fetch(`${API_BASE_URL}/api/v1/enriched-accounts/`);
      const accountsData = await accountsResponse.json();
      
      setDashboardData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          accounts: accountsData
        };
      });
    } catch (err) {
      console.error('Error refreshing dashboard accounts:', err);
      // Don't update error state on auto-refresh to avoid disrupting the UI
    }
  };

  // Fetch entities list
  const fetchEntitiesList = async () => {
    if (entitiesList !== null) return; // Only fetch if not already loaded
    
    setEntitiesLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/enriched-entities/`);
      const data = await response.json();
      setEntitiesList(data);
      setEntitiesLoading(false);
    } catch (err) {
      console.error('Error fetching entities:', err);
      setError(err.message || 'An error occurred while fetching entities');
      setEntitiesLoading(false);
    }
  };

  // Fetch entity detail
  const fetchEntityDetail = async (entityId) => {
    setEntitiesLoading(true);
    try {
      // Fetch entity details
      const entityResponse = await fetch(`${API_BASE_URL}/api/v1/enriched-entities/${entityId}`);
      const entityData = await entityResponse.json();
      setEntityDetail(entityData);
      
      // Fetch ledgers for the entity
      const entityLedgersResponse = await fetch(`${API_BASE_URL}/api/v1/enriched-ledgers/?entity_id=${entityId}`);
      const entityLedgersData = await entityLedgersResponse.json();
      setEntityLedgers(entityLedgersData);
      
      // Fetch accounts for the entity - using the proper endpoint with entity_id filter
      await fetchEntityAccounts(entityId);
      
      setEntitiesLoading(false);
    } catch (err) {
      console.error('Error fetching entity detail:', err);
      setError(err.message || 'An error occurred while fetching entity data');
      setEntitiesLoading(false);
    }
  };
  
  // Only fetch accounts for a specific entity
  const fetchEntityAccounts = async (entityId) => {
    try {
      const entityAccountsResponse = await fetch(`${API_BASE_URL}/api/v1/entities/${entityId}/enriched-accounts/`);
      const entityAccountsData = await entityAccountsResponse.json();
      setEntityAccounts(entityAccountsData);
      console.log(`Fetched ${entityAccountsData.length} accounts for entity ${entityId} using proper endpoint`);
    } catch (err) {
      console.error('Error refreshing entity accounts:', err);
      // Don't update error state on auto-refresh
    }
  };

  // Fetch ledgers list
  const fetchLedgersList = async () => {
    if (ledgersList !== null) return; // Only fetch if not already loaded
    
    setLedgersLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/enriched-ledgers/`);
      const data = await response.json();
      setLedgersList(data);
      setLedgersLoading(false);
    } catch (err) {
      console.error('Error fetching ledgers:', err);
      setError(err.message || 'An error occurred while fetching ledgers');
      setLedgersLoading(false);
    }
  };

  // Fetch ledger detail
  const fetchLedgerDetail = async (ledgerId) => {
    setLedgersLoading(true);
    try {
      // Fetch ledger details
      const ledgerResponse = await fetch(`${API_BASE_URL}/api/v1/enriched-ledgers/${ledgerId}`);
      const ledgerData = await ledgerResponse.json();
      setLedgerDetail(ledgerData);
      
      // Fetch accounts for the ledger - using the proper endpoint with ledger_id filter
      await fetchLedgerAccounts(ledgerId);
      
      setLedgersLoading(false);
    } catch (err) {
      console.error('Error fetching ledger detail:', err);
      setError(err.message || 'An error occurred while fetching ledger data');
      setLedgersLoading(false);
    }
  };
  
  // Only fetch accounts for a specific ledger
  const fetchLedgerAccounts = async (ledgerId) => {
    try {
      const ledgerAccountsResponse = await fetch(`${API_BASE_URL}/api/v1/ledgers/${ledgerId}/enriched-accounts/`);
      const ledgerAccountsData = await ledgerAccountsResponse.json();
      setLedgerAccounts(ledgerAccountsData);
      console.log(`Fetched ${ledgerAccountsData.length} accounts for ledger ${ledgerId} using proper endpoint`);
    } catch (err) {
      console.error('Error refreshing ledger accounts:', err);
      // Don't update error state on auto-refresh
    }
  };
  
  // Fetch account detail
  const fetchAccountDetail = async (accountId) => {
    setAccountsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/enriched-accounts/${accountId}`);
      const data = await response.json();
      setAccountDetail(data);
      setAccountsLoading(false);
    } catch (err) {
      console.error('Error fetching account detail:', err);
      setError(err.message || 'An error occurred while fetching account data');
      setAccountsLoading(false);
    }
  };

  // Fetch accounts list
  const fetchAccountsList = async () => {
    if (accountsList !== null) return; // Only fetch if not already loaded
    
    setAccountsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/enriched-accounts/`);
      const data = await response.json();
      setAccountsList(data);
      setAccountsLoading(false);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError(err.message || 'An error occurred while fetching accounts');
      setAccountsLoading(false);
    }
  };
  
  // Only fetch account balances for account list
  const fetchAccountBalances = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/enriched-accounts/`);
      const data = await response.json();
      setAccountsList(data);
    } catch (err) {
      console.error('Error refreshing account balances:', err);
      // Don't update error state on auto-refresh
    }
  };

  // Fetch currencies list
  const fetchCurrenciesList = async () => {
    if (currenciesList !== null) return; // Only fetch if not already loaded
    
    setCurrenciesLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/currencies/`);
      const data = await response.json();
      setCurrenciesList(data);
      setCurrenciesLoading(false);
    } catch (err) {
      console.error('Error fetching currencies:', err);
      setError(err.message || 'An error occurred while fetching currencies');
      setCurrenciesLoading(false);
    }
  };

  // Fetch countries list
  const fetchCountriesList = async () => {
    if (countriesList !== null) return; // Only fetch if not already loaded
    
    setCountriesLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/countries/`);
      const data = await response.json();
      setCountriesList(data);
      setCountriesLoading(false);
    } catch (err) {
      console.error('Error fetching countries:', err);
      setError(err.message || 'An error occurred while fetching countries');
      setCountriesLoading(false);
    }
  };

  // Fetch account codes list
  const fetchAccountCodesList = async () => {
    if (accountCodesList !== null) return; // Only fetch if not already loaded
    
    setAccountCodesLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/account-codes/`);
      const data = await response.json();
      setAccountCodesList(data);
      setAccountCodesLoading(false);
    } catch (err) {
      console.error('Error fetching account codes:', err);
      setError(err.message || 'An error occurred while fetching account codes');
      setAccountCodesLoading(false);
    }
  };

  // Auto-refresh hook - update account balances, entity details, or ledger details
  useInterval(() => {
    if (!autoRefreshEnabled) return;

    console.log('Auto-refreshing data...');
    
    // Refresh based on what's currently displayed
    if (activeTab === 'dashboard') {
      // Just fetch account balance data
      fetchDashboardAccounts();
    } else if (activeTab === 'accounts' && selectedAccountId) {
      // Refresh the selected account detail
      fetchAccountDetail(selectedAccountId);
    } else if (activeTab === 'accounts' && !selectedAccountId) {
      // Refresh the accounts list
      fetchAccountBalances();
    } else if (activeTab === 'ledgers' && selectedLedgerId) {
      // Refresh accounts for the selected ledger
      fetchLedgerAccounts(selectedLedgerId);
    } else if (activeTab === 'entities' && selectedEntityId) {
      // Refresh accounts for the selected entity
      fetchEntityAccounts(selectedEntityId);
    }
  }, refreshInterval);

  // Load dashboard data on initial component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle tab change
  const handleTabChange = (tab) => {
    console.log('Tab changed to:', tab);
    setActiveTab(tab);
    
    // Reset detail selections
    setSelectedEntityId(null);
    setSelectedLedgerId(null);
    setSelectedAccountId(null);
    
    // Load tab-specific data if needed
    switch(tab) {
      case 'dashboard':
        fetchDashboardData();
        break;
      case 'entities':
        fetchEntitiesList();
        break;
      case 'ledgers':
        fetchLedgersList();
        break;
      case 'accounts':
        fetchAccountsList();
        break;
      case 'currencies':
        fetchCurrenciesList();
        break;
      case 'countries':
        fetchCountriesList();
        break;
      case 'account-codes':
        fetchAccountCodesList();
        break;
      case 'templates':
        // Make sure ledgers and accounts are loaded for the templates view
        fetchLedgersList();
        fetchAccountsList();
        break;
      default:
        break;
    }
  };

  // Handle entity selection
  const handleEntitySelection = (entityId) => {
    console.log('Entity selected:', entityId);
    // Set active tab to 'entities' to ensure we're in the right view
    setActiveTab('entities');
    // Reset other selections
    setSelectedLedgerId(null);
    setSelectedAccountId(null);
    // Set the selected entity and fetch its details
    setSelectedEntityId(entityId);
    fetchEntityDetail(entityId);
  };

  // Handle ledger selection
  const handleLedgerSelection = (ledgerId) => {
    console.log('Ledger selected:', ledgerId);
    // Set active tab to 'ledgers' to ensure we're in the right view
    setActiveTab('ledgers');
    // Reset other selections
    setSelectedEntityId(null);
    setSelectedAccountId(null);
    // Set the selected ledger and fetch its details
    setSelectedLedgerId(ledgerId);
    fetchLedgerDetail(ledgerId);
  };

  // Handle opening the detail modal
  const handleViewJson = (data, title) => {
    setDetailModal({
      isOpen: true,
      data,
      title
    });
  };

  // Handle closing the detail modal
  const handleCloseModal = () => {
    setDetailModal({
      isOpen: false,
      data: null,
      title: ''
    });
  };

  // Check if any tab is in loading state
  const isLoading = dashboardLoading || entitiesLoading || ledgersLoading || accountsLoading ||
                   currenciesLoading || countriesLoading || accountCodesLoading;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center text-red-500">
          <p>Error loading data: {error}</p>
          <button 
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DetailModal 
        isOpen={detailModal.isOpen}
        data={detailModal.data}
        title={detailModal.title}
        onClose={handleCloseModal}
      />
      
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">LedgerRocket Banking API Demo</h1>
            <div className="flex space-x-4 items-center text-sm">
              <div className="flex space-x-2">
                <a 
                  href="https://ledger.dev.ledgerrocket.com/openapi.json" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Ledger API
                </a>
                <span className="text-gray-400">|</span>
                <a 
                  href="https://transactions.dev.ledgerrocket.com/openapi.json" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Transactions API
                </a>
                <span className="text-gray-400">|</span>
                <a 
                  href="https://ledger.dev.ledgerrocket.com/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Ledger Docs
                </a>
                <span className="text-gray-400">|</span>
                <a 
                  href="https://transactions.dev.ledgerrocket.com/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Transactions Docs
                </a>
              </div>
              <button 
                onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                className={`px-2 py-1 text-xs rounded-md ${autoRefreshEnabled 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-gray-100 text-gray-800 border border-gray-200'}`}
                title={autoRefreshEnabled ? "Auto-refresh is on" : "Auto-refresh is off"}
              >
                {autoRefreshEnabled ? "Auto-Refresh: ON" : "Auto-Refresh: OFF"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`pb-3 px-1 ${activeTab === 'dashboard' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Balance Sheet / Income
            </button>
            <button
              onClick={() => {
                console.log('Ledgers tab clicked - reset all detail state');
                // This is a direct tab change, so reset ALL detail state
                setSelectedLedgerId(null);
                setSelectedEntityId(null);
                setSelectedAccountId(null);
                handleTabChange('ledgers');
              }}
              className={`pb-3 px-1 ${activeTab === 'ledgers' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Ledgers
            </button>
            <button
              onClick={() => handleTabChange('accounts')}
              className={`pb-3 px-1 ${activeTab === 'accounts' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Accounts
            </button>
            <button
              onClick={() => handleTabChange('entities')}
              className={`pb-3 px-1 ${activeTab === 'entities' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Entities
            </button>
            <button
              onClick={() => handleTabChange('currencies')}
              className={`pb-3 px-1 ${activeTab === 'currencies' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Currencies
            </button>
            <button
              onClick={() => handleTabChange('countries')}
              className={`pb-3 px-1 ${activeTab === 'countries' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Countries
            </button>
            <button
              onClick={() => handleTabChange('account-codes')}
              className={`pb-3 px-1 ${activeTab === 'account-codes' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Account Codes
            </button>
            <button
              onClick={() => handleTabChange('templates')}
              className={`pb-3 px-1 ${activeTab === 'templates' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Templates
            </button>
            <button
              onClick={() => handleTabChange('processed-events')}
              className={`pb-3 px-1 ${activeTab === 'processed-events' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Processed Events
            </button>
            <button
              onClick={() => handleTabChange('rules')}
              className={`pb-3 px-1 ${activeTab === 'rules' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Rules
            </button>
          </nav>
        </div>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && dashboardData && (
          <DashboardView 
            entities={dashboardData.entities} 
            ledgers={dashboardData.ledgers} 
            accounts={dashboardData.accounts}
            onRefresh={fetchDashboardData}
          />
        )}

        {/* Entities Tab - List View */}
        {activeTab === 'entities' && !selectedEntityId && entitiesList && (
          <EntityList 
            entities={entitiesList}
            onViewDetails={handleEntitySelection}
            onViewJson={handleViewJson}
            onRefresh={fetchEntitiesList}
          />
        )}

        {/* Entities Tab - Detail View */}
        {activeTab === 'entities' && selectedEntityId && entityDetail && (
          <EntityDetail 
            entity={entityDetail}
            entityLedgers={entityLedgers}
            entityAccounts={entityAccounts}
            onBack={() => setSelectedEntityId(null)}
            onViewJson={handleViewJson}
            onViewLedger={(ledgerId) => {
              setActiveTab('ledgers');
              setSelectedLedgerId(ledgerId);
              fetchLedgerDetail(ledgerId);
            }}
            onViewAccount={(account) => {
              setActiveTab('accounts');
              setSelectedAccountId(account.account_id || account.account_extra_id);
              setAccountDetail(account);
            }}
            onRefresh={() => fetchEntityDetail(selectedEntityId)}
          />
        )}

        {/* Ledgers Tab - List View */}
        {activeTab === 'ledgers' && !selectedLedgerId && ledgersList && (
          <LedgerList 
            ledgers={ledgersList}
            onViewDetails={handleLedgerSelection}
            onViewJson={handleViewJson}
            onRefresh={fetchLedgersList}
            onViewEntity={handleEntitySelection}
          />
        )}

        {/* Ledgers Tab - Detail View */}
        {activeTab === 'ledgers' && selectedLedgerId && ledgerDetail && (
          <LedgerDetail 
            ledger={ledgerDetail}
            ledgerAccounts={ledgerAccounts}
            onBack={() => setSelectedLedgerId(null)}
            onViewJson={handleViewJson}
            onRefresh={() => fetchLedgerDetail(selectedLedgerId)}
            onViewEntity={handleEntitySelection}
            onViewAccount={(account) => {
              setActiveTab('accounts');
              setSelectedAccountId(account.account_id || account.account_extra_id);
              setAccountDetail(account);
            }}
          />
        )}

        {/* Accounts Tab */}
        {activeTab === 'accounts' && accountsList && (
          !selectedAccountId ? (
            <AccountList 
              accounts={accountsList}
              onViewJson={handleViewJson}
              onRefresh={fetchAccountsList}
              onViewEntity={handleEntitySelection}
              onViewLedger={handleLedgerSelection}
              onViewAccount={(account) => {
                setSelectedAccountId(account.account_id || account.account_extra_id);
                setAccountDetail(account);
              }}
            />
          ) : (
            <AccountDetail
              account={accountDetail}
              onBack={() => setSelectedAccountId(null)}
              onViewJson={handleViewJson}
              onRefresh={() => fetchAccountDetail(selectedAccountId)}
              onViewEntity={handleEntitySelection}
              onViewLedger={handleLedgerSelection}
            />
          )
        )}

        {/* Currencies Tab */}
        {activeTab === 'currencies' && (
          <CurrenciesList 
            onViewJson={handleViewJson}
            onRefresh={fetchCurrenciesList}
          />
        )}

        {/* Countries Tab */}
        {activeTab === 'countries' && (
          <CountriesList 
            onViewJson={handleViewJson}
            onRefresh={fetchCountriesList}
          />
        )}

        {/* Account Codes Tab */}
        {activeTab === 'account-codes' && (
          <AccountCodesList 
            onViewJson={handleViewJson}
            onRefresh={fetchAccountCodesList}
          />
        )}
        
        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <TemplatesView 
            ledgers={ledgersList || []}
            accounts={accountsList || []}
            onViewJson={handleViewJson}
            onRefresh={() => {
              fetchLedgersList();
              fetchAccountsList();
            }}
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
      </main>

      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">© 2025 LedgerRocket. All rights reserved.</p>
            <div className="flex space-x-6">
              <button className="text-gray-500 hover:text-gray-700 text-sm">Documentation</button>
              <button className="text-gray-500 hover:text-gray-700 text-sm">API Reference</button>
              <button className="text-gray-500 hover:text-gray-700 text-sm">Support</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LedgerDashboard;