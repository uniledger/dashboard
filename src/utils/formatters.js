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
 * Get CSS class for balance display
 * @param {number} balance - The balance value
 * @returns {string} - CSS class name for balance display
 */
export const getBalanceClass = (balance) => {
  if (typeof balance !== 'number') return '';
  return balance < 0 ? 'text-red-600 text-right font-medium' : 'text-gray-900 text-right font-medium';
};

/**
 * Get a readable display of country information
 * @param {object} item - The item (entity, ledger) with country info
 * @param {object} entity - Optional entity context for ledgers
 * @returns {string} Formatted country display
 */
export const getCountryDisplay = (item, entity) => {
  if (!item) return 'N/A';
  
  // Format function for country objects
  const formatCountryObj = (country) => {
    if (country && country.name && country.country_code) {
      return `${country.name} (${country.country_code})`;
    }
    return null;
  };
  
  // First check if r_entity has country info
  if (item.r_entity && item.r_entity.r_country) {
    return formatCountryObj(item.r_entity.r_country) || 'N/A';
  }
  
  // Check for direct r_country attribute
  if (item.r_country) {
    return formatCountryObj(item.r_country) || 'N/A';
  }
  
  // Check if it's a ledger that belongs to an entity with a country
  if (entity && entity.r_country) {
    return formatCountryObj(entity.r_country) || 'N/A';
  }
  
  // Check entity fields
  if (item.entity && item.entity.r_country) {
    return formatCountryObj(item.entity.r_country) || 'N/A';
  }
  
  // For ledgers with country_code 'NA', use the entity's country
  if (item.country_code === 'NA' && entity && entity.r_country) {
    return formatCountryObj(entity.r_country) || entity.country_code || 'N/A';
  }
  
  // Try to find country by traversing various paths in the object
  const paths = [
    'enriched_entity.r_country',
    'enriched_ledger.r_entity.r_country',
    'enriched_ledger.r_country',
    'r_entity.r_country'
  ];
  
  for (const path of paths) {
    const parts = path.split('.');
    let obj = item;
    let valid = true;
    
    for (const part of parts) {
      if (!obj || !obj[part]) {
        valid = false;
        break;
      }
      obj = obj[part];
    }
    
    if (valid && obj.name && obj.country_code) {
      return formatCountryObj(obj) || 'N/A';
    }
  }
  
  // Return country code if available
  if (item.country_code && item.country_code !== 'NA') {
    return item.country_code;
  }
  
  // Return any country field
  if (item.country) {
    return item.country;
  }
  
  // Try entity property if available
  if (item.r_entity?.country_code && item.r_entity.country_code !== 'NA') {
    return item.r_entity.country_code;
  }
  
  if (item.entity?.country_code && item.entity.country_code !== 'NA') {
    return item.entity.country_code;
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

/**
 * Format a date for display
 * @param {number|string|Date} timestamp - The timestamp or date to format
 * @param {boolean} includeTime - Whether to include the time in the formatted date
 * @returns {string} Formatted date string
 */
export const formatDate = (timestamp, includeTime = false) => {
  if (!timestamp) return 'N/A';
  
  let date;
  
  // Handle Unix timestamps (seconds since epoch)
  if (typeof timestamp === 'number') {
    // Check if it's in seconds (10 digits) or milliseconds (13 digits)
    if (timestamp < 10000000000) {
      // Convert from seconds to milliseconds
      date = new Date(timestamp * 1000);
    } else {
      date = new Date(timestamp);
    }
  } else if (typeof timestamp === 'string') {
    // Try to parse as ISO date or Unix timestamp
    if (!isNaN(Number(timestamp))) {
      const num = Number(timestamp);
      if (num < 10000000000) {
        date = new Date(num * 1000);
      } else {
        date = new Date(num);
      }
    } else {
      date = new Date(timestamp);
    }
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    return 'N/A';
  }
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'N/A';
  }
  
  // Format the date
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
  }
  
  return date.toLocaleString('en-US', options);
};

/**
 * Get a display name for an account
 * @param {object} account - Account object
 * @returns {string} Account display name
 */
export const getAccountDisplayName = (account) => {
  return account.name || 'N/A';
};