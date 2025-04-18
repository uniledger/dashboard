import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

/**
 * Custom hook for managing reference data (currencies, countries, account codes)
 * @returns {Object} - Reference data and helper functions
 */
const useReferenceData = () => {
  // State for reference data
  const [currencies, setCurrencies] = useState([]);
  const [countries, setCountries] = useState([]);
  const [accountCodes, setAccountCodes] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState({
    currencies: false,
    countries: false,
    accountCodes: false
  });
  const [error, setError] = useState(null);

  /**
   * Fetch currencies
   */
  const fetchCurrencies = useCallback(async () => {
    setLoading(prev => ({ ...prev, currencies: true }));
    setError(null);
    
    try {
      const response = await apiService.reference.getCurrencies();
      console.log('Currencies response:', response);
      
      // Extract data from the response object
      const data = response.ok && response.data ? response.data : [];
      setCurrencies(data);
      setLoading(prev => ({ ...prev, currencies: false }));
      return data;
    } catch (err) {
      console.error('Error fetching currencies:', err);
      setError(err.message || 'An error occurred while fetching currencies');
      setLoading(prev => ({ ...prev, currencies: false }));
      return [];
    }
  }, []);

  /**
   * Fetch countries
   */
  const fetchCountries = useCallback(async () => {
    setLoading(prev => ({ ...prev, countries: true }));
    setError(null);
    
    try {
      const response = await apiService.reference.getCountries();
      console.log('Countries response:', response);
      
      // Extract data from the response object
      const data = response.ok && response.data ? response.data : [];
      setCountries(data);
      setLoading(prev => ({ ...prev, countries: false }));
      return data;
    } catch (err) {
      console.error('Error fetching countries:', err);
      setError(err.message || 'An error occurred while fetching countries');
      setLoading(prev => ({ ...prev, countries: false }));
      return [];
    }
  }, []);

  /**
   * Fetch account codes
   */
  const fetchAccountCodes = useCallback(async () => {
    setLoading(prev => ({ ...prev, accountCodes: true }));
    setError(null);
    
    try {
      const response = await apiService.reference.getAccountCodes();
      console.log('Account Codes response:', response);
      
      // Extract data from the response object
      const data = response.ok && response.data ? response.data : [];
      setAccountCodes(data);
      setLoading(prev => ({ ...prev, accountCodes: false }));
      return data;
    } catch (err) {
      console.error('Error fetching account codes:', err);
      setError(err.message || 'An error occurred while fetching account codes');
      setLoading(prev => ({ ...prev, accountCodes: false }));
      return [];
    }
  }, []);

  /**
   * Check if any resource is currently loading
   */
  const isAnyLoading = loading.currencies || loading.countries || loading.accountCodes;

  return {
    // Data
    currencies,
    countries,
    accountCodes,
    loading,
    isAnyLoading,
    error,
    
    // Actions
    fetchCurrencies,
    fetchCountries,
    fetchAccountCodes
  };
};

export default useReferenceData;