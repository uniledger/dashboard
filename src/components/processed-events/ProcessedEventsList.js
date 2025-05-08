import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericListView } from '../common';
import { processedEventsListViewColumns } from './ProcessedEventsListConfig.js';

/**
 * Component to display a list of processed events using GenericListView
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