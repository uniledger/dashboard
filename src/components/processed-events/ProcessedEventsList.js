import React from 'react';
import { Link } from 'react-router-dom';
import { GenericListView, ProcessedEventConfig } from '../common';
import { eventTemplateDrillCellRenderer, processedEventDrillCellRenderer, eventTimestampDateCellRenderer, fromAccountDrillCellRenderer, eventsFromLedgerDrillCellRenderer, amountCellRenderer } from '../common/CellRenderers';

/**
 * Component to display a list of processed events using GenericListView
 */
const ProcessedEventsList = ({ events, onSelectEvent, onViewJson, onRefresh, loading }) => {
  // Define columns explicitly: ID, Status, Template, Timestamp, Amount, Ledger, Metadata
  const statusCol = ProcessedEventConfig.listColumns.find(c => c.key === 'status');
  const columns = [
    // Event ID with drill link
    {
      field: 'processed_event_id',
      headerName: 'ID',
      cellRenderer: processedEventDrillCellRenderer,
    },
    {
      field: 'status',
      headerName: 'Status',
      cellClassName: (item) => {
        return item.status === 'COMPLETED' 
          ? 'text-green-600 font-medium' 
          : item.status === 'FAILED' 
            ? 'text-red-600 font-medium' 
            : 'text-yellow-600 font-medium';
      }
    },
    {
      field: 'template_id',
      headerName: 'Template',
      cellRenderer: eventTemplateDrillCellRenderer,
    },
    // Created timestamp (use event.timestamp)
    {
      field: 'timestamp',
      headerName: 'Created',
      cellRenderer: eventTimestampDateCellRenderer,
    },
    // Amount
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'rightAligned',
      cellRenderer: amountCellRenderer,
    },
    // From Account (first transfer)
    {
      field: 'from_account',
      headerName: 'From Account',
      cellRenderer: fromAccountDrillCellRenderer,
    },
    // Ledger link
    {
      field: 'ledger',
      headerName: 'Ledger',
      cellRenderer: eventsFromLedgerDrillCellRenderer,
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