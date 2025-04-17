import { useCallback } from 'react';
import apiService from '../services/apiService';
import useDataFetching from './useDataFetching';

/**
 * Custom hook for managing ledgers data, implementing the generic data fetching hook
 * @returns {Object} - Ledgers data and helper functions
 */
const useLedgers = () => {
  // Define API-specific fetching functions
  const fetchAllLedgers = useCallback(() => {
    return apiService.ledger.getLedgers();
  }, []);
  
  const fetchLedgerById = useCallback((ledgerId) => {
    return apiService.ledger.getLedgerById(ledgerId);
  }, []);
  
  const fetchLedgerAccounts = useCallback((ledgerId) => {
    return apiService.ledger.getLedgerAccounts(ledgerId);
  }, []);
  
  // Use the generic data fetching hook
  const {
    items: ledgers,
    selectedItem: selectedLedger,
    childItems: ledgerAccounts,
    loading,
    error,
    fetchAllItems: fetchLedgers,
    fetchItemById: fetchLedgerWithDetails,
    refreshChildren: refreshLedgerAccounts,
    clearSelectedItem: clearSelectedLedger,
    setSelectedItem: setSelectedLedger
  } = useDataFetching({
    fetchAll: fetchAllLedgers,
    fetchById: fetchLedgerById,
    fetchChildren: fetchLedgerAccounts
  });
  
  return {
    // Data
    ledgers,
    selectedLedger,
    ledgerAccounts,
    loading,
    error,
    
    // Actions
    fetchLedgers,
    fetchLedgerById: fetchLedgerWithDetails,
    refreshLedgerAccounts,
    clearSelectedLedger,
    setSelectedLedger
  };
};

export default useLedgers;