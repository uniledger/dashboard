import React, { useState, useEffect } from 'react';
import DetailModal from './shared/DetailModal';
import EntityList from './entities/EntityList';
import EntityDetail from './entities/EntityDetail';
import LedgerList from './ledgers/LedgerList';
import LedgerDetail from './ledgers/LedgerDetail';
import AccountList from './accounts/AccountList';
import AccountDetail from './accounts/AccountDetail';
import AnalyticsView from './analytics/AnalyticsView';
import DashboardView from './dashboard/DashboardView';

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
  const [analyticsData, setAnalyticsData] = useState(null);
  
  // Tab-specific loading states
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [entitiesLoading, setEntitiesLoading] = useState(false);
  const [ledgersLoading, setLedgersLoading] = useState(false);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  
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
      const entityAccountsResponse = await fetch(`${API_BASE_URL}/api/v1/entities/${entityId}/enriched-accounts/`);
      const entityAccountsData = await entityAccountsResponse.json();
      setEntityAccounts(entityAccountsData);
      console.log(`Fetched ${entityAccountsData.length} accounts for entity ${entityId} using proper endpoint`);
      
      setEntitiesLoading(false);
    } catch (err) {
      console.error('Error fetching entity detail:', err);
      setError(err.message || 'An error occurred while fetching entity data');
      setEntitiesLoading(false);
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
      const ledgerAccountsResponse = await fetch(`${API_BASE_URL}/api/v1/ledgers/${ledgerId}/enriched-accounts/`);
      const ledgerAccountsData = await ledgerAccountsResponse.json();
      setLedgerAccounts(ledgerAccountsData);
      console.log(`Fetched ${ledgerAccountsData.length} accounts for ledger ${ledgerId} using proper endpoint`);
      
      setLedgersLoading(false);
    } catch (err) {
      console.error('Error fetching ledger detail:', err);
      setError(err.message || 'An error occurred while fetching ledger data');
      setLedgersLoading(false);
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

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    if (analyticsData !== null) return; // Only fetch if not already loaded
    
    setAnalyticsLoading(true);
    try {
      // For analytics, fetch all data needed for reports
      const accountsResponse = await fetch(`${API_BASE_URL}/api/v1/enriched-accounts/`);
      const accountsData = await accountsResponse.json();
      
      const entitiesResponse = await fetch(`${API_BASE_URL}/api/v1/enriched-entities/`);
      const entitiesData = await entitiesResponse.json();
      
      const ledgersResponse = await fetch(`${API_BASE_URL}/api/v1/enriched-ledgers/`);
      const ledgersData = await ledgersResponse.json();
      
      setAnalyticsData({
        accounts: accountsData,
        entities: entitiesData,
        ledgers: ledgersData
      });
      
      setAnalyticsLoading(false);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err.message || 'An error occurred while fetching analytics data');
      setAnalyticsLoading(false);
    }
  };

  // Load dashboard data on initial component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Reset detail selections
    setSelectedEntityId(null);
    setSelectedLedgerId(null);
    
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
      case 'analytics':
        fetchAnalyticsData();
        break;
      default:
        break;
    }
  };

  // Handle entity selection
  const handleEntitySelection = (entityId) => {
    setSelectedEntityId(entityId);
    fetchEntityDetail(entityId);
  };

  // Handle ledger selection
  const handleLedgerSelection = (ledgerId) => {
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
  const isLoading = dashboardLoading || entitiesLoading || ledgersLoading || accountsLoading || analyticsLoading;

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
            <div className="flex space-x-4">
              <a 
                href="https://ledger.dev.ledgerrocket.com/openapi.json" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                API Documentation
              </a>
              <a 
                href="https://ledger.dev.ledgerrocket.com/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Swagger UI
              </a>
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Get API Key
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`pb-3 px-1 ${activeTab === 'dashboard' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Dashboard
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
              onClick={() => handleTabChange('ledgers')}
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
              onClick={() => handleTabChange('analytics')}
              className={`pb-3 px-1 ${activeTab === 'analytics' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Analytics
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

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analyticsData && (
          <AnalyticsView 
            accounts={analyticsData.accounts}
            entities={analyticsData.entities}
            onRefresh={fetchAnalyticsData}
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