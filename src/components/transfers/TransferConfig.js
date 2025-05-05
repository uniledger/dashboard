/**
 * Transfer model configuration
 */
import React from 'react';
import { formatBalance } from '../../utils/formatters';
import { formatDate } from '../../utils/formatters/dateFormatters';
import { accountOwnerCellRenderer } from '../accounts/AccountRenderers.js';

export const TransferConfig = {
  title: 'Transfer',
  idField: 'transfer_id',
  displayField: 'transfer_id',
  
  // Column definitions for list view
  listColumns: [
    {
      field: 'transfer_id',
      headerName: 'ID',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
    },
    {
      field: 'from_account_id',
      headerName: 'From Account',
      cellRenderer: accountOwnerCellRenderer,
    },
    {
      field: 'to_account_id',
      headerName: 'To Account',
      cellRenderer: accountOwnerCellRenderer,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      cellRenderer: (params) => {
        const transfer = params.data;
        return (
          <div className="text-right">
            <span>
              {formatBalance(transfer.amount, { currency_code: transfer.currency_code })}
            </span>
          </div>
        );
      }
    },
    {
      field: 'timestamp',
      headerName: 'Date',
      cellRenderer: (params) => {
        const transfer = params.data;
        return formatDate(transfer.timestamp, true);
      }
    },
    {
      field: 'ledger_id',
      headerName: 'Ledger',
      cellRenderer: ledgerNameCellRenderer,
    }
  ],
  
  // Basic section fields for detail view
  detailSections: (transfer) => [
    {
      label: 'Transfer ID',
      content: transfer.transfer_id
    },
    {
      label: 'From Account',
      content: transfer.from_account_id || 'N/A'
    },
    {
      label: 'To Account',
      content: transfer.to_account_id || 'N/A'
    },
    {
      label: 'Amount',
      content: (
        <div className="text-right">
          <span>
            {formatBalance(transfer.amount, { currency_code: transfer.currency_code })}
          </span>
        </div>
      )
    },
    {
      label: 'Timestamp',
      content: formatDate(transfer.timestamp, true)
    },
    {
      label: 'Ledger ID',
      content: transfer.ledger_id
    },
    {
      label: 'Event ID',
      content: transfer.event_id || 'N/A'
    }
  ]
};
