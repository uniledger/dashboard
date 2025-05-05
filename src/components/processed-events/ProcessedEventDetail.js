import React from 'react';
import { GenericDetailView, GenericListView } from '../common';
import { Link } from 'react-router-dom';
import { accountTypeCellRenderer } from '../accounts/AccountRenderers.js';
import { enrichedEntityDrillCellRenderer } from '../entities/EntityRenderers.js';

/**
 * Component to display detailed information about a processed event
 * using the GenericDetailView component for consistency
 */
const ProcessedEventDetail = ({ event, onBack, onViewJson }) => {
  
  // Return null if no event is provided
  if (!event) return null;

  // Create specific refresh functions for each data section
  const refreshTransfers = () => {
    // This would call an API to refresh transfers
    console.log("Refreshing transfers for event", event.event_id);
    return Promise.resolve(); // Return promise for loading state
  };
  
  const refreshAccounts = () => {
    // This would call an API to refresh accounts
    console.log("Refreshing accounts for event", event.event_id);
    return Promise.resolve(); // Return promise for loading state
  };
  
  const refreshMetadata = () => {
    // This would call an API to refresh metadata
    console.log("Refreshing metadata for event", event.event_id);
    return Promise.resolve(); // Return promise for loading state
  };

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
      content: () => {
        const enrichedLedger = event.accounts?.from?.enriched_ledger;
    
        // If enrichedLedger exists, display its core info. Otherwise 'N/A'.
        return enrichedLedger ? (
          <div>
            {/* Assume ID and Name are present if enrichedLedger is */}
            <p><span className="font-medium">ID:</span> {enrichedLedger.ledger_id}</p>
            <p><span className="font-medium">Name:</span> {enrichedLedger.name}</p>
    
            {/* Still check for optional description */}
            {enrichedLedger.description && (
              <p><span className="font-medium">Description:</span> {enrichedLedger.description}</p>
            )}
    
            {/* Still need to check for r_currency before accessing its properties */}
            {enrichedLedger.r_currency && (
              <p>
                <span className="font-medium">Currency:</span> {enrichedLedger.r_currency.currency_code}
                (Scale: {enrichedLedger.r_currency.scale})
              </p>
            )}
          </div>
        ) : 'N/A'; // Fallback if enrichedLedger is null/undefined
      }
    }
  ];

  // Define children sections (tables)
  const childrenSections = [];

  // Add transfers section using actual API field names
  if (event.transfers && event.transfers.length > 0) {
    childrenSections.push({
      label: 'Transfers',
      content: (
        <GenericListView
          data={event.transfers}
          title="Transfers"
          onRefresh={refreshTransfers}
          onViewJson={onViewJson}
          loading={false}
          columns={[
            {
              field: 'debit_account_id',
              headerName: 'From Account',
              cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
              render: t => <Link to={`/accounts/${t.debit_account_id}`}>{t.debit_account_id}</Link>
            },
            {
              field: 'credit_account_id',
              headerName: 'To Account',
              cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
              render: t => <Link to={`/accounts/${t.credit_account_id}`}>{t.credit_account_id}</Link>
            },
            {
              field: 'amount',
              headerName: 'Amount',
              cellClassName: 'text-right font-medium',
              render: t => t.amount
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
        <GenericListView
          data={accountsArray}
          title="Accounts"
          onRefresh={refreshAccounts}
          onViewJson={onViewJson}
          loading={false}
          columns={[
            {
              field: 'role',
              headerName: 'Role',
              cellClassName: 'font-medium text-gray-900'
            },
            {
              field: 'name',
              headerName: 'Account',
              render: (row) => `${row.name} (ID: ${row.account_extra_id})`
            },
            {
              field: 'account_code',
              headerName: 'Type',
              cellRenderer: accountTypeCellRenderer
            },
            {
              field: 'entity',
              headerName: 'Entity',
              cellRenderer: enrichedEntityDrillCellRenderer
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
        <GenericListView
          data={metadataArray}
          title="Metadata"
          onRefresh={refreshMetadata}
          onViewJson={onViewJson}
          loading={false}
          columns={[
            {
              field: 'key',
              headerName: 'Key',
              cellClassName: 'font-medium text-gray-900'
            },
            {
              field: 'value',
              headerName: 'Value',
              cellClassName: 'whitespace-normal text-gray-500'
            }
          ]}
          emptyMessage="No metadata found"
        />
      )
    });
  }
  
  // Add any other top-level properties dynamically
  (() => {
    const omit = new Set([
      'event_id', 'template_id', 'amount', 'timestamp', 'ledger',
      'transfers', 'accounts', 'metadata', 'original_event', 'parsedOriginalEvent'
    ]);
    const extras = Object.entries(event)
      .filter(([key]) => !omit.has(key) && event[key] != null)
      .map(([key, value]) => ({
        key,
        value: typeof value === 'object'
          ? JSON.stringify(value, null, 2)
          : String(value)
      }));
    if (extras.length > 0) {
      childrenSections.push({
        label: 'Other Properties',
        content: (
          <GenericListView
            data={extras}
            title=""            
            onRefresh={refreshMetadata}
            onViewJson={onViewJson}
            loading={false}
            columns={[
              { field: 'key', header: 'Property', cellClassName: 'font-medium text-gray-900' },
              { field: 'value', header: 'Value', cellClassName: 'whitespace-pre-wrap text-gray-700' }
            ]}
            emptyMessage="No additional properties"
          />
        )
      });
    }
  })();

  return (
    <GenericDetailView
      data={event}
      title="Processed Event Detail"
      subtitle={`Event ID: ${event.event_id}`}
      sections={basicSections}
      childrenSections={childrenSections}
      onBack={onBack}
      onViewJson={onViewJson}
    />
  );
};

export default ProcessedEventDetail;