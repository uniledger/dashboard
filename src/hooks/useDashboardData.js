import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

/**
 * Custom hook for managing dashboard overview data
 * @returns {Object} - Dashboard data and helper functions
 */
const useDashboardData = () => {
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    entities: [],
    ledgers: [],
    accounts: []
  });
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all dashboard data (entities, ledgers, accounts)
   */
  const fetchAllDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get data in parallel for better performance
      const [entitiesData, ledgersData, accountsData] = await Promise.all([
        apiService.entity.getEntities(),
        apiService.ledger.getLedgers(),
        apiService.account.getAccounts()
      ]);
      
      setDashboardData({
        entities: entitiesData,
        ledgers: ledgersData,
        accounts: accountsData
      });
      
      setLoading(false);
      return { entities: entitiesData, ledgers: ledgersData, accounts: accountsData };
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'An error occurred while fetching dashboard data');
      setLoading(false);
      return null;
    }
  }, []);

  /**
   * Refresh only account balances
   */
  const refreshAccountBalances = useCallback(async () => {
    try {
      const accountsData = await apiService.account.getAccounts();
      
      setDashboardData(prev => ({
        ...prev,
        accounts: accountsData
      }));
      
      return accountsData;
    } catch (err) {
      console.error('Error refreshing account balances:', err);
      // Don't update error state on auto-refresh to avoid disrupting the UI
      return null;
    }
  }, []);

  return {
    // Data
    dashboardData,
    loading,
    error,
    
    // Actions
    fetchAllDashboardData,
    refreshAccountBalances
  };
};

export default useDashboardData;