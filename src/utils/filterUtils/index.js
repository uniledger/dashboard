/**
 * Enhanced filtering utilities with centralized filtering logic
 */

import { accountFilters } from './accountFilters';
import { entityFilters } from './entityFilters';
import { ledgerFilters } from './ledgerFilters';

/**
 * Filters data by any field and value.
 *
 * Generic filter function that supports filtering by nested fields (dot notation), exact or partial matches, and type coercion for string/number comparisons.
 *
 * @param {Array} data - The data array to filter.
 * @param {Object} filter - Filter configuration { field, value, exact }.
 * @returns {Array} Filtered data array.
 */
export const filterData = (data, filter) => {
  if (!filter || !filter.field || filter.value === undefined || filter.value === null) {
    return data;
  }

  return data.filter(item => {
    // Get the value from the item, supporting nested fields with dot notation
    const fields = filter.field.split('.');
    let itemValue = item;
    
    for (const field of fields) {
      if (itemValue === null || itemValue === undefined) {
        return false;
      }
      itemValue = itemValue[field];
    }

    // Handle exact matching vs. includes matching
    if (filter.exact) {
      // Exact matching (case insensitive for strings)
      if (typeof itemValue === 'string' && typeof filter.value === 'string') {
        return itemValue.toLowerCase() === filter.value.toLowerCase();
      }
      return itemValue === filter.value;
    } else {
      // Includes matching
      if (typeof itemValue === 'string' && typeof filter.value === 'string') {
        return itemValue.toLowerCase().includes(filter.value.toLowerCase());
      } else if (itemValue !== null && itemValue !== undefined) {
        // For non-string values, convert to string and check includes
        return itemValue.toString().includes(filter.value.toString());
      }
      return false;
    }
  });
};

/**
 * Searches through an array of objects for matching text.
 *
 * Performs a case-insensitive search for the query string in all string and number fields, or a specified subset of fields.
 *
 * @param {Array} data - The data array to search.
 * @param {string} searchQuery - The search query.
 * @param {Array} searchFields - Optional array of specific fields to search (defaults to all fields).
 * @returns {Array} Filtered data array.
 */
export const searchData = (data, searchQuery, searchFields = null) => {
  if (!searchQuery) {
    return data;
  }

  const normalizedQuery = searchQuery.toLowerCase();

  return data.filter(item => {
    // If searchFields is provided, only search those fields
    if (searchFields && searchFields.length > 0) {
      return searchFields.some(field => {
        const fieldParts = field.split('.');
        let value = item;
        
        // Handle nested fields
        for (const part of fieldParts) {
          if (!value || typeof value !== 'object') return false;
          value = value[part];
        }
        
        if (typeof value === 'string') {
          return value.toLowerCase().includes(normalizedQuery);
        } else if (typeof value === 'number') {
          return value.toString().includes(normalizedQuery);
        }
        return false;
      });
    }
    
    // Otherwise, search all string and number properties (first level only)
    return Object.entries(item).some(([_, value]) => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(normalizedQuery);
      } else if (typeof value === 'number') {
        return value.toString().includes(normalizedQuery);
      }
      return false;
    });
  });
};

/**
 * Gets common search fields for a model type.
 *
 * Returns an array of field names that are commonly used for searching the specified model type.
 *
 * @param {string} modelType - Type of model ('entity', 'ledger', 'account', etc.).
 * @returns {Array} Array of field names to search.
 */
export const getSearchFields = (modelType) => {
  const searchFieldsMap = {
    entity: ['name', 'entity_id', 'type', 'country_code', 'description'],
    ledger: ['name', 'ledger_id', 'r_entity.name', 'country_code', 'description'],
    account: ['name', 'account_id', 'account_code', 'account_type', 'description'],
    template: ['name', 'template_id', 'product', 'description'],
    processedEvent: ['processed_event_id', 'status', 'description', 'template.name'],
    rule: ['name', 'rule_id', 'type', 'status', 'description']
  };
  
  return searchFieldsMap[modelType] || [];
};

/**
 * Filters data using the appropriate model-specific filter.
 *
 * Delegates filtering to the correct filter function based on model type ('entity', 'ledger', 'account', etc.). Falls back to generic filtering if type is unknown.
 *
 * @param {Array} data - The data array to filter.
 * @param {Object} filter - Filter configuration object.
 * @param {string} modelType - Type of model ('entity', 'ledger', 'account', etc.).
 * @returns {Array} Filtered data array.
 */
export const filterByModelType = (data, filter, modelType) => {
  if (!filter || !modelType) {
    return data;
  }
  
  switch (modelType) {
    case 'account':
      return accountFilters.applyFilters(data, filter);
    case 'entity':
      return entityFilters.applyFilters(data, filter);
    case 'ledger':
      return ledgerFilters.applyFilters(data, filter);
    default:
      // Fall back to generic filtering
      return filterData(data, filter);
  }
};

// Export account filters from accountFilters.js
export { accountFilters } from './accountFilters';

// Export entity filters from entityFilters.js
export { entityFilters } from './entityFilters';

// Export ledger filters from ledgerFilters.js
export { ledgerFilters } from './ledgerFilters';

// Export all filter utilities
const filterUtils = {
  filterData,
  searchData,
  getSearchFields,
  filterByModelType,
  accountFilters,
  entityFilters,
  ledgerFilters
};

export default filterUtils;