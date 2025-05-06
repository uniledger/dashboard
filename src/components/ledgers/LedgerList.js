import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericListView } from '../common';
import { LedgerConfig } from './LedgerConfig.js';
import useLedgers from '../../hooks/useLedgers';

/**
 * Ledger List component using GenericListView
 */
const LedgerList = () => {
  const navigate = useNavigate();
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
  
  return (
    <GenericListView
      data={ledgers}
      columns={LedgerConfig.listColumns}
      title="Ledgers"
      idField={LedgerConfig.idField}
      onRowClick={handleViewLedger}
      onRefresh={fetchLedgers}
      searchPlaceholder="Search ledgers..."
      emptyMessage="No ledgers found"
      loading={loading}
    />
  );
};

export default LedgerList;