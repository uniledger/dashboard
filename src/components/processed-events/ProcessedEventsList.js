import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericListView } from '../common';
import { processedEventsListViewColumns } from './ProcessedEventsListConfig.js';

/**
 * Component to display a list of processed events using `GenericListView`.
 * Handles navigation to the detail view of a selected event.
 * 
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.events - The array of processed event objects to display.
 * @param {function} props.onSelectEvent - Callback function when an event row is selected (deprecated, navigation handled internally).
 * @param {function} props.onViewJson - Callback function to handle viewing the event JSON.
 * @param {function} props.onRefresh - Callback function to refresh the list of events.
 * @param {boolean} props.loading - Boolean indicating if the events data is currently loading.
 * @returns {JSX.Element} The rendered ProcessedEventsList component.
 */
const ProcessedEventsList = ({ events, onSelectEvent, onViewJson, onRefresh, loading }) => {
  const navigate = useNavigate();

  // Navigate to account detail view
  const handleViewEvent = (props) => {
    navigate(`/processed-events/${props.event_id}`);
  };

  return (
    <GenericListView
      data={events}
      columns={processedEventsListViewColumns}
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