import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

/**
 * Custom hook for managing ledgers data
 * @returns {Object} - Ledgers data and helper functions
 */
const useLedgers = () => {
  // State for ledgers data
  const [ledgers, setLedgers] = useState([]);
  const [selectedLedger, setSelectedLedger] = useState(null);
  const [ledgerAccounts, setLedgerAccounts] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all ledgers
   */
  const fetchLedgers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiService.ledger.getLedgers();
      setLedgers(data);
      setLoading(false);
      return data;
    } catch (err) {
      console.error('Error fetching ledgers:', err);
      setError(err.message || 'An error occurred while fetching ledgers');
      setLoading(false);
      return null;
    }
  }, []);

  /**
   * Fetch ledger details by ID
   * @param {string} ledgerId - Ledger ID to fetch
   */
  const fetchLedgerById = useCallback(async (ledgerId) => {
    if (!ledgerId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch ledger details
      const ledgerData = await apiService.ledger.getLedgerById(ledgerId);
      setSelectedLedger(ledgerData);
      
      // Fetch accounts for the ledger
      const ledgerAccountsData = await apiService.ledger.getLedgerAccounts(ledgerId);
      setLedgerAccounts(ledgerAccountsData);
      
      setLoading(false);
      return { ledger: ledgerData, accounts: ledgerAccountsData };
    } catch (err) {
      console.error('Error fetching ledger detail:', err);
      setError(err.message || 'An error occurred while fetching ledger data');
      setLoading(false);
      return null;
    }
  }, []);

  /**
   * Refresh accounts for a specific ledger
   * @param {string} ledgerId - Ledger ID to refresh accounts for
   */
  const refreshLedgerAccounts = useCallback(async (ledgerId) => {
    if (!ledgerId) return;
    
    try {
      const accountsData = await apiService.ledger.getLedgerAccounts(ledgerId);
      setLedgerAccounts(accountsData);
      return accountsData;
    } catch (err) {
      console.error('Error refreshing ledger accounts:', err);
      // Don't update error state on refresh to avoid disrupting the UI
      return null;
    }
  }, []);

  /**
   * Clear the selected ledger and related data
   */
  const clearSelectedLedger = useCallback(() => {
    setSelectedLedger(null);
    setLedgerAccounts([]);
  }, []);

  return {
    // Data
    ledgers,
    selectedLedger,
    ledgerAccounts,
    loading,
    error,
    
    // Actions
    fetchLedgers,
    fetchLedgerById,
    refreshLedgerAccounts,
    clearSelectedLedger,
    setSelectedLedger
  };
};

export default useLedgers;