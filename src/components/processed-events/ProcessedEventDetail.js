import React, { useMemo } from 'react';
import { DetailCard, ActionButton } from '../common';

/**
 * Component to display detailed information about a processed event
 * using the standard DetailCard component for consistency
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

  // Define actions for the detail card
  const detailActions = (
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

  // Define sections for the detail card
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

  // Additional section for transfers
  if (event.transfers && event.transfers.length > 0) {
    basicSections.push({
      label: 'Transfers',
      content: (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From Account</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Account</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {event.transfers.map((transfer, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transfer.from_account?.name || transfer.from_account_id || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transfer.to_account?.name || transfer.to_account_id || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transfer.amount || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transfer.status || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    });
  }

  // Additional section for accounts
  if (event.accounts && Object.keys(event.accounts).length > 0) {
    basicSections.push({
      label: 'Accounts',
      content: (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(event.accounts).map(([role, account], index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.name} (ID: {account.account_extra_id})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.account_code?.type || 'N/A'}: {account.account_code?.account_code || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.entity?.name || 'N/A'} 
                    {account.entity?.entity_id ? `(ID: ${account.entity.entity_id})` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    });
  }

  // Additional section for metadata
  if (event.metadata && Object.keys(event.metadata).length > 0) {
    basicSections.push({
      label: 'Metadata',
      content: (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(event.metadata).filter(([key]) => key !== 'original_event_json').map(([key, value], index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{key}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                    {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    });
  }

  return (
    <DetailCard
      title="Processed Event Details"
      subtitle={`Event ID: ${event.event_id}`}
      sections={basicSections}
      actions={detailActions}
    />
  );
};

export default ProcessedEventDetail;