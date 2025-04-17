# Uniledger Dashboard Improvements

This document outlines the recent improvements made to the Uniledger Dashboard codebase to address specific areas for enhancement.

## 1. Formatter Functions Reorganization

### Problem
The `formatters.js` file contained various formatting functions for different domains (accounts, balances, dates, etc.) that needed better organization.

### Solution
We split the formatter functions into domain-specific files within a `formatters` directory:

```
src/utils/formatters/
├── index.js              # Central export file
├── balanceFormatters.js  # Currency and balance formatting
├── dateFormatters.js     # Date formatting utilities
├── accountFormatters.js  # Account-specific formatting
└── entityFormatters.js   # Entity and country formatting
```

### Benefits
- Easier to find and maintain related formatting functions
- Prevents a single file from becoming too large
- Better organization by domain/responsibility
- No changes to the actual implementation logic or API

## 2. Generic Data Fetching Hook

### Problem
There was duplication between entity-specific hooks (`useEntities`, `useLedgers`, `useAccounts`), which all followed similar patterns for data fetching, state management, and error handling.

### Solution
We created a generic `useDataFetching` hook that can be reused across all entity types:

```javascript
const useDataFetching = ({
  fetchAll,
  fetchById,
  fetchChildren,
  fetchSecondaryChildren = null,
}) => {
  // Shared state management and data fetching logic
  // ...
  
  return {
    items,
    selectedItem,
    childItems,
    secondaryChildItems,
    loading,
    error,
    // ... other data and methods
  };
};
```

### Implementation
- `useDataFetching.js` - Generic hook that handles fetching, loading states, and error handling
- Updated entity-specific hooks to use the generic hook:
  - `useEntities.js`
  - `useLedgers.js`
  - `useAccounts.js`

### Benefits
- Removes duplicated state management logic
- Centralizes error handling and loading state management
- Ensures consistent patterns across all data types
- Makes it easier to add new entity types in the future

## 3. Enhanced Filtering System

### Problem
Filtering logic was not fully centralized, and each component might implement filtering differently, leading to potential duplication.

### Solution
We created a comprehensive filtering system with model-specific filters:

```
src/utils/filterUtils/
├── index.js              # Main filtering utilities and exports
├── accountFilters.js     # Account-specific filters
├── entityFilters.js      # Entity-specific filters
└── ledgerFilters.js      # Ledger-specific filters
```

### Implementation
- Model-specific filtering functions organized by domain
- Central API for applying filters by model type
- Enhanced search functionality with better support for nested fields
- Maintained backwards compatibility with existing code

### Benefits
- Centralized filtering logic for all entity types
- Easier to implement consistent filtering across the application
- Better organization of filtering logic by domain
- Support for complex, model-specific filtering requirements

## Usage Examples

### Using the Formatters

```javascript
import { formatBalance, getBalanceClass } from '../utils/formatters';
// or domain-specific import:
import { formatBalance } from '../utils/formatters/balanceFormatters';

const formattedValue = formatBalance(account.balance, currency);
```

### Using the Generic Data Fetching Hook

```javascript
// In your custom hook:
import useDataFetching from './useDataFetching';

const useMyEntityType = () => {
  const fetchAll = useCallback(() => {
    return apiService.myEntity.getAll();
  }, []);
  
  const fetchById = useCallback((id) => {
    return apiService.myEntity.getById(id);
  }, []);
  
  const { 
    items, 
    selectedItem,
    loading,
    error,
    fetchAllItems,
    fetchItemById
  } = useDataFetching({
    fetchAll,
    fetchById,
    fetchChildren: () => Promise.resolve([])
  });
  
  return {
    myEntities: items,
    selectedEntity: selectedItem,
    loading,
    error,
    fetchEntities: fetchAllItems,
    fetchEntityById: fetchItemById
  };
};
```

### Using the Enhanced Filtering System

```javascript
import { filterByModelType, getSearchFields } from '../utils/filterUtils';

// Get recommended search fields for an entity type
const searchFields = getSearchFields('entity');

// Filter data using model-specific logic
const filteredData = filterByModelType(
  entities, 
  { countryCode: 'US', entityType: 'CUSTOMER' }, 
  'entity'
);

// Or use domain-specific filters directly
import { entityFilters } from '../utils/filterUtils';
const filteredByCountry = entityFilters.filterByCountry(entities, 'US');
```

## Next Steps

1. **Add Unit Tests** - Create comprehensive tests for the new utilities
2. **TypeScript Migration** - Consider adding type definitions for better type safety
3. **Component Refactoring** - Update components to use the enhanced utilities
4. **Documentation** - Add JSDoc comments to all new functions and hooks