import React from 'react';
import { Link } from 'react-router-dom';
import { GenericListView } from '../common';
import { formatDate } from '../../utils/formatters/dateFormatters';
import { getBalanceClass, formatBalance } from '../../utils/formatters/balanceFormatters';

/**
 * Renders a list of transfers.
 *
 * Uses GenericListView to display a list of transfers with drill-through links to transfer, account, and ledger details. Supports selection, JSON view, refresh, and loading state.
 */
const TransfersList = ({ transfers, onSelectTransfer, onViewJson, onRefresh, loading }) => {
  // Define columns with drill-through links
  const columns = [
    // Transfer ID with drill link
    {
      field: 'transfer_id',
      headerName: 'ID',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
      render: item => (
        <Link to={`/transfers/${item.transfer_id}`}>{item.transfer_id}</Link>
      )
    },
    // From Account with drill link
    {
      field: 'account_id',
      headerName: 'From Account',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
      render: item => item.account_id ? (
        <Link to={`/accounts/${item.account_id}`}>{item.account_id}</Link>
      ) : 'N/A'
    },
    // To Account with drill link
    {
      field: 'to_account_id',
      headerName: 'To Account',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
      render: item => item.to_account_id ? (
        <Link to={`/accounts/${item.to_account_id}`}>{item.to_account_id}</Link>
      ) : 'N/A'
    },
    // Amount with formatting
    {
      field: 'amount',
      headerName: 'Amount',
      cellClassName: item => getBalanceClass(item.amount),
      render: item => formatBalance(item.amount, { currency_code: item.currency_code })
    },
    // Timestamp with formatting (converted from Unix timestamp)
    {
      field: 'timestamp',
      headerName: 'Date',
      cellClassName: 'text-gray-500',
      render: item => formatDate(item.timestamp, true)
    },
    // Ledger with drill link
    {
      field: 'ledger_id',
      headerName: 'Ledger',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
      render: item => item.ledger_id ? (
        <Link to={`/ledgers/${item.ledger_id}`}>{item.ledger_id}</Link>
      ) : 'N/A'
    }
  ];

  return (
    <GenericListView
      data={transfers}
      columns={columns}
      title="Transfers"
      idField="transfer_id"
      loading={loading}
      onViewJson={onViewJson}
      onRefresh={onRefresh}
      searchPlaceholder="Search transfers..."
      emptyMessage="No transfers found"
    />
  );
};

export default TransfersList;