import React, { useState, useEffect } from 'react';
import ProcessedEventsList from './ProcessedEventsList';
import ProcessedEventDetail from './ProcessedEventDetail';

// Helper function to create CORS-compatible fetch requests
const corsFetch = async (url, options = {}) => {
  const corsProxyUrl = 'https://corsproxy.io/?';
  const encodedUrl = encodeURIComponent(url);
  const proxyUrl = `${corsProxyUrl}${encodedUrl}`;
  
  return fetch(proxyUrl, options);
};

const TRANSACTIONS_API_BASE_URL = 'https://transactions.dev.ledgerrocket.com';

/**
 * Main component for the Processed Events tab
 */
const ProcessedEventsView = ({ onViewJson }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState('list'); // 'list' or 'detail'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch processed events on component mount
  useEffect(() => {
    fetchProcessedEvents();
  }, []);

  // Fetch processed events from the API
  const fetchProcessedEvents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await corsFetch(`${TRANSACTIONS_API_BASE_URL}/api/v1/processed-events/`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch processed events: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setEvents(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching processed events:', err);
      setError(err.message || 'An error occurred while fetching processed events');
      setIsLoading(false);
    }
  };

  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setView('detail');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading processed events...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white shadow sm:rounded-lg p-6">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <button 
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={fetchProcessedEvents}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {view === 'list' && (
        <ProcessedEventsList 
          events={events}
          onSelectEvent={handleSelectEvent}
          onViewJson={onViewJson}
          onRefresh={fetchProcessedEvents}
        />
      )}
      
      {view === 'detail' && selectedEvent && (
        <ProcessedEventDetail 
          event={selectedEvent}
          onBack={() => setView('list')}
          onViewJson={onViewJson}
        />
      )}
    </div>
  );
};

export default ProcessedEventsView;