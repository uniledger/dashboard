import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

/**
 * Custom hook for managing entities data
 * @returns {Object} - Entities data and helper functions
 */
const useEntities = () => {
  // State for entities data
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [entityLedgers, setEntityLedgers] = useState([]);
  const [entityAccounts, setEntityAccounts] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all entities
   */
  const fetchEntities = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiService.entity.getEntities();
      setEntities(data);
      setLoading(false);
      return data;
    } catch (err) {
      console.error('Error fetching entities:', err);
      setError(err.message || 'An error occurred while fetching entities');
      setLoading(false);
      return null;
    }
  }, []);

  /**
   * Fetch entity details by ID
   * @param {string} entityId - Entity ID to fetch
   */
  const fetchEntityById = useCallback(async (entityId) => {
    if (!entityId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch entity details
      const entityData = await apiService.entity.getEntityById(entityId);
      setSelectedEntity(entityData);
      
      // Fetch ledgers for the entity
      const entityLedgersData = await apiService.entity.getEntityLedgers(entityId);
      setEntityLedgers(entityLedgersData);
      
      // Fetch accounts for the entity
      const entityAccountsData = await apiService.entity.getEntityAccounts(entityId);
      setEntityAccounts(entityAccountsData);
      
      setLoading(false);
      return { entity: entityData, ledgers: entityLedgersData, accounts: entityAccountsData };
    } catch (err) {
      console.error('Error fetching entity detail:', err);
      setError(err.message || 'An error occurred while fetching entity data');
      setLoading(false);
      return null;
    }
  }, []);

  /**
   * Refresh accounts for a specific entity
   * @param {string} entityId - Entity ID to refresh accounts for
   */
  const refreshEntityAccounts = useCallback(async (entityId) => {
    if (!entityId) return;
    
    try {
      const accountsData = await apiService.entity.getEntityAccounts(entityId);
      setEntityAccounts(accountsData);
      return accountsData;
    } catch (err) {
      console.error('Error refreshing entity accounts:', err);
      // Don't update error state on refresh to avoid disrupting the UI
      return null;
    }
  }, []);

  /**
   * Clear the selected entity and related data
   */
  const clearSelectedEntity = useCallback(() => {
    setSelectedEntity(null);
    setEntityLedgers([]);
    setEntityAccounts([]);
  }, []);

  return {
    // Data
    entities,
    selectedEntity,
    entityLedgers,
    entityAccounts,
    loading,
    error,
    
    // Actions
    fetchEntities,
    fetchEntityById,
    refreshEntityAccounts,
    clearSelectedEntity,
    setSelectedEntity
  };
};

export default useEntities;