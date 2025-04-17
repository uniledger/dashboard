import React, { createContext, useContext, useState } from 'react';

// Create Dashboard Context
const DashboardContext = createContext(null);

/**
 * Dashboard Context Provider
 * Manages shared state across dashboard components
 */
export const DashboardProvider = ({ children }) => {
  // Tab state
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Item selection state
  const [selectedEntityId, setSelectedEntityId] = useState(null);
  const [selectedLedgerId, setSelectedLedgerId] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  
  // Filter state
  const [accountsFilter, setAccountsFilter] = useState({
    active: false,
    type: ''
  });
  
  // Auto-refresh state
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(10000); // 10 seconds
  
  // Detail modal state
  const [detailModal, setDetailModal] = useState({ 
    isOpen: false, 
    data: null, 
    title: '' 
  });
  
  // Global error state
  const [error, setError] = useState(null);
  
  // UI state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Handle tab change
  const handleTabChange = (tab) => {
    console.log('Tab changed to:', tab);
    setActiveTab(tab);
    
    // Reset detail selections
    setSelectedEntityId(null);
    setSelectedLedgerId(null);
    setSelectedAccountId(null);
    
    // Reset accounts filter
    setAccountsFilter({
      active: false,
      type: ''
    });
  };
  
  // Handle entity selection
  const handleEntitySelection = (entityId) => {
    console.log('Entity selected:', entityId);
    // Set active tab to 'entities' to ensure we're in the right view
    setActiveTab('entities');
    // Reset other selections
    setSelectedLedgerId(null);
    setSelectedAccountId(null);
    // Set the selected entity
    setSelectedEntityId(entityId);
  };

  // Handle ledger selection
  const handleLedgerSelection = (ledgerId) => {
    console.log('Ledger selected:', ledgerId);
    // Set active tab to 'ledgers' to ensure we're in the right view
    setActiveTab('ledgers');
    // Reset other selections
    setSelectedEntityId(null);
    setSelectedAccountId(null);
    // Set the selected ledger
    setSelectedLedgerId(ledgerId);
  };
  
  // Handle account selection
  const handleAccountSelection = (accountId) => {
    // Set active tab to 'accounts' to ensure we're in the right view
    setActiveTab('accounts');
    // Reset other selections
    setSelectedEntityId(null);
    setSelectedLedgerId(null);
    // Set the selected account
    setSelectedAccountId(accountId);
  };
  
  // Handle drilling down to accounts by type
  const handleDrillToAccounts = (accountType) => {
    // Set the filter and change tab
    setAccountsFilter({
      active: true,
      type: accountType
    });
    setActiveTab('accounts');
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
  
  // Context value
  const value = {
    // State
    activeTab,
    selectedEntityId,
    selectedLedgerId,
    selectedAccountId,
    accountsFilter,
    autoRefreshEnabled,
    refreshInterval,
    detailModal,
    error,
    sidebarCollapsed,
    
    // Actions
    setActiveTab,
    setSelectedEntityId,
    setSelectedLedgerId,
    setSelectedAccountId,
    setAccountsFilter,
    setAutoRefreshEnabled,
    setRefreshInterval,
    setDetailModal,
    setError,
    setSidebarCollapsed,
    
    // Handlers
    handleTabChange,
    handleEntitySelection,
    handleLedgerSelection,
    handleAccountSelection,
    handleDrillToAccounts,
    handleViewJson,
    handleCloseModal
  };
  
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook to use the dashboard context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export default DashboardContext;
