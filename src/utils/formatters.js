/**
 * Utility functions for consistent data formatting across the dashboard
 */

/**
 * Format account balance using correct scale from currency
 * @param {number} balance - The raw balance value (integer)
 * @param {object} currency - Currency object with scale information
 * @param {boolean} showDecimal - Whether to show the decimal places
 * @param {string} currencySymbol - Optional currency symbol to prepend
 * @returns {string} Formatted balance value
 */
export const formatBalance = (balance, currency, showDecimal = true, currencySymbol = '') => {
  if (typeof balance !== 'number') return 'N/A';
  
  // Get the scale (decimal places) from the currency
  const scale = (currency && currency.scale) || 2;
  
  // Convert to decimal value
  const decimalValue = balance / Math.pow(10, scale);
  
  // Format with correct number of decimal places
  let formattedValue;
  if (showDecimal) {
    // Fixed decimal places
    formattedValue = decimalValue.toFixed(scale);
  } else {
    // Just round to whole number
    formattedValue = Math.round(decimalValue).toString();
  }
  
  // Add commas as thousands separators
  formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  // Handle negative numbers with parentheses
  if (decimalValue < 0) {
    // Remove minus sign and add parentheses
    return `${currencySymbol}(${formattedValue.replace('-', '')})`;
  } else {
    return `${currencySymbol}${formattedValue}`;
  }
};

/**
 * Get a readable display of country information
 * @param {object} item - The item (entity, ledger) with country info
 * @returns {string} Formatted country display
 */
export const getCountryDisplay = (item) => {
  if (!item) return 'N/A';
  
  // Handle when r_country is available
  if (item.r_country) {
    return `${item.r_country.name} (${item.r_country.country_code})`;
  }
  
  // Try various country code formats
  if (item.country_code) {
    return item.country_code;
  }
  
  if (item.country) {
    return item.country;
  }
  
  // Try entity property if available
  if (item.r_entity?.country_code) {
    return item.r_entity.country_code;
  }
  
  if (item.entity?.country_code) {
    return item.entity.country_code;
  }
  
  // Extra check for any property containing country info
  for (const key in item) {
    if (key.toLowerCase().includes('country') && item[key]) {
      return item[key];
    }
  }
  
  return 'N/A';
};

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
