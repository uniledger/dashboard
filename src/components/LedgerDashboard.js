import React, { useState, useEffect } from 'react';
import DetailModal from './shared/DetailModal';
import EntityList from './entities/EntityList';
import EntityDetail from './entities/EntityDetail';
import LedgerList from './ledgers/LedgerList';
import LedgerDetail from './ledgers/LedgerDetail';
import AccountList from './accounts/AccountList';
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
  
  // State for API data
  const [accounts, setAccounts] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for detail views
  const [entityAccounts, setEntityAccounts] = useState([]);
  const [ledgerAccounts, setLedgerAccounts] = useState([]);
  
  // State for detail modal
  const [detailModal, setDetailModal] = useState({ 
    isOpen: false, 
    data: null, 
    title: '' 
  });

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch enriched accounts
        const accountsResponse = await fetch(`${API_BASE_URL}/api/v1/enriched-accounts/`);
        const accountsData = await accountsResponse.json();
        setAccounts(accountsData);
        
        // Fetch enriched ledgers
        const ledgersResponse = await fetch(`${API_BASE_URL}/api/v1/enriched-ledgers/`);
        const ledgersData = await ledgersResponse.json();
        setLedgers(ledgersData);
        
        // Fetch enriched entities
        const entitiesResponse = await fetch(`${API_BASE_URL}/api/v1/enriched-entities/`);
        const entitiesData = await entitiesResponse.json();
        setEntities(entitiesData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'An error occurred while fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch accounts for a specific entity
  useEffect(() => {
    if (!selectedEntityId || loading) return;
    
    const fetchEntityAccounts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/enriched-entities/${selectedEntityId}/accounts/`);
        const data = await response.json();
        setEntityAccounts(data);
      } catch (err) {
        console.error('Error fetching entity accounts:', err);
        // Fall back to filtering accounts
        const filteredAccounts = accounts.filter(a => 
          a.entity_id === selectedEntityId || 
          (a.enriched_ledger && a.enriched_ledger.entity_id === selectedEntityId)
        );
        setEntityAccounts(filteredAccounts);
      }
    };

    fetchEntityAccounts();
  }, [selectedEntityId, accounts, loading]);

  // Set accounts for a specific ledger by filtering the existing accounts
  useEffect(() => {
    if (!selectedLedgerId || loading) return;
    
    // Filter accounts by ledger ID
    const filteredAccounts = accounts.filter(a => 
      a.ledger_id === selectedLedgerId || 
      (a.enriched_ledger && a.enriched_ledger.ledger_id === selectedLedgerId)
    );
    setLedgerAccounts(filteredAccounts);
    
  }, [selectedLedgerId, accounts, loading]);

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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading ledger data...</p>
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
              onClick={() => {
                setActiveTab('dashboard');
                setSelectedEntityId(null);
                setSelectedLedgerId(null);
              }}
              className={`pb-3 px-1 ${activeTab === 'dashboard' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab('entities');
                setSelectedEntityId(null);
                setSelectedLedgerId(null);
              }}
              className={`pb-3 px-1 ${activeTab === 'entities' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Entities
            </button>
            <button
              onClick={() => {
                setActiveTab('ledgers');
                setSelectedEntityId(null);
                setSelectedLedgerId(null);
              }}
              className={`pb-3 px-1 ${activeTab === 'ledgers' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Ledgers
            </button>
            <button
              onClick={() => {
                setActiveTab('accounts');
                setSelectedEntityId(null);
                setSelectedLedgerId(null);
              }}
              className={`pb-3 px-1 ${activeTab === 'accounts' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Accounts
            </button>
            <button
              onClick={() => {
                setActiveTab('analytics');
                setSelectedEntityId(null);
                setSelectedLedgerId(null);
              }}
              className={`pb-3 px-1 ${activeTab === 'analytics' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <DashboardView 
            entities={entities} 
            ledgers={ledgers} 
            accounts={accounts} 
          />
        )}

        {/* Entities Tab - List View */}
        {activeTab === 'entities' && !selectedEntityId && (
          <EntityList 
            entities={entities}
            accounts={accounts}
            ledgers={ledgers}
            onViewDetails={(entityId) => setSelectedEntityId(entityId)}
            onViewJson={handleViewJson}
          />
        )}

        {/* Entities Tab - Detail View */}
        {activeTab === 'entities' && selectedEntityId && (
          <EntityDetail 
            entity={entities.find(e => e.entity_id === selectedEntityId)}
            entityLedgers={ledgers.filter(l => l.entity_id === selectedEntityId)}
            entityAccounts={entityAccounts}
            onBack={() => setSelectedEntityId(null)}
            onViewJson={handleViewJson}
            onViewLedger={(ledgerId) => {
              setActiveTab('ledgers');
              setSelectedLedgerId(ledgerId);
            }}
          />
        )}

        {/* Ledgers Tab - List View */}
        {activeTab === 'ledgers' && !selectedLedgerId && (
          <LedgerList 
            ledgers={ledgers}
            entities={entities}
            accounts={accounts}
            onViewDetails={(ledgerId) => setSelectedLedgerId(ledgerId)}
            onViewJson={handleViewJson}
          />
        )}

        {/* Ledgers Tab - Detail View */}
        {activeTab === 'ledgers' && selectedLedgerId && (
          <LedgerDetail 
            ledger={ledgers.find(l => l.ledger_id === selectedLedgerId)}
            entities={entities}
            ledgerAccounts={ledgerAccounts}
            onBack={() => setSelectedLedgerId(null)}
            onViewJson={handleViewJson}
          />
        )}

        {/* Accounts Tab */}
        {activeTab === 'accounts' && (
          <AccountList 
            accounts={accounts}
            entities={entities}
            onViewJson={handleViewJson}
          />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsView 
            accounts={accounts}
            entities={entities}
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