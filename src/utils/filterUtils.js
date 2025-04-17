/**
 * This file is maintained for backwards compatibility.
 * Please use the modular filterUtils directory for new code.
 */

import filterUtilsImport, {
  filterData,
  searchData,
  getSearchFields,
  filterByModelType,
  accountFilters,
  entityFilters,
  ledgerFilters
} from './filterUtils/index';

// Re-export the filterAccountsByType function directly
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

// Create a filterUtils object with all the functions
export const filterUtils = {
  filterData,
  searchData,
  getSearchFields,
  filterByModelType,
  filterAccountsByType, // Add this directly to filterUtils
  ...accountFilters,
  ...entityFilters,
  ...ledgerFilters
};

// Export default for direct imports
export default {
  ...filterUtilsImport,
  filterAccountsByType
};