import React from 'react';
import { Link } from 'react-router-dom';
import { GenericDetailView } from '../common';
import { formatDate } from '../../utils/formatters/dateFormatters';
import { getBalanceClass, formatBalance } from '../../utils/formatters/balanceFormatters';

/**
 * Component to display details of a transfer
 */
const TransferDetail = ({ 
  transfer, 
  loading, 
  error, 
  onBack, 
  onRefresh, 
  onViewJson 
}) => {
  if (!transfer) {
    return (
      <div className="p-4 text-center">
        <div className="text-gray-500">Select a transfer to view details</div>
        {onBack && (
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={onBack}
          >
            Back to Transfers
          </button>
        )}
      </div>
    );
  }

  // Define sections with formatted data and links
  const sections = [
    {
      label: 'Transfer ID',
      content: transfer.transfer_id
    },
    {
      label: 'From Account',
      content: transfer.account_id ? (
        <Link 
          to={`/accounts/${transfer.account_id}`}
          className="text-blue-600 hover:underline"
        >
          {transfer.account_id}
        </Link>
      ) : 'N/A'
    },
    {
      label: 'To Account',
      content: transfer.to_account_id ? (
        <Link 
          to={`/accounts/${transfer.to_account_id}`}
          className="text-blue-600 hover:underline"
        >
          {transfer.to_account_id}
        </Link>
      ) : 'N/A'
    },
    {
      label: 'Amount',
      content: (
        <div className="text-right">
          <span className={getBalanceClass(transfer.amount)}>
            {formatBalance(transfer.amount, { currency_code: transfer.currency_code })}
          </span>
        </div>
      )
    },
    {
      label: 'Currency',
      content: transfer.currency_code || 'N/A'
    },
    {
      label: 'Timestamp',
      content: formatDate(transfer.timestamp, true)
    },
    {
      label: 'Ledger',
      content: transfer.ledger_id ? (
        <Link 
          to={`/ledgers/${transfer.ledger_id}`}
          className="text-blue-600 hover:underline"
        >
          {transfer.ledger_id}
        </Link>
      ) : 'N/A'
    },
    {
      label: 'Event ID',
      content: transfer.event_id ? (
        <Link 
          to={`/processed-events/${transfer.event_id}`}
          className="text-blue-600 hover:underline"
        >
          {transfer.event_id}
        </Link>
      ) : 'N/A'
    },
    {
      label: 'Metadata',
      content: transfer.metadata ? JSON.stringify(transfer.metadata, null, 2) : 'None'
    }
  ];

  return (
    <GenericDetailView
      data={transfer}
      title="Transfer Detail"
      subtitle={`ID: ${transfer.transfer_id}`}
      sections={sections}
      loading={loading}
      error={error}
      onBack={onBack}
      onRefresh={onRefresh}
      onViewJson={onViewJson}
    />
  );
};

export default TransferDetail;