import React from 'react';
import { StandardList } from '../common';

/**
 * Component to display a list of processed events using StandardList
 */
const ProcessedEventsList = ({ events, onSelectEvent, onViewJson, onRefresh }) => {
  // Define columns for the DataTable
  const columns = [
    {
      key: 'event_id',
      header: 'Event ID',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
      render: (event) => `Event ID: ${event.event_id}`
    },
    {
      key: 'template_id',
      header: 'Template ID',
      cellClassName: 'text-gray-500',
    },
    {
      key: 'amount',
      header: 'Amount',
      cellClassName: 'text-gray-500',
      render: (event) => {
        let ledgerInfo = '';
        if (event.ledger) {
          ledgerInfo = event.ledger.name || event.ledger.ledger_id || 'N/A';
        }
        return `Amount: ${event.amount} | Ledger: ${ledgerInfo}`;
      }
    },
    {
      key: 'timestamp',
      header: 'Processed',
      cellClassName: 'text-gray-500',
      render: (event) => event.timestamp 
        ? new Date(event.timestamp * 1000).toLocaleString()
        : 'Timestamp: N/A'
    },
    {
      key: 'metadata',
      header: 'Metadata',
      cellClassName: 'text-gray-500',
      render: (event) => {
        if (!event.metadata || Object.keys(event.metadata).length === 0) {
          return null;
        }
        
        return (
          <div className="flex flex-wrap">
            {Object.entries(event.metadata).map(([key, value], index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2 mb-1"
              >
                {key}: {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
              </span>
            ))}
          </div>
        );
      }
    }
  ];

  return (
    <StandardList
      data={events}
      columns={columns}
      title="Processed Events"
      idField="event_id"
      onItemClick={onSelectEvent}
      onViewJson={onViewJson}
      onRefresh={onRefresh}
      searchPlaceholder="Search by ID..."
      emptyMessage="No processed events found"
    />
  );
};

export default ProcessedEventsList;