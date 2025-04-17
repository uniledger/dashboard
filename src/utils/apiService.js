/**
 * API Service for handling backend API calls
 * DEPRECATED: This file is kept for backwards compatibility.
 * Please use the centralized apiService from '../services/apiService' instead.
 */

import apiService from '../services/apiService';

/**
 * Fetch all currencies from the API
 * @returns {Promise<Array>} List of currencies
 */
export const fetchCurrencies = async () => {
  return apiService.reference.getCurrencies();
};

/**
 * Fetch all countries from the API
 * @returns {Promise<Array>} List of countries
 */
export const fetchCountries = async () => {
  return apiService.reference.getCountries();
};

/**
 * Fetch all account codes from the API
 * @returns {Promise<Array>} List of account codes
 */
export const fetchAccountCodes = async () => {
  return apiService.reference.getAccountCodes();
};

// Export default for legacy imports
export default {
  fetchCurrencies,
  fetchCountries,
  fetchAccountCodes
};