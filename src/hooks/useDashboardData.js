import { useState, useCallback } from 'react';
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
      const [entitiesResponse, ledgersResponse, accountsResponse] = await Promise.all([
        apiService.entity.getEntities(),
        apiService.ledger.getLedgers(),
        apiService.account.getAccounts()
      ]);
      
      console.log('Dashboard data API responses:', {
        entities: entitiesResponse,
        ledgers: ledgersResponse,
        accounts: accountsResponse
      });
      
      // Extract data from the API responses
      const entitiesData = entitiesResponse.ok && entitiesResponse.data ? entitiesResponse.data : [];
      const ledgersData = ledgersResponse.ok && ledgersResponse.data ? ledgersResponse.data : [];
      const accountsData = accountsResponse.ok && accountsResponse.data ? accountsResponse.data : [];
      
      console.log('Setting dashboard data:', {
        entities: entitiesData.length,
        ledgers: ledgersData.length,
        accounts: accountsData.length
      });
      
      setDashboardData({
        entities: entitiesData,
        ledgers: ledgersData,
        accounts: accountsData
      });
      
      setLoading(false);
      return { entities: entitiesData, ledgers: ledgersData, accounts: accountsData };
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setDashboardData({
        entities: [],
        ledgers: [],
        accounts: [] // Ensure accounts is an array, even if fetch fails
      });
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
      const accountsResponse = await apiService.account.getAccounts();
      console.log('Refresh accounts response:', accountsResponse);
      
      // Extract data from the API response
      if (accountsResponse.ok && accountsResponse.data) {
        const accountsData = accountsResponse.data;
        console.log('Refreshing accounts data with', accountsData.length, 'accounts');
        
        setDashboardData(prev => ({
          ...prev,
          accounts: accountsData
        }));
        
        return accountsData;
      } else {
        console.error('Failed to refresh accounts:', accountsResponse.error);
        return null;
      }
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