import React from 'react';
import { GenericDetailView, GenericListView } from '../common';
import { ProcessedEventDetailConfig } from './ProcessedEventDetailConfig.js';
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

  // Define children sections (tables)
  const childrenSections = [];

  // Add transfers section using actual API field names
  if (event.transfers && event.transfers.length > 0) {
    childrenSections.push({
      label: 'Transfers',
      content: (
        <GenericListView
          data={event.transfers}
          columns={ProcessedEventDetailConfig.transfersColumns}
          title="Transfers"
          onRefresh={refreshTransfers}
          onViewJson={onViewJson}
          loading={false}
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
          columns={ProcessedEventDetailConfig.accountsColumns}
          onRefresh={refreshAccounts}
          onViewJson={onViewJson}
          loading={false}
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
          columns={ProcessedEventDetailConfig.metadataColumns}
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
            title="Other Properties"            
            onRefresh={refreshMetadata}
            onViewJson={onViewJson}
            loading={false}
            columns={ProcessedEventDetailConfig.metadataColumns}
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
      sections={ProcessedEventDetailConfig.basicSections(event)}
      childrenSections={childrenSections}
      onBack={onBack}
      onViewJson={onViewJson}
    />
  );
};

export default ProcessedEventDetail;