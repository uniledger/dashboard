import React from 'react';
import { GenericListView } from '../common';
import { genericIDCellRenderer, timestampDateCellRenderer } from '../common/CellRenderers.js';
import { relatedAccountDrillCellRenderer, transferBalanceCellRenderer } from './AccountRenderers.js';
import { ledgerDrillCellRenderer } from '../ledgers/LedgerRenderers.js';

/**
 * Component to display transfers for an account
 */
const AccountTransfersList = ({ transfers, accountId, onViewJson, onRefresh, loading = false }) => {

  const accountContext  = { accountId };
  accountContext.accountId = accountId;

  
  const columns = [
    // Transfer ID (using 'id' field from response)
    {
      field: 'id',
      headerName: 'ID',
      cellRenderer: genericIDCellRenderer,
    },
    // From/To Account with drill link (using correct field names)
    {
      field: 'related_account',
      headerName: 'Related Account',
      cellRenderer: relatedAccountDrillCellRenderer,
    },
    // Amount with formatting, showing negative for debits and positive for credits
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'rightAligned',
      cellRenderer: transferBalanceCellRenderer,
    },
    // Timestamp with formatting (converted from Unix timestamp in nanoseconds)
    {
      field: 'timestamp',
      headerName: 'Date',
      cellRenderer: timestampDateCellRenderer,
    },
    // Ledger with drill link (using correct 'ledger' field)
    {
      field: 'ledger',
      headerName: 'Ledger',
      cellRenderer: ledgerDrillCellRenderer,
    }
  ];

  // Calculate appropriate grid height based on number of transfers
  // Allow it to grow with more transfers, with a minimum height
  const gridHeight = Math.max(300, Math.min(transfers.length * 48, 600));

  return (
    <div className="bg-white rounded-lg shadow">
      <GenericListView
        title="Account Transfers"
        data={transfers || []}
        columns={columns}
        context={accountContext}
        idField="id"
        emptyMessage="No transfers found for this account"
        gridHeight={gridHeight}
        onViewJson={onViewJson}
        onRefresh={onRefresh}
        loading={loading}
      />
    </div>
  );
};

export default AccountTransfersList;