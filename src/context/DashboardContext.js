import React, { createContext, useContext, useState } from 'react';

// Create Dashboard Context
const DashboardContext = createContext(null);

/**
 * Provides shared state and actions across dashboard components.
 * This includes managing filter states, auto-refresh settings, detail modal visibility and content,
 * and global error messages.
 * 
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The child components that will have access to this context.
 * @returns {JSX.Element} The DashboardContext.Provider wrapping the children.
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

/**
 * Custom hook to access the DashboardContext.
 * Provides a convenient way for components to consume shared dashboard state and actions.
 * Throws an error if used outside of a `DashboardProvider`.
 * 
 * @returns {Object} The dashboard context value, including state and action dispatchers.
 */
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export default DashboardContext;
