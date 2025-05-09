import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericListView } from '../common';
import { LedgerConfig } from './LedgerConfig.js';
import useLedgers from '../../hooks/useLedgers';

/**
 * Renders a list of ledgers.
 *
 * Uses the GenericListView component to display ledger data. Utilizes the useLedgers hook to fetch and manage ledger data and handles navigation to the detailed view of a ledger when a row is clicked. The list configuration (columns, etc.) is sourced from LedgerConfig. This component does not take any direct props.
 *
 * @returns {JSX.Element} The rendered LedgerList component.
 */
const LedgerList = () => {
  const navigate = useNavigate();
  const { ledgers, loading, fetchLedgers } = useLedgers();
  
  useEffect(() => {
    fetchLedgers();
  }, [fetchLedgers]);
  
  /**
   * Handles the navigation to a ledger's detail view.
   *
   * @param {Object|string} ledger - The ledger object or ledger ID.
   */
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