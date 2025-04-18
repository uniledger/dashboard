import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

/**
 * Custom hook for fetching and managing transactions data
 * @returns {Object} - Templates, events, and helper functions
 */
const useTransactions = () => {
  // Templates state
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Loading and error states
  const [loading, setLoading] = useState({
    templates: false,
    events: false,
    submission: false
  });
  
  const [error, setError] = useState({
    templates: null,
    events: null,
    submission: null
  });

  /**
   * Fetch all templates
   */
  const fetchTemplates = useCallback(async () => {
    setLoading(prev => ({ ...prev, templates: true }));
    setError(prev => ({ ...prev, templates: null }));
    
    try {
      const response = await apiService.transaction.getTemplates();
      console.log('Templates response:', response);
      
      // Extract data from the response object
      if (response.ok && response.data) {
        setTemplates(response.data);
        console.log('Setting templates:', response.data.length, 'items');
      } else {
        console.error('Failed to fetch templates:', response.error);
        setError(prev => ({ 
          ...prev, 
          templates: response.error?.message || 'Failed to fetch templates'
        }));
        setTemplates([]);
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError(prev => ({ 
        ...prev, 
        templates: err.message || 'An error occurred while fetching templates'
      }));
      setTemplates([]);
    } finally {
      setLoading(prev => ({ ...prev, templates: false }));
    }
  }, []);

  /**
   * Select a template and set it as the selected template
   * @param {Object|string|number} templateOrId - Template object or ID to select
   */
  const selectTemplate = useCallback((templateOrId) => {
    if (!templateOrId) return;
    
    if (typeof templateOrId === 'object') {
      // If a template object was passed
      setSelectedTemplate(templateOrId);
    } else {
      // If a template ID was passed
      const template = templates.find(t => 
        t.template_id === templateOrId || 
        t.template_id?.toString() === templateOrId?.toString()
      );
      setSelectedTemplate(template);
    }
  }, [templates]);

  /**
   * Clear the selected template
   */
  const clearSelectedTemplate = useCallback(() => {
    setSelectedTemplate(null);
  }, []);

  /**
   * Submit an event based on a template
   * @param {Object} eventData - Event data to submit
   * @returns {Promise<Object>} - Response with status and transfer information
   */
  const submitEvent = useCallback(async (eventData) => {
    setLoading(prev => ({ ...prev, submission: true }));
    setError(prev => ({ ...prev, submission: null }));
    
    try {
      const response = await apiService.transaction.submitEvent(eventData);
      console.log('Event submission response:', response);
      
      setLoading(prev => ({ ...prev, submission: false }));
      
      if (!response.ok) {
        console.error('Failed to submit event:', response.error);
        setError(prev => ({ 
          ...prev, 
          submission: response.error?.message || 'Failed to submit event'
        }));
        throw new Error(response.error?.message || 'Failed to submit event');
      }
      
      return response;
    } catch (err) {
      console.error('Error submitting event:', err);
      setError(prev => ({ 
        ...prev, 
        submission: err.message || 'An error occurred while submitting the event'
      }));
      throw err;
    }
  }, []);

  // Load templates when the component mounts
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    // Data
    templates,
    selectedTemplate,
    loading,
    error,
    
    // Actions
    fetchTemplates,
    selectTemplate,
    clearSelectedTemplate,
    submitEvent
  };
};

export default useTransactions;