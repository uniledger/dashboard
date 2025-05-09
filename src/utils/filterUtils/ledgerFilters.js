/**
 * Ledger-specific filtering logic
 */
import { filterData } from './index';

/**
 * Filters ledgers by entity.
 *
 * Returns only ledgers that match the given entity ID. Checks r_entity.entity_id, entity.entity_id, and entity_id fields for compatibility with different ledger object shapes.
 *
 * @param {Array} ledgers - Array of ledger objects.
 * @param {string|number} entityId - Entity ID to filter by.
 * @returns {Array} Filtered ledgers.
 */
export const filterLedgersByEntity = (ledgers, entityId) => {
  if (!entityId) {
    return ledgers;
  }
  
  const idStr = entityId.toString();
  
  return ledgers.filter(ledger => {
    // Check r_entity.entity_id
    if (ledger.r_entity && ledger.r_entity.entity_id) {
      return ledger.r_entity.entity_id.toString() === idStr;
    }
    
    // Check entity.entity_id
    if (ledger.entity && ledger.entity.entity_id) {
      return ledger.entity.entity_id.toString() === idStr;
    }
    
    // Check entity_id directly
    if (ledger.entity_id) {
      return ledger.entity_id.toString() === idStr;
    }
    
    return false;
  });
};

/**
 * Filters ledgers by currency.
 *
 * Returns only ledgers that match the given currency code. Checks both r_currency.currency_code and currency_code fields for compatibility with different ledger object shapes.
 *
 * @param {Array} ledgers - Array of ledger objects.
 * @param {string} currencyCode - Currency code to filter by.
 * @returns {Array} Filtered ledgers.
 */
export const filterLedgersByCurrency = (ledgers, currencyCode) => {
  if (!currencyCode) {
    return ledgers;
  }
  
  const normalizedCode = currencyCode.toUpperCase();
  
  return ledgers.filter(ledger => {
    // Check r_currency.currency_code
    if (ledger.r_currency && ledger.r_currency.currency_code) {
      return ledger.r_currency.currency_code.toUpperCase() === normalizedCode;
    }
    
    // Check currency_code directly
    if (ledger.currency_code) {
      return ledger.currency_code.toUpperCase() === normalizedCode;
    }
    
    return false;
  });
};

/**
 * Applies all ledger filters.
 *
 * Sequentially applies entity, currency, country, and generic filters to the ledgers array. Uses helper filter functions as needed.
 *
 * @param {Array} ledgers - Array of ledger objects.
 * @param {Object} filters - All filters to apply.
 * @returns {Array} Filtered ledgers.
 */
export const applyLedgerFilters = (ledgers, filters) => {
  let filteredLedgers = [...ledgers];
  
  // Apply entity filter if specified
  if (filters.entityId) {
    filteredLedgers = filterLedgersByEntity(filteredLedgers, filters.entityId);
  }
  
  // Apply currency filter if specified
  if (filters.currencyCode) {
    filteredLedgers = filterLedgersByCurrency(filteredLedgers, filters.currencyCode);
  }
  
  // Apply country filter if specified
  if (filters.countryCode) {
    filteredLedgers = filterData(filteredLedgers, {
      field: 'r_country.country_code',
      value: filters.countryCode,
      exact: true
    });
  }
  
  // Apply any other generic filters
  if (filters.field && filters.value) {
    filteredLedgers = filterData(filteredLedgers, filters);
  }
  
  return filteredLedgers;
};

// Export ledger filters
export const ledgerFilters = {
  filterByEntity: filterLedgersByEntity,
  filterByCurrency: filterLedgersByCurrency,
  applyFilters: applyLedgerFilters
};