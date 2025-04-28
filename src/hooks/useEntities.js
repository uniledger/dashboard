import { useCallback } from 'react';
import apiService from '../services/apiService';
import useDataFetching from './useDataFetching';

/**
 * Custom hook for managing entities data, implementing the generic data fetching hook
 * @returns {Object} - Entities data and helper functions
 */
const useEntities = () => {
  // Define API-specific fetching functions
  const fetchAllEntities = useCallback(() => {
    return apiService.entity.getEntities();
  }, []);
  
  const fetchEntityById = useCallback((entityId) => {
    return apiService.entity.getEntityById(entityId);
  }, []);
  
  const fetchEntityLedgers = useCallback((entityId) => {
    return apiService.entity.getEntityLedgers(entityId);
  }, []);
  
  const fetchEntityAccounts = useCallback((entityId) => {
    return apiService.entity.getEntityAccounts(entityId);
  }, []);
  
  // Use the generic data fetching hook
  const {
    items: entities,
    selectedItem: selectedEntity,
    childItems: entityLedgers,
    secondaryChildItems: entityAccounts,
    loading,
    error,
    fetchAllItems: fetchEntities,
    fetchItemById: fetchEntityWithDetails,
    refreshSecondaryChildren: refreshEntityAccounts,
    clearSelectedItem: clearSelectedEntity,
    setSelectedItem: setSelectedEntity
  } = useDataFetching({
    fetchAll: fetchAllEntities,
    fetchById: fetchEntityById,
    fetchChildren: fetchEntityLedgers,
    fetchSecondaryChildren: fetchEntityAccounts
  });
  
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
    fetchEntityById: fetchEntityWithDetails,
    fetchEntityLedgers, // Direct access to fetch ledgers function
    refreshEntityAccounts,
    clearSelectedEntity,
    setSelectedEntity
  };
};

export default useEntities;