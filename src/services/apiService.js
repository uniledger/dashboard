/**
 * API Service for Uniledger Dashboard
 * Centralizes all API calls to maintain consistency and reduce duplication
 */

import { endpoints } from '../config/api';

/**
 * Generic fetch wrapper with error handling
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - The response data
 */
const fetchWithErrorHandling = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json();
            return {
                ok: false,
                status: response.status,
                error: errorData,
            };
        }
        const data = await response.json();
        return {
            ok: true,
            data,
        };
    } catch (error) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            return {
                ok: false,
                error: { message: 'Network error: Could not connect to the API.' },
            };
        }
        return { ok: false, error: { message: error.message } };
    }
};

/**
 * Helper to ensure IDs are properly formatted for API calls
 * @param {string|number|Object} id - The ID to format
 * @returns {string} - Formatted ID
 */
const ensureIdString = (id) => {
  if (id === null || id === undefined) {
    console.error('Invalid ID provided:', id);
    throw new Error('Invalid ID provided');
  }
  
  if (typeof id === 'object') {
    // If we accidentally got passed an object, try to extract the ID
    if (id.ledger_id) return id.ledger_id.toString();
    if (id.entity_id) return id.entity_id.toString();
    if (id.account_id) return id.account_id.toString();
    
    console.error('Object passed instead of ID:', id);
    throw new Error('Invalid object passed instead of ID');
  }
  
  return id.toString();
};

/**
 * Entity-related API calls
 */
const entityApi = {
  /**
   * Get all entities
   * @returns {Promise<Array>} - List of entities
   */
  getEntities: () => 
    fetchWithErrorHandling(endpoints.ledger.entities),
  
  /**
   * Get a specific entity by ID
   * @param {string|number} entityId - Entity ID
   * @returns {Promise<Object>} - Entity data
   */
  getEntityById: (entityId) => 
    fetchWithErrorHandling(endpoints.ledger.entityById(ensureIdString(entityId))),
  
  /**
   * Get all ledgers for a specific entity
   * @param {string|number} entityId - Entity ID
   * @returns {Promise<Array>} - List of ledgers for the entity
   */
  getEntityLedgers: (entityId) => 
    fetchWithErrorHandling(endpoints.ledger.entityLedgers(ensureIdString(entityId))),
  
  /**
   * Get all accounts for a specific entity
   * @param {string|number} entityId - Entity ID
   * @returns {Promise<Array>} - List of accounts for the entity
   */
  getEntityAccounts: (entityId) => 
    fetchWithErrorHandling(endpoints.ledger.entityAccounts(ensureIdString(entityId)))
};

/**
 * Ledger-related API calls
 */
const ledgerApi = {
  /**
   * Get all ledgers
   * @returns {Promise<Array>} - List of ledgers
   */
  getLedgers: () => 
    fetchWithErrorHandling(endpoints.ledger.ledgers),
  
  /**
   * Get a specific ledger by ID
   * @param {string|number} ledgerId - Ledger ID
   * @returns {Promise<Object>} - Ledger data
   */
  getLedgerById: (ledgerId) => 
    fetchWithErrorHandling(endpoints.ledger.ledgerById(ensureIdString(ledgerId))),
  
  /**
   * Get all accounts for a specific ledger
   * @param {string|number} ledgerId - Ledger ID
   * @returns {Promise<Array>} - List of accounts for the ledger
   */
  getLedgerAccounts: (ledgerId) => 
    fetchWithErrorHandling(endpoints.ledger.ledgerAccounts(ensureIdString(ledgerId)))
};

/**
 * Account-related API calls
 */
const accountApi = {
  /**
   * Get all accounts
   * @returns {Promise<Array>} - List of accounts
   */
  getAccounts: () => 
    fetchWithErrorHandling(endpoints.ledger.accounts),
  
  /**
   * Get a specific account by ID
   * @param {string|number} accountId - Account ID
   * @returns {Promise<Object>} - Account data
   */
  getAccountById: (accountId) => 
    fetchWithErrorHandling(endpoints.ledger.accountById(ensureIdString(accountId)))
};

/**
 * Reference data API calls
 */
const referenceApi = {
  /**
   * Get all currencies
   * @returns {Promise<Array>} - List of currencies
   */
  getCurrencies: () => 
    fetchWithErrorHandling(endpoints.ledger.currencies),
  
  /**
   * Get all countries
   * @returns {Promise<Array>} - List of countries
   */
  getCountries: () => 
    fetchWithErrorHandling(endpoints.ledger.countries),
  
  /**
   * Get all account codes
   * @returns {Promise<Array>} - List of account codes
   */
  getAccountCodes: () => 
    fetchWithErrorHandling(endpoints.ledger.accountCodes)
};

/**
 * Transaction-related API calls
 */
const transactionApi = {
  /**
   * Get all templates
   * @returns {Promise<Array>} - List of templates
   */
  getTemplates: () => 
    fetchWithErrorHandling(endpoints.transaction.templates),
  
  /**
   * Get all processed events
   * @returns {Promise<Array>} - List of processed events
   */
  getProcessedEvents: () => 
    fetchWithErrorHandling(endpoints.transaction.processedEvents),
  
  /**
   * Get all rules
   * @returns {Promise<Array>} - List of rules
   */
  getRules: () => 
    fetchWithErrorHandling(endpoints.transaction.rules),
  
  /**
   * Submit an event based on a template
   * @param {Object} eventData - Event data
   * @returns {Promise<Object>} - Response with status and transfer information
   */
  submitEvent: (eventData) => {
    return fetchWithErrorHandling(endpoints.transaction.submitEvent, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
  }
};

// Export all API services
const apiService = {
  entity: entityApi,
  ledger: ledgerApi,
  account: accountApi,
  reference: referenceApi,
  transaction: transactionApi,
};

export default apiService;