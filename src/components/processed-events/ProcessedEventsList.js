import React, { useState } from 'react';

/**
 * Component to display a list of processed events
 */
const ProcessedEventsList = ({ events, onSelectEvent, onViewJson, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter events based on search query (by event_id or template_id)
  const filteredEvents = events.filter(event => 
    (event.event_id && event.event_id.toString().includes(searchQuery)) ||
    (event.template_id && event.template_id.toString().includes(searchQuery))
  );

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex justify-between items-center flex-wrap sm:flex-nowrap">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Processed Events</h3>
            <p className="mt-1 text-sm text-gray-500">
              Browse all processed events
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by ID..."
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
      <ul className="divide-y divide-gray-200">
        {filteredEvents.map((event) => (
          <li key={event.event_id}>
            <div className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      Event ID: {event.event_id}
                    </p>
                    <p className="text-sm text-gray-500">
                      Template ID: {event.template_id}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 space-x-2">
                    <button
                      onClick={() => onViewJson(event, `Event ${event.event_id}`)}
                      className="px-3 py-1 border border-gray-300 text-xs rounded-md hover:bg-gray-50"
                    >
                      View JSON
                    </button>
                    <button
                      onClick={() => onSelectEvent(event)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-md hover:bg-blue-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Amount: {event.amount} | Ledger: {event.ledger?.name || event.ledger?.ledger_id || 'N/A'}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      {event.timestamp 
                        ? `Processed: ${new Date(event.timestamp * 1000).toLocaleString()}` 
                        : 'Timestamp: N/A'}
                    </p>
                  </div>
                </div>
                {/* Show metadata tags if available */}
                {event.metadata && Object.keys(event.metadata).length > 0 && (
                  <div className="mt-2 flex flex-wrap">
                    {Object.entries(event.metadata).map(([key, value], index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2 mb-1"
                      >
                        {key}: {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
        {filteredEvents.length === 0 && (
          <li>
            <div className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No processed events found.
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ProcessedEventsList;