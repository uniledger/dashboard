import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import useDataFetching from './useDataFetching';

/**
 * Custom hook for managing accounts data, implementing the generic data fetching hook
 * @returns {Object} - Accounts data and helper functions
 */
const useAccounts = () => {
  // Define API-specific fetching functions
  const fetchAllAccounts = useCallback(() => {
    return apiService.account.getAccounts();
  }, []);
  
  const fetchAccountById = useCallback((accountId) => {
    return apiService.account.getAccountById(accountId);
  }, []);
  
  // Use the generic data fetching hook
  const {
    items: accounts,
    selectedItem: selectedAccount,
    loading,
    error,
    fetchAllItems: fetchAccounts,
    setSelectedItem: setSelectedAccount,
    clearSelectedItem: clearSelectedAccount,
    setItems: setAccounts
  } = useDataFetching({
    fetchAll: fetchAllAccounts,
    fetchById: fetchAccountById,
    fetchChildren: () => Promise.resolve([]) // Accounts don't have children
  });
  
  // Additional state for account-specific features
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [filter, setFilter] = useState({
    active: false,
    type: ''
  });

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
   * Refresh account balances
   */
  const refreshAccountBalances = useCallback(async () => {
    try {
      const data = await fetchAllAccounts();
      setAccounts(data);
      applyFilter(data, filter);
      return true;
    } catch (err) {
      console.error('Error refreshing account balances:', err);
      return false;
    }
  }, [filter, fetchAllAccounts, setAccounts, applyFilter]);
  const filterByType = useCallback((type) => {
    const newFilter = {
      active: true,
      type: type.toUpperCase()
    };
    setFilter(newFilter);
    applyFilter(accounts, newFilter);
  }, [accounts, applyFilter]);

  const clearFilter = useCallback(() => {
    const newFilter = {
      active: false,
      type: ''
    };
    setFilter(newFilter);
    applyFilter(accounts, newFilter);
  }, [accounts, applyFilter]);
  const selectAccount = useCallback((accountId) => {
    const account = accounts.find(acc => 
      acc.account_id === accountId || 
      acc.account_id?.toString() === accountId?.toString() ||
      acc.account_extra_id === accountId || 
      acc.account_extra_id?.toString() === accountId?.toString()
    );
    setSelectedAccount(account);
  }, [accounts, setSelectedAccount]);

  // Apply filter whenever accounts or filter changes
  useEffect(() => {
    applyFilter(accounts, filter);
  }, [accounts, filter, applyFilter]);

  // Initial fetch
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

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