import React, { useState, useEffect } from 'react';
import { StandardList } from '../common';
import { getCountryDisplay } from '../../utils/formatters';

const API_BASE_URL = 'https://ledger.dev.ledgerrocket.com';

/**
 * Ledger List component using StandardList for consistent behavior
 */
const LedgerList = ({ ledgers, onViewDetails, onViewJson, onRefresh, onViewEntity }) => {
  const [loading, setLoading] = useState(true);
  const [entities, setEntities] = useState([]);

  // Fetch entities for displaying entity names
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/enriched-entities/`);
        const data = await response.json();
        setEntities(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching entities:', err);
        setLoading(false);
      }
    };

    fetchEntities();
  }, []);
  
  // Helper function to find entity for a ledger
  const getEntityForLedger = (ledger) => {
    // Find the associated entity
    const entity = entities.find(e => e.entity_id === ledger.entity_id) || ledger.r_entity;
    return entity;
  };

  // Define columns for the DataTable
  const columns = [
    {
      key: 'ledger_id',
      header: 'ID',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
    },
    {
      key: 'name',
      header: 'Name',
      cellClassName: 'font-medium text-gray-900',
    },
    {
      key: 'entity',
      header: 'Ledger Owner',
      render: (ledger) => {
        const entity = getEntityForLedger(ledger);
        return entity?.name || 'N/A';
      },
      cellClassName: (ledger) => {
        const entityId = getEntityForLedger(ledger)?.entity_id || ledger.entity_id;
        return entityId ? 'text-blue-600 cursor-pointer hover:underline' : 'text-gray-500';
      },
      onClick: (ledger) => {
        const entityId = getEntityForLedger(ledger)?.entity_id || ledger.entity_id;
        if (entityId && onViewEntity) {
          onViewEntity(entityId);
          return true; // Prevent other click handlers
        }
        return false;
      },
      preventRowClick: true
    },
    {
      key: 'currency',
      header: 'Currency',
      render: (ledger) => ledger.r_currency ? `${ledger.r_currency.currency_code} (${ledger.r_currency.type})` : 'N/A'
    },
    {
      key: 'country',
      header: 'Country',
      render: (ledger) => getCountryDisplay(ledger)
    },
    {
      key: 'description',
      header: 'Description',
      render: (ledger) => ledger.description || 'No description'
    }
  ];

  return (
    <StandardList
      data={ledgers}
      columns={columns}
      title="Ledgers"
      idField="ledger_id"
      loading={loading && ledgers.length === 0}
      onItemClick={(item) => onViewDetails(item.ledger_id)}
      onViewJson={onViewJson}
      onRefresh={onRefresh}
      searchPlaceholder="Search ledgers..."
      emptyMessage="No ledgers found"
    />
  );
};

export default LedgerList;