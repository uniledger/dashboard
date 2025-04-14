/**
 * API Service for handling backend API calls
 */

const API_BASE_URL = 'https://ledger.dev.ledgerrocket.com';

/**
 * Fetch all currencies from the API
 * @returns {Promise<Array>} List of currencies
 */
export const fetchCurrencies = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/currencies/`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching currencies:', error);
    throw error;
  }
};

/**
 * Fetch all countries from the API
 * @returns {Promise<Array>} List of countries
 */
export const fetchCountries = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/countries/`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

/**
 * Fetch all account codes from the API
 * @returns {Promise<Array>} List of account codes
 */
export const fetchAccountCodes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/account-codes/`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching account codes:', error);
    throw error;
  }
};
