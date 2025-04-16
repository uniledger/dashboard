/**
 * API Service for Uniledger Dashboard
 * Centralizes all API calls to maintain consistency and reduce duplication
 */

// Base URLs for the different APIs
const LEDGER_API_BASE_URL = 'https://ledger.dev.ledgerrocket.com';
const TRANSACTIONS_API_BASE_URL = 'https://transactions.dev.ledgerrocket.com';

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
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
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
    fetchWithErrorHandling(`${LEDGER_API_BASE_URL}/api/v1/enriched-entities/`),
  
  /**
   * Get a specific entity by ID
   * @param {string|number} entityId - Entity ID
   * @returns {Promise<Object>} - Entity data
   */
  getEntityById: (entityId) => 
    fetchWithErrorHandling(`${LEDGER_API_BASE_URL}/api/v1/enriched-entities/${entityId}`),
  
  /**
   * Get all ledgers for a specific entity
   * @param {string|number} entityId - Entity ID
   * @returns {Promise<Array>} - List of ledgers for the entity
   */
  getEntityLedgers: (entityId) => 
    fetchWithErrorHandling(`${LEDGER_API_BASE_URL}/api/v1/enriched-ledgers/?entity_id=${entityId}`),
  
  /**
   * Get all accounts for a specific entity
   * @param {string|number} entityId - Entity ID
   * @returns {Promise<Array>} - List of accounts for the entity
   */
  getEntityAccounts: (entityId) => 
    fetchWithErrorHandling(`${LEDGER_API_BASE_URL}/api/v1/entities/${entityId}/enriched-accounts/`)
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
    fetchWithErrorHandling(`${LEDGER_API_BASE_URL}/api/v1/enriched-ledgers/`),
  
  /**
   * Get a specific ledger by ID
   * @param {string|number} ledgerId - Ledger ID
   * @returns {Promise<Object>} - Ledger data
   */
  getLedgerById: (ledgerId) => 
    fetchWithErrorHandling(`${LEDGER_API_BASE_URL}/api/v1/enriched-ledgers/${ledgerId}`),
  
  /**
   * Get all accounts for a specific ledger
   * @param {string|number} ledgerId - Ledger ID
   * @returns {Promise<Array>} - List of accounts for the ledger
   */
  getLedgerAccounts: (ledgerId) => 
    fetchWithErrorHandling(`${LEDGER_API_BASE_URL}/api/v1/ledgers/${ledgerId}/enriched-accounts/`)
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
    fetchWithErrorHandling(`${LEDGER_API_BASE_URL}/api/v1/enriched-accounts/`),
  
  /**
   * Get a specific account by ID
   * @param {string|number} accountId - Account ID
   * @returns {Promise<Object>} - Account data
   */
  getAccountById: (accountId) => 
    fetchWithErrorHandling(`${LEDGER_API_BASE_URL}/api/v1/enriched-accounts/${accountId}`)
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
    fetchWithErrorHandling(`${LEDGER_API_BASE_URL}/api/v1/currencies/`),
  
  /**
   * Get all countries
   * @returns {Promise<Array>} - List of countries
   */
  getCountries: () => 
    fetchWithErrorHandling(`${LEDGER_API_BASE_URL}/api/v1/countries/`),
  
  /**
   * Get all account codes
   * @returns {Promise<Array>} - List of account codes
   */
  getAccountCodes: () => 
    fetchWithErrorHandling(`${LEDGER_API_BASE_URL}/api/v1/account-codes/`)
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
    fetchWithErrorHandling(`${TRANSACTIONS_API_BASE_URL}/api/v1/templates/`),
  
  /**
   * Get all processed events
   * @returns {Promise<Array>} - List of processed events
   */
  getProcessedEvents: () => 
    fetchWithErrorHandling(`${TRANSACTIONS_API_BASE_URL}/api/v1/processed-events/`),
  
  /**
   * Submit an event based on a template
   * @param {Object} eventData - Event data
   * @returns {Promise<Object>} - Response with status and transfer information
   */
  submitEvent: (eventData) => 
    fetchWithErrorHandling(`${TRANSACTIONS_API_BASE_URL}/api/v1/events/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
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