import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProcessedEventDetail from './ProcessedEventDetail';
import apiService from '../../services/apiService';
import { LoadingSpinner, ErrorAlert } from '../common';

/**
 * Page component for router-based processed event detail view.
 * Fetches the list of processed events and finds the one matching the :eventId param.
 */
const ProcessedEventDetailPage = ({ onViewJson }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await apiService.transaction.getProcessedEvents();
        if (resp.ok && Array.isArray(resp.data)) {
        const found = resp.data.find(e => String(e.event_id) === String(eventId));
          if (found) {
            setEvent(found);
          } else {
            throw new Error(`Processed event not found: ${eventId}`);
          }
        } else {
          throw new Error(resp.error?.message || 'Failed to load processed events');
        }
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  // Show loading indicator
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading processed event..." />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="mb-6">
        <ErrorAlert error={error} onRetry={() => navigate('/processed-events')} />
      </div>
    );
  }

  // Render detail if event is loaded
  return (
    <ProcessedEventDetail
      event={event}
      onBack={() => navigate('/processed-events')}
      onViewJson={onViewJson}
    />
  );
};

export default ProcessedEventDetailPage;