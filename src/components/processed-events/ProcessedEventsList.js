import React from 'react';
import { GenericListView, ProcessedEventConfig } from '../common';

/**
 * Component to display a list of processed events using GenericListView
 */
const ProcessedEventsList = ({ events, onSelectEvent, onViewJson, onRefresh, loading }) => {
  // Define custom columns that extend the base configuration
  const columns = [
    ...ProcessedEventConfig.listColumns,
    {
      key: 'metadata',
      header: 'Metadata',
      cellClassName: 'text-gray-500',
      render: (event) => {
        if (!event.metadata || Object.keys(event.metadata).length === 0) {
          return null;
        }
        
        return (
          <div className="flex flex-wrap">
            {Object.entries(event.metadata).map(([key, value], index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2 mb-1"
              >
                {key}: {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
              </span>
            ))}
          </div>
        );
      }
    }
  ];

  return (
    <GenericListView
      data={events}
      columns={columns}
      title="Processed Events"
      idField={ProcessedEventConfig.idField}
      loading={loading}
      onItemClick={onSelectEvent}
      onViewJson={onViewJson}
      onRefresh={onRefresh}
      searchPlaceholder="Search processed events..."
      emptyMessage="No processed events found"
    />
  );
};

export default ProcessedEventsList;