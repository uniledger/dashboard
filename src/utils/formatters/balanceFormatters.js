/**
 * Balance and currency formatting utilities
 */

/**
 * Format any number value to always show 2 decimal places
 * @param {number} value - The numeric value to format
 * @returns {string} - Formatted number with 2 decimal places and commas
 */
export const formatNumber = (value) => {
  if (typeof value !== 'number') return 'N/A';
  
  // Always format with 2 decimal places
  const formattedValue = value.toFixed(2);
  
  // Add commas as thousands separators
  const formattedWithCommas = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  // Handle negative numbers with parentheses
  if (value < 0) {
    return `(${formattedWithCommas.replace('-', '')})`;
  } else {
    return formattedWithCommas;
  }
};

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
  let scale = 2; // Default scale
  
  if (currency) {
    if (typeof currency.scale === 'number') {
      scale = currency.scale;
    } else if (currency.r_currency && typeof currency.r_currency.scale === 'number') {
      scale = currency.r_currency.scale;
    }
  }
  
  // Convert to decimal value
  const decimalValue = balance / Math.pow(10, scale);
  
  // Always format with 2 decimal places, regardless of the showDecimal parameter
  // Even for whole numbers, we want to show ".00"
  const formattedValue = decimalValue.toFixed(2);
  
  // Add commas as thousands separators
  const formattedWithCommas = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  // Handle negative numbers with parentheses
  let result;
  if (decimalValue < 0) {
    // Remove minus sign and add parentheses
    result = `${currencySymbol}(${formattedWithCommas.replace('-', '')})`;
  } else {
    result = `${currencySymbol}${formattedWithCommas}`;
  }
  
  // For use in AG Grid, add <span> with inline style to force right alignment
  return result;
};

/**
 * Get CSS class for balance display
 * @param {number} balance - The balance value
 * @returns {string} - CSS class name for balance display
 */
export const getBalanceClass = (balance) => {
  if (typeof balance !== 'number') return 'text-right font-medium';
  return balance < 0 ? 'text-red-600 text-right font-medium' : 'text-gray-900 text-right font-medium';
};

/**
 * Get currency info from an account or ledger
 * @param {object} item - Account or ledger object
 * @returns {object|null} - Currency object or null if not found
 */
export const getCurrencyInfo = (item) => {
  if (!item) return null;
  
  // Try to find currency in various locations
  if (item.r_currency) {
    return item.r_currency;
  }
  
  if (item.currency) {
    return item.currency;
  }
  
  if (item.enriched_ledger && item.enriched_ledger.r_currency) {
    return item.enriched_ledger.r_currency;
  }
  
  if (item.ledger && item.ledger.r_currency) {
    return item.ledger.r_currency;
  }
  
  // Return a simple object with the currency code if available
  if (item.currency_code) {
    return { currency_code: item.currency_code, scale: 2 };
  }
  
  return null;
};