import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import UnifiedListView from './UnifiedListView';
import { useDashboard } from '../../context/DashboardContext';
import apiService from '../../services/apiService';
import { ProcessedEventConfig } from './config/modelConfig';
import { getProcessedEventsColumns } from './ProcessedEventsColumnDefs';

/**
 * Test page for UnifiedListView component using processed events data
 */
const TestProcessedEventsUnifiedList = () => {
  const navigate = useNavigate();
  const { handleViewJson } = useDashboard();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create example events for testing pagination
  const createExampleEvents = useCallback(() => {
    // Create 50 example events to demonstrate pagination
    const examples = [];
    for (let i = 1; i <= 50; i++) {
      examples.push({
        event_id: `example-${i}`,
        status: i % 3 === 0 ? 'COMPLETE' : (i % 3 === 1 ? 'PENDING' : 'FAILED'),
        template: { 
          template_id: `template-${i}`, 
          name: `Template ${i}` 
        },
        timestamp: Math.floor(Date.now() / 1000) - (i * 3600),
        amount: 1000 * i,
        accounts: {
          from: { 
            account_id: `acc-${i}`, 
            name: `Account ${i}` 
          }
        }
      });
    }
    setEvents(examples);
    setLoading(false);
  }, []);

  // Fetch processed events from API
  const fetchProcessedEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.transaction.getProcessedEvents();
      if (response.ok && response.data && response.data.length > 0) {
        setEvents(response.data);
      } else {
        // If no events from API, create example data to show pagination
        createExampleEvents();
        return;
      }
    } catch (err) {
      console.error('Error fetching processed events:', err);
      setError(err.message || 'An error occurred while fetching processed events');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch events on mount
  useEffect(() => {
    fetchProcessedEvents();
  }, [fetchProcessedEvents, createExampleEvents]);

  // Use hard-coded column definitions to ensure right alignment
  const columnDefs = getProcessedEventsColumns();

  return (
    <div className="p-4 max-w-full">
      <UnifiedListView
        data={events}
        columns={columnDefs}
        title="Unified Processed Events List"
        idField="event_id"
        loading={loading}
        error={error}
        onRefresh={fetchProcessedEvents}
        onViewJson={handleViewJson}
        onRowClick={row => navigate(`/processed-events/${row.event_id}`)}
        pagination={true}
        paginationPageSize={25}
        paginationPageSizeOptions={[10,25,50,100]}
        collapsible={true}
        defaultCollapsed={false}
        collapseTitle="Show/Hide Events"
        gridHeight={500}
      />
    </div>
  );
};

export default TestProcessedEventsUnifiedList;
