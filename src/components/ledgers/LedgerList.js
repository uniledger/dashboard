import React from 'react';
import { GenericListView, LedgerConfig } from '../common';

/**
 * Ledger List component using GenericListView
 */
const LedgerList = ({ 
  ledgers,
  onViewDetails,
  onViewJson,
  onRefresh,
  onViewEntity
}) => {
  // Add entity navigation to columns
  const columns = [...LedgerConfig.listColumns];
  
  // Add click handler to entity column if it exists
  const entityColumnIndex = columns.findIndex(col => col.key === 'entity');
  if (entityColumnIndex !== -1) {
    columns[entityColumnIndex] = {
      ...columns[entityColumnIndex],
      cellClassName: (ledger) => {
        const entityId = ledger.r_entity?.entity_id || ledger.entity_id || (ledger.entity && ledger.entity.entity_id);
        return entityId ? 'text-blue-600 cursor-pointer hover:underline' : 'text-gray-500';
      },
      onClick: (ledger) => {
        const entityId = ledger.r_entity?.entity_id || ledger.entity_id || (ledger.entity && ledger.entity.entity_id);
        if (entityId && onViewEntity) {
          onViewEntity(entityId);
          return true; // Prevent row click propagation
        }
        return false;
      }
    };
  }
  
  return (
    <GenericListView
      data={ledgers}
      columns={columns}
      title="Ledgers"
      idField={LedgerConfig.idField}
      onItemClick={onViewDetails}
      onViewJson={onViewJson}
      onRefresh={onRefresh}
      searchPlaceholder="Search ledgers..."
      emptyMessage="No ledgers found"
    />
  );
};

export default LedgerList;