import React from 'react';
import { Link } from 'react-router-dom';
import { GenericListView, ProcessedEventConfig } from '../common';

/**
 * Component to display a list of processed events using GenericListView
 */
const ProcessedEventsList = ({ events, onSelectEvent, onViewJson, onRefresh, loading }) => {
  // Define columns explicitly: ID, Status, Template, Timestamp, Amount, Ledger, Metadata
  const statusCol = ProcessedEventConfig.listColumns.find(c => c.key === 'status');
  const columns = [
    // Event ID with drill link
    {
      key: 'processed_event_id',
      header: 'ID',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
      render: item => item.event_id ? (
        <Link to={`/processed-events/${item.event_id}`}>{item.event_id}</Link>
      ) : 'N/A'
    },
    // Status with styled text from config
    statusCol,
    // Template: show name and id
    {
      key: 'template_id',
      header: 'Template',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
      render: item => {
        const id = item.template?.template_id || item.template_id;
        const name = item.template?.name;
        return id ? (
          <Link to={`/templates/${id}`}>{name ? `${name} (${id})` : id}</Link>
        ) : 'N/A';
      }
    },
    // Created timestamp (use event.timestamp)
    {
      key: 'timestamp',
      header: 'Created',
      cellClassName: 'text-gray-500',
      render: item => item.timestamp ? new Date(item.timestamp * 1000).toLocaleString() : 'N/A'
    },
    // Amount
    {
      key: 'amount',
      header: 'Amount',
      cellClassName: 'text-right font-medium',
      render: item => item.amount != null ? item.amount : 'N/A'
    },
    // From Account (first transfer)
    {
      key: 'from_account',
      header: 'From Account',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
      render: item => {
        const acc = item.accounts?.from;                                                                        
        if (!acc) return 'N/A';                                                                                
        const accId = acc.account_id || acc.account_extra_id;                                                  
        const accName = acc.name; 
        return accId ? (
          <Link to={`/accounts/${accId}`}>{accName ? `${accName} (${accId})` : accId}</Link>
        ) : 'N/A';
      }
    },
    // Ledger link
    {
      key: 'ledger',
      header: 'Ledger',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
      render: item => {
        // Some APIs may use nested object or direct field
        const enrichedLedger = item.accounts?.from?.enriched_ledger;
        const id = enrichedLedger?.ledger_id;
        const name = enrichedLedger?.name;
        return id ? (
          <Link to={`/ledgers/${id}`}>{name ? `${name} (${id})` : id}</Link>
        ) : 'xN/A';
      }
    }
  ];

  return (
    <GenericListView
      data={events}
      columns={columns}
      title="Processed Events"
      idField="processed_event_id"
      loading={loading}
      onViewJson={onViewJson}
      onRefresh={onRefresh}
      searchPlaceholder="Search processed events..."
      emptyMessage="No processed events found"
    />
  );
};

export default ProcessedEventsList;