import React, { useMemo } from 'react';
import { GenericDetailView, ActionButton, DataTableSection } from '../common';

/**
 * Component to display detailed information about a processed event
 * using the GenericDetailView component for consistency
 */
const ProcessedEventDetail = ({ event, onBack, onViewJson }) => {
  // Parse original event JSON if available
  // We need to call useMemo before any conditional returns to follow React Hooks rules
  const parsedOriginalEvent = useMemo(() => {
    if (!event) return null;
    
    // Extract the original event if available in metadata
    const originalEvent = event.metadata && event.metadata.original_event_json 
      ? event.metadata.original_event_json 
      : event.original_event || null;
      
    if (!originalEvent) return null;
    
    if (typeof originalEvent === 'string') {
      try {
        return JSON.parse(originalEvent);
      } catch (err) {
        console.error('Error parsing original event JSON:', err);
        return null;
      }
    }
    return originalEvent;
  }, [event]);
  
  // Return null if no event is provided
  if (!event) return null;

  // Define custom actions for the detail view
  const customActions = (
    <>
      <ActionButton
        variant="outline"
        onClick={() => onViewJson(event, `Event ${event.event_id}`)}
      >
        View JSON
      </ActionButton>
      {parsedOriginalEvent && (
        <ActionButton
          variant="outline"
          onClick={() => onViewJson(parsedOriginalEvent, `Original Event ${event.event_id}`)}
        >
          View Event JSON
        </ActionButton>
      )}
      <ActionButton
        variant="secondary"
        onClick={onBack}
      >
        Back
      </ActionButton>
    </>
  );

  // Define basic sections for the detail view
  const basicSections = [
    {
      label: 'Event ID',
      content: event.event_id
    },
    {
      label: 'Template ID',
      content: event.template_id
    },
    {
      label: 'Amount',
      content: event.amount
    },
    {
      label: 'Timestamp',
      content: event.timestamp 
        ? new Date(event.timestamp * 1000).toLocaleString() 
        : 'N/A'
    },
    {
      label: 'Ledger',
      content: event.ledger ? (
        <div>
          <p><span className="font-medium">ID:</span> {event.ledger.ledger_id}</p>
          <p><span className="font-medium">Name:</span> {event.ledger.name}</p>
          <p><span className="font-medium">Description:</span> {event.ledger.description}</p>
          {event.ledger.r_currency && (
            <p>
              <span className="font-medium">Currency:</span> {event.ledger.r_currency.currency_code} 
              (Scale: {event.ledger.r_currency.scale})
            </p>
          )}
        </div>
      ) : 'N/A'
    }
  ];

  // Define children sections (tables)
  const childrenSections = [];

  // Add transfers section if available
  if (event.transfers && event.transfers.length > 0) {
    childrenSections.push({
      label: 'Transfers',
      content: (
        <DataTableSection
          data={event.transfers}
          title="Transfers"
          columns={[
            {
              key: 'from_account',
              header: 'From Account',
              render: (transfer) => transfer.from_account?.name || transfer.from_account_id || 'N/A'
            },
            {
              key: 'to_account',
              header: 'To Account',
              render: (transfer) => transfer.to_account?.name || transfer.to_account_id || 'N/A'
            },
            {
              key: 'amount',
              header: 'Amount',
              render: (transfer) => transfer.amount || 'N/A'
            },
            {
              key: 'status',
              header: 'Status',
              render: (transfer) => transfer.status || 'N/A'
            }
          ]}
          emptyMessage="No transfers found"
        />
      )
    });
  }

  // Add accounts section if available
  if (event.accounts && Object.keys(event.accounts).length > 0) {
    // Convert accounts object to array for DataTableSection
    const accountsArray = Object.entries(event.accounts).map(([role, account]) => ({
      role,
      ...account
    }));

    childrenSections.push({
      label: 'Accounts',
      content: (
        <DataTableSection
          data={accountsArray}
          title="Accounts"
          columns={[
            {
              key: 'role',
              header: 'Role',
              cellClassName: 'font-medium text-gray-900'
            },
            {
              key: 'name',
              header: 'Account',
              render: (row) => `${row.name} (ID: ${row.account_extra_id})`
            },
            {
              key: 'account_code',
              header: 'Type',
              render: (row) => `${row.account_code?.type || 'N/A'}: ${row.account_code?.account_code || 'N/A'}`
            },
            {
              key: 'entity',
              header: 'Entity',
              render: (row) => row.entity?.name ? `${row.entity.name} ${row.entity?.entity_id ? `(ID: ${row.entity.entity_id})` : ''}` : 'N/A'
            }
          ]}
          emptyMessage="No accounts found"
        />
      )
    });
  }

  // Add metadata section if available
  if (event.metadata && Object.keys(event.metadata).length > 0) {
    // Convert metadata object to array for DataTableSection, excluding original_event_json
    const metadataArray = Object.entries(event.metadata)
      .filter(([key]) => key !== 'original_event_json')
      .map(([key, value]) => ({
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : value.toString()
      }));

    childrenSections.push({
      label: 'Metadata',
      content: (
        <DataTableSection
          data={metadataArray}
          title="Metadata"
          columns={[
            {
              key: 'key',
              header: 'Key',
              cellClassName: 'font-medium text-gray-900'
            },
            {
              key: 'value',
              header: 'Value',
              cellClassName: 'whitespace-normal text-gray-500'
            }
          ]}
          emptyMessage="No metadata found"
        />
      )
    });
  }

  return (
    <GenericDetailView
      data={event}
      title="Processed Event Detail"
      subtitle={`Event ID: ${event.event_id}`}
      sections={basicSections}
      childrenSections={childrenSections}
      onBack={onBack}
      onViewJson={onViewJson}
      customActions={customActions}
    />
  );
};

export default ProcessedEventDetail;