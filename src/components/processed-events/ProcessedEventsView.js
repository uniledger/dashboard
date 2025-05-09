import React, { useState, useEffect } from 'react';
import { ErrorAlert } from '../common';
import ProcessedEventsList from './ProcessedEventsList';
import apiService from '../../services/apiService';

/**
 * Main component for the Processed Events view/tab.
 * Fetches and displays a list of processed events using `ProcessedEventsList`.
 * Handles loading and error states for the data fetching operation.
 * 
 * @param {Object} props - Component props.
 * @param {function} props.onViewJson - Callback function passed to child components for viewing JSON data.
 * @returns {JSX.Element} The rendered ProcessedEventsView component.
 */
const ProcessedEventsView = ({ onViewJson }) => {
  const [events, setEvents] = useState([]);
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
      const response = await apiService.transaction.getProcessedEvents();
      if (response.ok && response.data) {
        setEvents(response.data);
      } else {
        console.error('Failed to fetch processed events:', response.error);
        setError(response.error?.message || 'Failed to fetch processed events');
        setEvents([]);
      }
    } catch (err) {
      console.error('Error fetching processed events:', err);
      setError(err.message || 'An error occurred while fetching processed events');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for list item JSON/view events are handled by Link in list

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

  // Always render the list; detail views are now handled by router at /processed-events/:eventId
  return (
    <ProcessedEventsList
      events={events}
      onViewJson={onViewJson}
      onRefresh={fetchProcessedEvents}
      loading={isLoading}
    />
  );
};

export default ProcessedEventsView;