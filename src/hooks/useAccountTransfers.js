import { useState, useCallback } from 'react';
import apiService from '../services/apiService';

/**
 * Custom hook for fetching and managing account transfers
 * @returns {Object} - Account transfers data and helper functions
 */
const useAccountTransfers = () => {
  // Transfers state - initialize with empty array
  const [accountTransfers, setAccountTransfers] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch transfers for a specific account
   * @param {string|number} accountId - Account ID to fetch transfers for
   * @param {number} limit - Maximum number of transfers to fetch (default: 100)
   */
  const fetchAccountTransfers = useCallback(async (accountId, limit = 100) => {
    if (!accountId) return;
    
    console.log(`Fetching transfers for account: ${accountId} with limit: ${limit}`);
    setLoading(true);
    setError(null);
    
    try {
      // Use the real API endpoint for account transfers
      const response = await apiService.account.getAccountTransfers(accountId, limit);
      console.log('Account transfers API response:', response);
      
      if (response.ok) {
        let transfersData = [];
        
        // Handle different response formats
        if (Array.isArray(response.data)) {
          transfersData = response.data;
          console.log(`Found ${transfersData.length} transfers in array format`);
        } else if (response.data && Array.isArray(response.data.transfers)) {
          transfersData = response.data.transfers;
          console.log(`Found ${transfersData.length} transfers in transfers property`);
        } else if (response.data && Array.isArray(response.data.results)) {
          transfersData = response.data.results;
          console.log(`Found ${transfersData.length} transfers in results property`);
        } else if (response.data) {
          // If data is just an object, not an array
          transfersData = [response.data];
          console.log('Found single transfer object');
        } else {
          console.log('No transfers data found in response');
        }
        
        console.log('Setting account transfers:', transfersData);
        setAccountTransfers(transfersData);
        setLoading(false);
        return transfersData;
      } else {
        console.error('API returned error:', response.error);
        setError(response.error?.message || 'An error occurred while fetching transfers');
        setLoading(false);
        return [];
      }
    } catch (err) {
      console.error('Error fetching account transfers:', err);
      setError(err.message || 'An error occurred while fetching transfers');
      setLoading(false);
      return [];
    }
  }, []);

  return {
    // Data
    accountTransfers,
    loading,
    error,
    
    // Actions
    fetchAccountTransfers
  };
};

export default useAccountTransfers;