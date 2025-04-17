/**
 * Entity-specific filtering logic
 */
import { filterData } from './index';

/**
 * Filter entities by country
 * @param {Array} entities - Array of entity objects
 * @param {string} countryCode - Country code to filter by
 * @returns {Array} - Filtered entities
 */
export const filterEntitiesByCountry = (entities, countryCode) => {
  if (!countryCode) {
    return entities;
  }
  
  const normalizedCode = countryCode.toUpperCase();
  
  return entities.filter(entity => {
    // Check direct country code
    if (entity.country_code && entity.country_code.toUpperCase() === normalizedCode) {
      return true;
    }
    
    // Check through r_country
    if (entity.r_country && entity.r_country.country_code && 
        entity.r_country.country_code.toUpperCase() === normalizedCode) {
      return true;
    }
    
    return false;
  });
};

/**
 * Filter entities by type
 * @param {Array} entities - Array of entity objects
 * @param {string} entityType - Entity type to filter by
 * @returns {Array} - Filtered entities
 */
export const filterEntitiesByType = (entities, entityType) => {
  if (!entityType) {
    return entities;
  }
  
  const normalizedType = entityType.toUpperCase();
  
  return entities.filter(entity => {
    const type = (entity.type || entity.entity_type || '').toUpperCase();
    return type === normalizedType;
  });
};

/**
 * Apply all entity filters
 * @param {Array} entities - Array of entity objects
 * @param {Object} filters - All filters to apply
 * @returns {Array} - Filtered entities
 */
export const applyEntityFilters = (entities, filters) => {
  let filteredEntities = [...entities];
  
  // Apply country filter if specified
  if (filters.countryCode) {
    filteredEntities = filterEntitiesByCountry(filteredEntities, filters.countryCode);
  }
  
  // Apply type filter if specified
  if (filters.entityType) {
    filteredEntities = filterEntitiesByType(filteredEntities, filters.entityType);
  }
  
  // Apply any other generic filters
  if (filters.field && filters.value) {
    filteredEntities = filterData(filteredEntities, filters);
  }
  
  return filteredEntities;
};

// Export entity filters
export const entityFilters = {
  filterByCountry: filterEntitiesByCountry,
  filterByType: filterEntitiesByType,
  applyFilters: applyEntityFilters
};