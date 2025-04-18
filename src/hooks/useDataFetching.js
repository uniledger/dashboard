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
      const response = await fetchAll();
      
      if (response.ok) {
        // Detailed response inspection
        console.log('%c 🔍 Data Structure Inspection', 'background: #f0f0f0; color: #0044cc; font-weight: bold; padding: 3px 5px; border-radius: 3px;');
        console.log('Full response object:', response);
        console.log('response.data type:', typeof response.data);
        
        // Check if response.data exists 
        let processedData;
        
        if (response.data === null || response.data === undefined) {
          console.log('%c ⚠️ response.data is null/undefined - using empty array', 'color: #cc4400;');
          processedData = [];
        } else if (Array.isArray(response.data)) {
          console.log(`%c ✓ response.data is array with ${response.data.length} items`, 'color: #008800;');
          processedData = response.data;
        } else if (typeof response.data === 'object') {
          console.log('%c ℹ️ response.data is an object (not array)', 'color: #0088cc;');
          
          // Many APIs return { results: [...] } or { data: [...] } structure
          if (response.data.results && Array.isArray(response.data.results)) {
            console.log(`%c ✓ Using response.data.results with ${response.data.results.length} items`, 'color: #008800;');
            processedData = response.data.results;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            console.log(`%c ✓ Using response.data.data with ${response.data.data.length} items`, 'color: #008800;');
            processedData = response.data.data;
          } else if (response.data.items && Array.isArray(response.data.items)) {
            console.log(`%c ✓ Using response.data.items with ${response.data.items.length} items`, 'color: #008800;');
            processedData = response.data.items;
          } else {
            // Last resort: if it's an object but not containing an array, make it an array of 1
            console.log('%c ⚠️ Using response.data as single item in array', 'color: #cc4400;');
            processedData = [response.data];
          }
        } else {
          console.log('%c ⚠️ response.data is neither array nor object - using empty array', 'color: #cc4400;');
          processedData = [];
        }
        
        setItems(processedData);
        setLoading(false);
        return processedData;
      } else {
        console.error('API returned error:', response.error);
        setError(response.error?.message || 'An error occurred while fetching data');
        setLoading(false);
        return null;
      }
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
      const itemResponse = await fetchById(id);
      const itemData = itemResponse.ok && itemResponse.data ? itemResponse.data : null;
      
      if (!itemData) {
        console.error('Failed to fetch item:', itemResponse.error);
        setError(itemResponse.error?.message || 'Failed to fetch item details');
        setLoading(false);
        return null;
      }
      
      setSelectedItem(itemData);
      
      // Fetch children for the item
      const childrenResponse = await fetchChildren(id);
      const childrenData = childrenResponse.ok && childrenResponse.data ? childrenResponse.data : [];
      setChildItems(childrenData);
      
      // Fetch secondary children if function is provided
      let secondaryChildrenData = [];
      if (fetchSecondaryChildren) {
        const secondaryResponse = await fetchSecondaryChildren(id);
        secondaryChildrenData = secondaryResponse.ok && secondaryResponse.data ? secondaryResponse.data : [];
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
      const response = await fetchChildren(id);
      if (response.ok && response.data) {
        const childrenData = response.data;
        setChildItems(childrenData);
        return childrenData;
      } else {
        console.error('Failed to refresh children:', response.error);
        return [];
      }
    } catch (err) {
      console.error('Error refreshing children:', err);
      // Don't update error state on refresh to avoid disrupting the UI
      return [];
    }
  }, [fetchChildren]);

  /**
   * Refresh secondary children for a specific item
   * @param {string|number} id - Item ID to refresh secondary children for
   */
  const refreshSecondaryChildren = useCallback(async (id) => {
    if (!id || !fetchSecondaryChildren) return;
    
    try {
      const response = await fetchSecondaryChildren(id);
      if (response.ok && response.data) {
        const childrenData = response.data;
        setSecondaryChildItems(childrenData);
        return childrenData;
      } else {
        console.error('Failed to refresh secondary children:', response.error);
        return [];
      }
    } catch (err) {
      console.error('Error refreshing secondary children:', err);
      // Don't update error state on refresh to avoid disrupting the UI
      return [];
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