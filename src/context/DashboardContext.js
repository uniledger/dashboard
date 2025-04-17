import React, { createContext, useContext, useState } from 'react';

// Create Dashboard Context
const DashboardContext = createContext(null);

/**
 * Dashboard Context Provider
 * Manages shared state across dashboard components
 */
export const DashboardProvider = ({ children }) => {
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
  
  // We no longer need this function since React Router handles navigation directly
  // and the filter is set based on URL parameters

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
  
  // Clear account filter
  const clearFilter = () => {
    setAccountsFilter({
      active: false,
      type: ''
    });
  };
  
  // Context value
  const value = {
    // State
    accountsFilter,
    autoRefreshEnabled,
    refreshInterval,
    detailModal,
    error,
    
    // Actions
    setAccountsFilter,
    setAutoRefreshEnabled,
    setRefreshInterval,
    setDetailModal,
    setError,
    clearFilter,
    
    // Handlers
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
