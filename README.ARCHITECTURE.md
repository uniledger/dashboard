# Uniledger Dashboard Architecture Guide

## Overview

The Uniledger Dashboard follows a modular architecture based on reusable, configurable components. This guide explains the architectural decisions, component structure, and best practices for maintaining and extending the application.

## Core Principles

1. **DRY (Don't Repeat Yourself)**: Common patterns and functionality are extracted into reusable components.
2. **Separation of Concerns**: Data fetching, presentation, and behavior are separated.
3. **Composition over Inheritance**: Components are composed like building blocks.
4. **Configuration-Driven**: Model-specific behavior is defined through configuration.

## Component Structure

### Generic Components

These components provide reusable UI patterns and behavior:

#### `GenericDetailView`

A reusable component for displaying detailed information about any model.

```jsx
<GenericDetailView
  data={entity}                           // The model data object
  title="Entity Detail"                   // View title
  subtitle={entity.name}                  // Instance name
  sections={basicSections}                // Basic information sections
  childrenSections={[ledgersSection]}     // Child relationship sections
  onBack={onBack}                         // Back button handler
  onRefresh={onRefresh}                   // Refresh button handler
  onViewJson={onViewJson}                 // View JSON handler
/>
```

#### `GenericListView`

A reusable component for displaying lists of any model.

```jsx
<GenericListView
  data={accounts}                         // Array of model objects
  columns={AccountConfig.listColumns}     // Column definitions
  title="Accounts"                        // List title
  idField="account_id"                    // ID field name
  onItemClick={handleAccountClick}        // Row click handler
  onViewJson={onViewJson}                 // View JSON handler
  onRefresh={onRefresh}                   // Refresh button handler
  filter={activeFilter}                   // Active filter object
  onClearFilter={handleClearFilter}       // Filter clear handler
/>
```

#### `DataTableSection`

A reusable component for displaying tabular data in detail views.

```jsx
<DataTableSection
  data={entityLedgers}                    // Array of child objects
  columns={ledgerColumns}                 // Column definitions
  title="Ledgers"                         // Table title
  onRowClick={handleLedgerClick}          // Row click handler
  emptyMessage="No ledgers found"         // Empty state message
  sortFunction={sortByName}               // Optional sort function
/>
```

### Model-Specific Components

These components use the generic components with model-specific configuration:

- `EntityDetail` - Details about an entity
- `EntityList` - List of entities
- `LedgerDetail` - Details about a ledger
- `LedgerList` - List of ledgers
- `AccountDetail` - Details about an account
- `AccountList` - List of accounts

### Configuration

Model configurations are centralized in `modelConfig.js`:

```jsx
export const EntityConfig = {
  title: 'Entity',
  idField: 'entity_id',
  displayField: 'name',
  
  // Column definitions for list view
  listColumns: [ ... ],
  
  // Basic section fields for detail view
  detailSections: (entity) => [ ... ]
};
```

### Utilities

Common functionality is extracted into utilities:

- `filterUtils.js` - Functions for filtering data
- `formatters.js` - Functions for formatting data display

## Workflow for Creating a New Model View

1. Define the model configuration in `modelConfig.js`
2. Create model-specific components that use generic components
3. Add routes in `DashboardRouter.js`

## Example: Creating a New Model View

### 1. Add Model Configuration

```jsx
// src/components/common/config/modelConfig.js
export const TransactionConfig = {
  title: 'Transaction',
  idField: 'transaction_id',
  displayField: 'description',
  
  listColumns: [ ... ],
  detailSections: (transaction) => [ ... ]
};
```

### 2. Create List Component

```jsx
// src/components/transactions/TransactionList.js
import React from 'react';
import { GenericListView } from '../common';
import { TransactionConfig } from '../common/config/modelConfig';

const TransactionList = ({ 
  transactions, 
  onViewJson, 
  onRefresh, 
  onViewTransaction 
}) => {
  return (
    <GenericListView
      data={transactions}
      columns={TransactionConfig.listColumns}
      title={TransactionConfig.title + 's'}
      idField={TransactionConfig.idField}
      onItemClick={onViewTransaction}
      onViewJson={onViewJson}
      onRefresh={onRefresh}
    />
  );
};

export default TransactionList;
```

### 3. Create Detail Component

```jsx
// src/components/transactions/TransactionDetail.js
import React from 'react';
import { GenericDetailView } from '../common';
import { TransactionConfig } from '../common/config/modelConfig';

const TransactionDetail = ({ 
  transaction, 
  onViewJson, 
  onBack, 
  onRefresh 
}) => {
  const sections = transaction 
    ? TransactionConfig.detailSections(transaction)
    : [];
    
  return (
    <GenericDetailView
      data={transaction}
      title={TransactionConfig.title + " Detail"}
      subtitle={transaction?.description}
      sections={sections}
      onBack={onBack}
      onRefresh={onRefresh}
      onViewJson={onViewJson}
    />
  );
};

export default TransactionDetail;
```

## Best Practices

1. **Use Generic Components**: Always prefer the generic components over creating new UI patterns.
2. **Follow Configuration Pattern**: Add new models to `modelConfig.js` instead of hard-coding values.
3. **Separate Data and Presentation**: Keep data fetching logic separate from presentation components.
4. **Consistent Naming**: Follow established naming patterns for consistency.
5. **Extract Common Logic**: If you find yourself writing the same logic in multiple places, extract it to a utility.

By following these practices, the codebase will remain maintainable, consistent, and extensible as new features are added.
