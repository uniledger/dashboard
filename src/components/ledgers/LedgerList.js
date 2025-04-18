import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericListView, LedgerConfig } from '../common';
import useLedgers from '../../hooks/useLedgers';
import { useDashboard } from '../../context/DashboardContext';

/**
 * Ledger List component using GenericListView
 */
const LedgerList = () => {
  const navigate = useNavigate();
  const { handleViewJson } = useDashboard();
  const { ledgers, loading, fetchLedgers } = useLedgers();
  
  // Fetch ledgers when component mounts
  useEffect(() => {
    fetchLedgers();
  }, [fetchLedgers]);
  
  
  // Navigate to ledger detail view
  const handleViewLedger = (ledger) => {
    // Make sure we have a string ID, not an object
    const id = typeof ledger === 'object' ? ledger.ledger_id : ledger;
    navigate(`/ledgers/${id}`);
  };
  
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
        console.log("Ledger clicked:", ledger);
        
        // Get entity ID directly from various possible locations
        let entityId;
        
        if (ledger.r_entity && ledger.r_entity.entity_id) {
          // If we have a nested r_entity object
          entityId = ledger.r_entity.entity_id;
        } else if (ledger.entity && ledger.entity.entity_id) {
          // If we have a nested entity object
          entityId = ledger.entity.entity_id;
        } else if (ledger.entity_id) {
          // If we have a direct entity_id property
          entityId = ledger.entity_id;
        }
        
        console.log("Entity ID from ledger:", entityId);
        
        if (entityId) {
          // Navigate directly with the ID, not the object
          navigate(`/entities/${entityId}`);
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
      onItemClick={handleViewLedger}
      onRefresh={fetchLedgers}
      searchPlaceholder="Search ledgers..."
      emptyMessage="No ledgers found"
      loading={loading}
    />
  );
};

export default LedgerList;