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
    console.log(`%c 🌐 API Request: ${options.method || 'GET'} ${url}`, 'background: #ddd; color: #0066cc; font-weight: bold; padding: 3px 5px; border-radius: 3px;');
    
    try {
        // Log that we're making a network request
        console.log(`%c 🔄 Fetching: ${url}`, 'color: #6b7280;');
        
        const response = await fetch(url, options);
        console.log(`%c ✅ API Response: ${url} - Status: ${response.status}`, 'background: #e6ffe6; color: #008800; font-weight: bold; padding: 3px 5px; border-radius: 3px;');

        if (!response.ok) {
            const errorData = await response.json().catch(e => ({ message: 'Invalid JSON in error response' }));
            console.error(`%c ❌ API Error: ${url}`, 'background: #ffe6e6; color: #cc0000; font-weight: bold; padding: 3px 5px; border-radius: 3px;', errorData);
            return {
                ok: false,
                status: response.status,
                error: errorData,
            };
        }
        
        try {
            const data = await response.json();
            console.log(`%c 📦 API Success: ${url}`, 'background: #e6ffe6; color: #008800; font-weight: bold; padding: 3px 5px; border-radius: 3px;', data);
            return {
                ok: true,
                data,
            };
        } catch (jsonError) {
            console.error(`%c ❌ JSON Parse Error: ${url}`, 'background: #ffe6e6; color: #cc0000; font-weight: bold; padding: 3px 5px; border-radius: 3px;', jsonError);
            return {
                ok: false,
                error: { message: 'Invalid JSON response from server' },
            };
        }
    } catch (error) {
        console.error(`%c ❌ API Exception: ${url}`, 'background: #ffe6e6; color: #cc0000; font-weight: bold; padding: 3px 5px; border-radius: 3px;', error);
        
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            return {
                ok: false,
                error: { message: 'Network error: Could not connect to the API.' },
            };
        }
        
        return { 
            ok: false, 
            error: { message: error.message } 
        };
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
    fetchWithErrorHandling(endpoints.ledger.accountById(ensureIdString(accountId))),
    
  /**
   * Get transfers for a specific account
   * @param {string|number} accountId - Account ID
   * @param {number} limit - Maximum number of transfers to fetch (default: 100)
   * @returns {Promise<Array>} - List of account transfers
   */
  getAccountTransfers: (accountId, limit = 100) => 
    fetchWithErrorHandling(endpoints.ledger.accountTransfers(ensureIdString(accountId), limit))
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
  getAccountCodes: async () => {
    const response = await fetchWithErrorHandling(endpoints.ledger.accountCodes);
    if (response.ok && response.data) {
      return response;
    }
    return response;
  }
};

/**
 * Transaction-related API calls
 */
const transactionApi = {
  /**
   * Get all templates
   * @returns {Promise<Array>} - List of templates
   */
  getTemplates: async () => {
    const response = await fetchWithErrorHandling(endpoints.transaction.templates);
    if (response.ok && response.data) {
      // API returns { templates: [...] }
      if (Array.isArray(response.data.templates)) {
        return { ...response, data: response.data.templates };
      }
      // fallback: if data itself is array
      if (Array.isArray(response.data)) {
        return response;
      }
    }
    return response;
  },
  
  /**
   * Get all processed events
   * @returns {Promise<Object>} - Response with ok flag and data array
   */
  getProcessedEvents: async () => {
    const response = await fetchWithErrorHandling(endpoints.transaction.processedEvents);
    if (response.ok && response.data) {
      // Unwrap array from response envelope if needed
      // Check for direct array
      if (Array.isArray(response.data)) {
        return response;
      }
      // Check for processed_events key
      if (Array.isArray(response.data.processed_events)) {
        return { ...response, data: response.data.processed_events };
      }
      // Check for processed key
      if (Array.isArray(response.data.processed)) {
        return { ...response, data: response.data.processed };
      }
      // Check for results key (pagination)
      if (Array.isArray(response.data.results)) {
        return { ...response, data: response.data.results };
      }
      // Fallback: find any array in the response
      const arrKey = Object.keys(response.data).find(key => Array.isArray(response.data[key]));
      if (arrKey) {
        return { ...response, data: response.data[arrKey] };
      }
    }
    return response;
  },
  
  /**
   * Get a single processed event by ID
   * @param {string|number} eventId - Processed event ID
   * @returns {Promise<Object>} - Response with event data including transfers
   */
  getProcessedEventById: async (eventId) => {
    const response = await fetchWithErrorHandling(
      endpoints.transaction.processedEventById(ensureIdString(eventId))
    );
    return response;
  },
  
  /**
   * Get all rules
   * @returns {Promise<Array>} - List of rules
   */
  getRules: async () => {
    const response = await fetchWithErrorHandling(endpoints.transaction.rules);
    if (response.ok && response.data) {
      // API returns { rules: [...] }
      if (Array.isArray(response.data.rules)) {
        return { ...response, data: response.data.rules };
      }
      // fallback: if data itself is array
      if (Array.isArray(response.data)) {
        return response;
      }
    }
    return response;
  },
  
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

/**
 * Transfer-related API calls
 */
const transferApi = {
  /**
   * Get all transfers (default: first 100)
   * @param {number} limit - Maximum number of transfers to fetch (default: 100)
   * @returns {Promise<Array>} - List of transfers
   */
  getTransfers: (limit = 100) => 
    fetchWithErrorHandling(`${endpoints.ledger.transfers}?limit=${limit}`),
  
  /**
   * Get a specific transfer by ID
   * @param {string|number} transferId - Transfer ID
   * @returns {Promise<Object>} - Transfer data
   */
  getTransferById: (transferId) => 
    fetchWithErrorHandling(endpoints.ledger.transferById(ensureIdString(transferId)))
};

// Export all API services
const apiService = {
  entity: entityApi,
  ledger: ledgerApi,
  account: accountApi,
  reference: referenceApi,
  transaction: transactionApi,
  transfer: transferApi
};

export default apiService;