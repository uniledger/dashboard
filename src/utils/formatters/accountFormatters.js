/**
 * Account-specific formatting utilities
 */

/**
 * Format account code for display
 * @param {object|string} accountCode - Account code object or string
 * @returns {string} Formatted account code
 */
export const formatAccountCode = (accountCode) => {
  if (!accountCode) return 'N/A';
  
  // Handle when account_code is a full object
  if (typeof accountCode === 'object') {
    return `${accountCode.account_code} - ${accountCode.name || ''}`;
  }
  
  // Handle when it's just the code value
  return accountCode;
};

/**
 * Get the account type description from an account object
 * @param {object} account - Account object
 * @returns {string} Account type description
 */
export const getAccountType = (account) => {
  if (!account) return 'N/A';
  
  // Try different possible paths to get account type
  if (account.account_type) {
    return account.account_type;
  }
  
  if (account.type) {
    return account.type;
  }
  
  if (account.account_code && account.account_code.type) {
    return account.account_code.type;
  }
  
  if (typeof account.account_code === 'object' && account.account_code.type) {
    return account.account_code.type;
  }
  
  if (account.code && account.code.type) {
    return account.code.type;
  }
  
  return 'Unknown';
};

/**
 * Get a display name for an account
 * @param {object} account - Account object
 * @returns {string} Account display name
 */
export const getAccountDisplayName = (account) => {
  return account.name || 'N/A';
};