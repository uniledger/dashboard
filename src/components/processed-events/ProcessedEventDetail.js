import React from 'react';

/**
 * Component to display detailed information about a processed event
 */
const ProcessedEventDetail = ({ event, onBack, onViewJson }) => {
  if (!event) return null;

  // Helper function to format account information
  const formatAccount = (accountObj) => {
    if (!accountObj) return 'N/A';
    
    const name = accountObj.name || 'Unnamed Account';
    const id = accountObj.account_extra_id || 'Unknown ID';
    const balance = typeof accountObj.balance === 'number' ? accountObj.balance : 'N/A';
    
    return `${name} (ID: ${id}) - Balance: ${balance}`;
  };

  // Extract the original event if available in metadata
  const originalEvent = event.metadata && event.metadata.original_event_json 
    ? event.metadata.original_event_json 
    : event.original_event || null;
    
  // Try to parse the originalEvent if it's a string
  const parsedOriginalEvent = React.useMemo(() => {
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
  }, [originalEvent]);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Processed Event Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Event ID: {event.event_id}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to List
          </button>
          <button
            onClick={() => onViewJson(event, `Event ${event.event_id}`)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View JSON
          </button>
          {parsedOriginalEvent && (
            <button
              onClick={() => onViewJson(parsedOriginalEvent, `Original Event ${event.event_id}`)}
              className="px-4 py-2 border border-blue-300 bg-blue-50 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              View Event JSON
            </button>
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Event ID</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{event.event_id}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Template ID</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{event.template_id}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Amount</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{event.amount}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Timestamp</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {event.timestamp 
                ? new Date(event.timestamp * 1000).toLocaleString() 
                : 'N/A'}
            </dd>
          </div>
          
          {/* Ledger Information */}
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Ledger</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {event.ledger ? (
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
              ) : 'N/A'}
            </dd>
          </div>
          
          {/* Transfers Information */}
          {event.transfers && event.transfers.length > 0 && (
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Transfers</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
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
              </dd>
            </div>
          )}
          
          {/* Accounts Information */}
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Accounts</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {event.accounts && Object.keys(event.accounts).length > 0 ? (
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
              ) : (
                <p>No account information available</p>
              )}
            </dd>
          </div>
          
          {/* Metadata */}
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Metadata</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {event.metadata && Object.keys(event.metadata).length > 0 ? (
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
              ) : (
                <p>No metadata available</p>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ProcessedEventDetail;