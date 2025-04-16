import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

/**
 * Custom hook for managing accounts data
 * @returns {Object} - Accounts data and helper functions
 */
const useAccounts = () => {
  // State for accounts data
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  
  // State for filter
  const [filter, setFilter] = useState({
    active: false,
    type: ''
  });
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all accounts
   */
  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiService.account.getAccounts();
      setAccounts(data);
      applyFilter(data, filter);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError(err.message || 'An error occurred while fetching accounts');
      setLoading(false);
    }
  }, [filter]);

  /**
   * Refresh account balances
   */
  const refreshAccountBalances = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiService.account.getAccounts();
      setAccounts(data);
      applyFilter(data, filter);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Error refreshing account balances:', err);
      setError(err.message || 'An error occurred while refreshing account balances');
      setLoading(false);
      return false;
    }
  }, [filter]);

  /**
   * Apply the current filter to accounts data
   * @param {Array} accountsData - Accounts data to filter
   * @param {Object} currentFilter - Current filter settings
   */
  const applyFilter = useCallback((accountsData, currentFilter) => {
    if (!currentFilter.active) {
      setFilteredAccounts(accountsData);
      return;
    }
    
    const filtered = accountsData.filter(account => {
      // Extract account type
      let accountType = 'OTHER';
      if (account.account_type) {
        accountType = account.account_type.toUpperCase();
      } else if (account.account_code && account.account_code.type) {
        accountType = account.account_code.type.toUpperCase();
      } else if (typeof account.account_code === 'object' && account.account_code.type) {
        accountType = account.account_code.type.toUpperCase();
      }
      
      return accountType === currentFilter.type;
    });
    
    setFilteredAccounts(filtered);
  }, []);

  /**
   * Filter accounts by type
   * @param {string} type - Account type to filter by
   */
  const filterByType = useCallback((type) => {
    const newFilter = {
      active: true,
      type: type.toUpperCase()
    };
    setFilter(newFilter);
    applyFilter(accounts, newFilter);
  }, [accounts, applyFilter]);

  /**
   * Clear the current filter
   */
  const clearFilter = useCallback(() => {
    const newFilter = {
      active: false,
      type: ''
    };
    setFilter(newFilter);
    applyFilter(accounts, newFilter);
  }, [accounts, applyFilter]);

  /**
   * Select an account by ID
   * @param {string|number} accountId - Account ID to select
   */
  const selectAccount = useCallback((accountId) => {
    const account = accounts.find(acc => 
      acc.account_id === accountId || 
      acc.account_id?.toString() === accountId?.toString() ||
      acc.account_extra_id === accountId || 
      acc.account_extra_id?.toString() === accountId?.toString()
    );
    setSelectedAccount(account);
  }, [accounts]);

  /**
   * Clear the selected account
   */
  const clearSelectedAccount = useCallback(() => {
    setSelectedAccount(null);
  }, []);

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Apply filter whenever accounts or filter changes
  useEffect(() => {
    applyFilter(accounts, filter);
  }, [accounts, filter, applyFilter]);

  return {
    // Data
    accounts,
    filteredAccounts,
    selectedAccount,
    filter,
    loading,
    error,
    
    // Actions
    fetchAccounts,
    refreshAccountBalances,
    filterByType,
    clearFilter,
    selectAccount,
    clearSelectedAccount
  };
};

export default useAccounts;