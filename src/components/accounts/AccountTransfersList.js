import React from 'react';
import { GenericListView } from '../common';
import { timestampDateCellRenderer } from '../common/CellRenderers.js';
import { ledgerDrillCellRenderer } from '../ledgers/LedgerRenderers.js';
import { drillFormatter } from '../../utils/formatters/drillFormatters.js';
import { formatBalance } from '../../utils/formatters/index';

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
    },
    // From/To Account with drill link (using correct field names)
    {
      field: 'related_account',
      headerName: 'Related Account',
      cellRenderer: props => {
        const currentAccountId = parseInt(props.context.accountId, 10);
            // Determine which account ID is the related one
        let relatedAccountId;
        
        // If this account is the debit account, show the credit account as related
        if (currentAccountId === props.data.debit_account_id) {
            relatedAccountId = props.data.credit_account_id;
        } 
        // If this account is the credit account, show the debit account as related
        else if (currentAccountId === props.data.credit_account_id) {
            relatedAccountId = props.data.debit_account_id;
        }
    
    // Return the related account ID
    return drillFormatter('accounts', relatedAccountId, relatedAccountId);
      }
    },
    // Amount with formatting, showing negative for debits and positive for credits
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'rightAligned',
      cellRenderer: props => formatBalance(props.data.amount, {}),
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