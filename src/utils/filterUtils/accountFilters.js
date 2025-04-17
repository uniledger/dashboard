/**
 * Account-specific filtering logic
 */
import { filterData } from './index';

/**
 * Filter account data by account type (handles different structures)
 * @param {Array} accounts - Array of account objects
 * @param {string} accountType - Account type to filter by
 * @returns {Array} - Filtered accounts
 */
export const filterAccountsByType = (accounts, accountType) => {
  if (!accountType) {
    return accounts;
  }

  const normalizedType = accountType.toUpperCase();

  return accounts.filter(account => {
    // Extract account type from different possible structures
    let accountTypeValue = 'OTHER';
    
    if (account.account_type) {
      accountTypeValue = account.account_type.toUpperCase();
    } else if (account.account_code && account.account_code.type) {
      accountTypeValue = account.account_code.type.toUpperCase();
    } else if (typeof account.account_code === 'object' && account.account_code.type) {
      accountTypeValue = account.account_code.type.toUpperCase();
    } else if (account.type) {
      accountTypeValue = account.type.toUpperCase();
    }
    
    return accountTypeValue === normalizedType;
  });
};

/**
 * Filter accounts by balance range
 * @param {Array} accounts - Array of account objects
 * @param {Object} balanceFilter - Balance filter { min, max }
 * @returns {Array} - Filtered accounts
 */
export const filterAccountsByBalance = (accounts, balanceFilter) => {
  if (!balanceFilter || (balanceFilter.min === undefined && balanceFilter.max === undefined)) {
    return accounts;
  }
  
  return accounts.filter(account => {
    const balance = account.balance;
    if (typeof balance !== 'number') return false;
    
    if (balanceFilter.min !== undefined && balanceFilter.max !== undefined) {
      return balance >= balanceFilter.min && balance <= balanceFilter.max;
    } else if (balanceFilter.min !== undefined) {
      return balance >= balanceFilter.min;
    } else if (balanceFilter.max !== undefined) {
      return balance <= balanceFilter.max;
    }
    
    return true;
  });
};

/**
 * Apply all account filters
 * @param {Array} accounts - Array of account objects
 * @param {Object} filters - All filters to apply
 * @returns {Array} - Filtered accounts
 */
export const applyAccountFilters = (accounts, filters) => {
  let filteredAccounts = [...accounts];
  
  // Apply type filter if specified
  if (filters.type) {
    filteredAccounts = filterAccountsByType(filteredAccounts, filters.type);
  }
  
  // Apply ledger filter if specified
  if (filters.ledgerId) {
    filteredAccounts = filterData(filteredAccounts, {
      field: 'enriched_ledger.ledger_id',
      value: filters.ledgerId,
      exact: true
    });
  }
  
  // Apply entity filter if specified
  if (filters.entityId) {
    filteredAccounts = filterData(filteredAccounts, {
      field: 'enriched_ledger.r_entity.entity_id',
      value: filters.entityId,
      exact: true
    });
  }
  
  // Apply balance filter if specified
  if (filters.balance) {
    filteredAccounts = filterAccountsByBalance(filteredAccounts, filters.balance);
  }
  
  // Apply any other generic filters
  if (filters.field && filters.value) {
    filteredAccounts = filterData(filteredAccounts, filters);
  }
  
  return filteredAccounts;
};

// Export account filters
export const accountFilters = {
  filterByType: filterAccountsByType,
  filterByBalance: filterAccountsByBalance,
  applyFilters: applyAccountFilters
};