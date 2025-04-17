import React, { useState, useEffect } from 'react';
import { LoadingSpinner, ErrorAlert } from '../common';
import ProcessedEventsList from './ProcessedEventsList';
import ProcessedEventDetail from './ProcessedEventDetail';
import apiService from '../../services/apiService';

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
      const data = await apiService.transaction.getProcessedEvents();
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

  // Handle back button click
  const handleBack = () => {
    setSelectedEvent(null);
    setView('list');
  };

  // Error state
  if (error) {
    return (
      <div className="mb-6">
        <ErrorAlert 
          error={error} 
          onRetry={fetchProcessedEvents} 
        />
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
          loading={isLoading}
        />
      )}
      
      {view === 'detail' && selectedEvent && (
        <ProcessedEventDetail 
          event={selectedEvent}
          onBack={handleBack}
          onViewJson={onViewJson}
        />
      )}
    </div>
  );
};

export default ProcessedEventsView;