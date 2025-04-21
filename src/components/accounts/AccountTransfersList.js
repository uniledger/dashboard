import React from 'react';
import { Link } from 'react-router-dom';
import { StandardList } from '../common';
import { formatDate } from '../../utils/formatters/dateFormatters';
import { getBalanceClass, formatBalance } from '../../utils/formatters/balanceFormatters';

/**
 * Component to display transfers for an account
 */
const AccountTransfersList = ({ transfers, accountId, onViewJson }) => {
  const columns = [
    // Transfer ID (using 'id' field from response)
    {
      key: 'id',
      header: 'ID',
      cellClassName: 'text-gray-700 font-medium',
      render: item => item.id ? item.id.toString() : 'N/A'
    },
    // From/To Account with drill link (using correct field names)
    {
      key: 'related_account',
      header: 'Related Account',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
      render: (item) => {
        // Parse the accountId as number to ensure comparison works (it might be a string from URL params)
        const currentAccountId = parseInt(accountId, 10);
        
        // Determine which account ID is the related one
        let relatedAccountId;
        
        // If this account is the debit account, show the credit account as related
        if (currentAccountId === item.debit_account_id) {
          relatedAccountId = item.credit_account_id;
        } 
        // If this account is the credit account, show the debit account as related
        else if (currentAccountId === item.credit_account_id) {
          relatedAccountId = item.debit_account_id;
        }
        
        return relatedAccountId ? (
          <Link to={`/accounts/${relatedAccountId}`}>{relatedAccountId}</Link>
        ) : 'N/A';
      }
    },
    // Amount with formatting, showing negative for debits and positive for credits
    {
      key: 'amount',
      header: 'Amount',
      cellClassName: (item) => {
        // If this account is the debit account, show negative amount
        const isDebit = item.debit_account_id === parseInt(accountId, 10);
        const amount = isDebit ? -Math.abs(item.amount) : Math.abs(item.amount);
        return getBalanceClass(amount);
      },
      render: (item) => {
        // If this account is the debit account, show negative amount
        const isDebit = item.debit_account_id === parseInt(accountId, 10);
        const amount = isDebit ? -Math.abs(item.amount) : Math.abs(item.amount);
        
        // Get currency from the item, default to generic formatting if not available
        return formatBalance(amount, {});
      }
    },
    // Timestamp with formatting (converted from Unix timestamp in nanoseconds)
    {
      key: 'timestamp',
      header: 'Date',
      cellClassName: 'text-gray-500',
      render: item => {
        if (!item.timestamp) return 'N/A';
        
        // Convert nanoseconds to milliseconds (divide by 1,000,000)
        // Then convert to seconds for formatDate (divide by 1000)
        const seconds = Math.floor(item.timestamp / 1000000) / 1000;
        return formatDate(seconds, true);
      }
    },
    // Ledger with drill link (using correct 'ledger' field)
    {
      key: 'ledger',
      header: 'Ledger',
      cellClassName: item => item.ledger ? 'text-blue-600 hover:underline cursor-pointer font-medium' : 'text-gray-500',
      render: item => {
        if (!item.ledger) return 'N/A';
        return <Link to={`/ledgers/${item.ledger}`}>{item.ledger}</Link>;
      }
    },
    // Actions column with View JSON button
    {
      key: 'actions',
      header: 'Actions',
      cellClassName: 'text-right',
      render: item => (
        <button
          className="text-blue-600 hover:text-blue-800 text-sm"
          onClick={() => onViewJson && onViewJson(item, `Transfer ${item.id}`)}
        >
          View JSON
        </button>
      )
    }
  ];

  // Calculate appropriate grid height based on number of transfers
  // Allow it to grow with more transfers, with a minimum height
  const gridHeight = Math.max(300, Math.min(transfers.length * 48, 600));

  return (
    <div className="bg-white rounded-lg shadow">
      <StandardList
        title="Account Transfers"
        data={transfers || []}
        columns={columns}
        idField="id"
        emptyMessage="No transfers found for this account"
        gridHeight={gridHeight}
      />
    </div>
  );
};

export default AccountTransfersList;