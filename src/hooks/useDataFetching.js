import { useState, useCallback } from 'react';

/**
 * Generic data fetching hook for reusable data operations
 * This hook reduces duplication across entity-specific hooks
 * 
 * @param {Object} options - Hook configuration options
 * @param {Function} options.fetchAll - Function to fetch all items
 * @param {Function} options.fetchById - Function to fetch item by ID
 * @param {Function} options.fetchChildren - Function to fetch child items
 * @param {Function} options.fetchSecondaryChildren - Optional function to fetch secondary children
 * @returns {Object} - Data and helper functions
 */
const useDataFetching = ({
  fetchAll,
  fetchById,
  fetchChildren,
  fetchSecondaryChildren = null,
}) => {
  // Primary data states
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Children states
  const [childItems, setChildItems] = useState([]);
  const [secondaryChildItems, setSecondaryChildItems] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all items
   */
  const fetchAllItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchAll();
      setItems(data);
      setLoading(false);
      return data;
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'An error occurred while fetching data');
      setLoading(false);
      return null;
    }
  }, [fetchAll]);

  /**
   * Fetch item by ID with its children
   * @param {string|number} id - Item ID to fetch
   */
  const fetchItemById = useCallback(async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch item details
      const itemData = await fetchById(id);
      setSelectedItem(itemData);
      
      // Fetch children for the item
      const childrenData = await fetchChildren(id);
      setChildItems(childrenData);
      
      // Fetch secondary children if function is provided
      let secondaryChildrenData = [];
      if (fetchSecondaryChildren) {
        secondaryChildrenData = await fetchSecondaryChildren(id);
        setSecondaryChildItems(secondaryChildrenData);
      }
      
      setLoading(false);
      
      // Return all fetched data
      const result = { 
        item: itemData, 
        children: childrenData
      };
      
      if (fetchSecondaryChildren) {
        result.secondaryChildren = secondaryChildrenData;
      }
      
      return result;
    } catch (err) {
      console.error('Error fetching item detail:', err);
      setError(err.message || 'An error occurred while fetching data');
      setLoading(false);
      return null;
    }
  }, [fetchById, fetchChildren, fetchSecondaryChildren]);

  /**
   * Refresh children for a specific item
   * @param {string|number} id - Item ID to refresh children for
   */
  const refreshChildren = useCallback(async (id) => {
    if (!id) return;
    
    try {
      const childrenData = await fetchChildren(id);
      setChildItems(childrenData);
      return childrenData;
    } catch (err) {
      console.error('Error refreshing children:', err);
      // Don't update error state on refresh to avoid disrupting the UI
      return null;
    }
  }, [fetchChildren]);

  /**
   * Refresh secondary children for a specific item
   * @param {string|number} id - Item ID to refresh secondary children for
   */
  const refreshSecondaryChildren = useCallback(async (id) => {
    if (!id || !fetchSecondaryChildren) return;
    
    try {
      const childrenData = await fetchSecondaryChildren(id);
      setSecondaryChildItems(childrenData);
      return childrenData;
    } catch (err) {
      console.error('Error refreshing secondary children:', err);
      // Don't update error state on refresh to avoid disrupting the UI
      return null;
    }
  }, [fetchSecondaryChildren]);

  /**
   * Clear the selected item and related data
   */
  const clearSelectedItem = useCallback(() => {
    setSelectedItem(null);
    setChildItems([]);
    setSecondaryChildItems([]);
  }, []);

  return {
    // Data
    items,
    selectedItem,
    childItems,
    secondaryChildItems,
    loading,
    error,
    
    // Actions
    fetchAllItems,
    fetchItemById,
    refreshChildren,
    refreshSecondaryChildren,
    clearSelectedItem,
    setSelectedItem,
    
    // Setters for direct state manipulation when needed
    setItems,
    setChildItems,
    setSecondaryChildItems
  };
};

export default useDataFetching;