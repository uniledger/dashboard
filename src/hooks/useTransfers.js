import { useState, useCallback } from 'react';
// Will be used when API is updated
// eslint-disable-next-line no-unused-vars
import apiService from '../services/apiService';

/**
 * Custom hook for fetching and managing transfers data
 * @returns {Object} - Transfers data and helper functions
 */
const useTransfers = () => {
  // Transfers state
  const [transfers, setTransfers] = useState([]);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all transfers (limited to 100 by default)
   * Note: This will use the updated API endpoint when it becomes available
   */
  const fetchTransfers = useCallback(async (limit = 100) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use a placeholder response for now, will be updated when API is ready
      // const response = await apiService.transfer.getTransfers(limit);
      const response = { ok: true, data: [] };
      
      if (response.ok) {
        let transfersData = [];
        
        // Handle different response formats
        if (Array.isArray(response.data)) {
          transfersData = response.data;
        } else if (response.data && Array.isArray(response.data.transfers)) {
          transfersData = response.data.transfers;
        } else if (response.data && Array.isArray(response.data.results)) {
          transfersData = response.data.results;
        } else if (response.data) {
          // If data is just an object, not an array
          transfersData = [response.data];
        }
        
        setTransfers(transfersData);
        setLoading(false);
        return transfersData;
      } else {
        console.error('API returned error:', response.error);
        setError(response.error?.message || 'An error occurred while fetching transfers');
        setLoading(false);
        return [];
      }
    } catch (err) {
      console.error('Error fetching transfers:', err);
      setError(err.message || 'An error occurred while fetching transfers');
      setLoading(false);
      return [];
    }
  }, []);

  /**
   * Fetch transfer by ID
   * @param {string|number} transferId - Transfer ID to fetch
   * Note: This will use the updated API endpoint when it becomes available
   */
  const fetchTransferById = useCallback(async (transferId) => {
    if (!transferId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use a placeholder response for now, will be updated when API is ready
      // const response = await apiService.transfer.getTransferById(transferId);
      const response = { ok: true, data: null };
      
      if (response.ok && response.data) {
        setSelectedTransfer(response.data);
        setLoading(false);
        return response.data;
      } else {
        console.error('Failed to fetch transfer:', response.error);
        setError(response.error?.message || 'Failed to fetch transfer details');
        setLoading(false);
        return null;
      }
    } catch (err) {
      console.error('Error fetching transfer detail:', err);
      setError(err.message || 'An error occurred while fetching transfer');
      setLoading(false);
      return null;
    }
  }, []);

  /**
   * Clear the selected transfer
   */
  const clearSelectedTransfer = useCallback(() => {
    setSelectedTransfer(null);
  }, []);

  return {
    // Data
    transfers,
    selectedTransfer,
    loading,
    error,
    
    // Actions
    fetchTransfers,
    fetchTransferById,
    clearSelectedTransfer,
    setSelectedTransfer
  };
};

export default useTransfers;