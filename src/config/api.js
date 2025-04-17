/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

// Base URLs for the different APIs
export const LEDGER_API_BASE_URL = 'https://ledger.dev.ledgerrocket.com';
export const TRANSACTIONS_API_BASE_URL = 'https://transactions.dev.ledgerrocket.com';

// API Endpoints
export const endpoints = {
  // Ledger API endpoints
  ledger: {
    entities: `${LEDGER_API_BASE_URL}/api/v1/enriched-entities/`,
    entityById: (id) => `${LEDGER_API_BASE_URL}/api/v1/enriched-entities/${id}`,
    entityLedgers: (id) => `${LEDGER_API_BASE_URL}/api/v1/enriched-ledgers/?entity_id=${id}`,
    entityAccounts: (id) => `${LEDGER_API_BASE_URL}/api/v1/entities/${id}/enriched-accounts/`,
    
    ledgers: `${LEDGER_API_BASE_URL}/api/v1/enriched-ledgers/`,
    ledgerById: (id) => `${LEDGER_API_BASE_URL}/api/v1/enriched-ledgers/${id}`,
    ledgerAccounts: (id) => `${LEDGER_API_BASE_URL}/api/v1/ledgers/${id}/enriched-accounts/`,
    
    accounts: `${LEDGER_API_BASE_URL}/api/v1/enriched-accounts/`,
    accountById: (id) => `${LEDGER_API_BASE_URL}/api/v1/enriched-accounts/${id}`,
    
    currencies: `${LEDGER_API_BASE_URL}/api/v1/currencies/`,
    countries: `${LEDGER_API_BASE_URL}/api/v1/countries/`,
    accountCodes: `${LEDGER_API_BASE_URL}/api/v1/account-codes/`
  },
  
  // Transactions API endpoints
  transaction: {
    templates: `${TRANSACTIONS_API_BASE_URL}/api/v1/templates/`,
    processedEvents: `${TRANSACTIONS_API_BASE_URL}/api/v1/processed-events/`,
    rules: `${TRANSACTIONS_API_BASE_URL}/api/v1/rules/`,
    submitEvent: `${TRANSACTIONS_API_BASE_URL}/api/v1/events/`
  }
};

export default {
  LEDGER_API_BASE_URL,
  TRANSACTIONS_API_BASE_URL,
  endpoints
};