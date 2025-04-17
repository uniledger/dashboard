/**
 * Entity and country formatting utilities
 */

/**
 * Get a readable display of country information
 * @param {object} item - The item (entity, ledger) with country info
 * @param {object} entity - Optional entity context for ledgers
 * @returns {string} Formatted country display
 */
export const getCountryDisplay = (item, entity) => {
  if (!item) return 'N/A';
  
  // Format function for country objects
  const formatCountryObj = (country) => {
    if (country && country.name && country.country_code) {
      return `${country.name} (${country.country_code})`;
    }
    return null;
  };
  
  // First check if r_entity has country info
  if (item.r_entity && item.r_entity.r_country) {
    return formatCountryObj(item.r_entity.r_country) || 'N/A';
  }
  
  // Check for direct r_country attribute
  if (item.r_country) {
    return formatCountryObj(item.r_country) || 'N/A';
  }
  
  // Check if it's a ledger that belongs to an entity with a country
  if (entity && entity.r_country) {
    return formatCountryObj(entity.r_country) || 'N/A';
  }
  
  // Check entity fields
  if (item.entity && item.entity.r_country) {
    return formatCountryObj(item.entity.r_country) || 'N/A';
  }
  
  // For ledgers with country_code 'NA', use the entity's country
  if (item.country_code === 'NA' && entity && entity.r_country) {
    return formatCountryObj(entity.r_country) || entity.country_code || 'N/A';
  }
  
  // Try to find country by traversing various paths in the object
  const paths = [
    'enriched_entity.r_country',
    'enriched_ledger.r_entity.r_country',
    'enriched_ledger.r_country',
    'r_entity.r_country'
  ];
  
  for (const path of paths) {
    const parts = path.split('.');
    let obj = item;
    let valid = true;
    
    for (const part of parts) {
      if (!obj || !obj[part]) {
        valid = false;
        break;
      }
      obj = obj[part];
    }
    
    if (valid && obj.name && obj.country_code) {
      return formatCountryObj(obj) || 'N/A';
    }
  }
  
  // Return country code if available
  if (item.country_code && item.country_code !== 'NA') {
    return item.country_code;
  }
  
  // Return any country field
  if (item.country) {
    return item.country;
  }
  
  // Try entity property if available
  if (item.r_entity?.country_code && item.r_entity.country_code !== 'NA') {
    return item.r_entity.country_code;
  }
  
  if (item.entity?.country_code && item.entity.country_code !== 'NA') {
    return item.entity.country_code;
  }
  
  return 'N/A';
};