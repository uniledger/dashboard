import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { GenericListView } from '../common';
import { ProcessedEventConfig } from './ProcessedEventConfig.js';
import { eventTemplateDrillCellRenderer, processedEventDrillCellRenderer } from './ProcessedEventRenderers.js';
import { eventTimestampDateCellRenderer, amountCellRenderer, fromAccountDrillCellRenderer, eventsFromLedgerDrillCellRenderer } from '../common/CellRenderers.js';
import { drillFormatter } from '../../utils/formatters/drillFormatters.js';

/**
 * Component to display a list of processed events using GenericListView
 */
const ProcessedEventsList = ({ events, onSelectEvent, onViewJson, onRefresh, loading }) => {
  const navigate = useNavigate();
  // Define columns explicitly: ID, Status, Template, Timestamp, Amount, Ledger, Metadata
  const statusCol = ProcessedEventConfig.listColumns.find(c => c.key === 'status');

   // Navigate to account detail view
   const handleViewEvent = (props) => {
    navigate(`/processed-events/${props.event_id}`);
  };
  const columns = [
    // Event ID with drill link
    {
      field: 'event_id',
      headerName: 'ID',
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
      idField="event_id"
      onRowClick={handleViewEvent}
      loading={loading}
      onViewJson={onViewJson}
      onRefresh={onRefresh}
      searchPlaceholder="Search processed events..."
      emptyMessage="No processed events found"
    />
  );
};

export default ProcessedEventsList;