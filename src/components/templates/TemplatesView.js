import React, { useState, useEffect } from 'react';
import TemplatesList from './TemplatesList';
import TemplateDetail from './TemplateDetail';
import EventForm from './EventForm';

const TRANSACTIONS_API_BASE_URL = 'https://transactions.dev.ledgerrocket.com';
const LEDGER_API_BASE_URL = 'https://ledger.dev.ledgerrocket.com';

/**
 * Main component for the Templates & Events tab
 */
const TemplatesView = ({ ledgers, accounts, onViewJson, onRefresh }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'detail', or 'event-form'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Fetch templates from the API
  const fetchTemplates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${TRANSACTIONS_API_BASE_URL}/api/v1/templates/`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setTemplates(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError(err.message || 'An error occurred while fetching templates');
      setIsLoading(false);
    }
  };

  // Handle template selection for viewing details
  const handleSelectTemplateForDetail = (template) => {
    setSelectedTemplate(template);
    setView('detail');
  };

  // Handle template selection for creating an event
  const handleSelectTemplateForEvent = (template) => {
    setSelectedTemplate(template);
    setView('event-form');
  };

  // Handle event submission
  const handleSubmitEvent = async (eventData) => {
    try {
      const response = await fetch(`${TRANSACTIONS_API_BASE_URL}/api/v1/events/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || `Error: ${response.status} ${response.statusText}`);
      }
      
      return data;
    } catch (err) {
      console.error('Error submitting event:', err);
      throw err;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading templates...</p>
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
            onClick={fetchTemplates}
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
        <TemplatesList 
          templates={templates}
          onSelectTemplate={handleSelectTemplateForDetail}
          onViewJson={onViewJson}
          onRefresh={fetchTemplates}
        />
      )}
      
      {view === 'detail' && selectedTemplate && (
        <TemplateDetail 
          template={selectedTemplate}
          onBack={() => setView('list')}
          onViewJson={onViewJson}
          onUseTemplate={handleSelectTemplateForEvent}
        />
      )}
      
      {view === 'event-form' && selectedTemplate && (
        <EventForm 
          template={selectedTemplate}
          ledgers={ledgers}
          accounts={accounts}
          onBack={() => setView('detail')}
          onSubmitEvent={handleSubmitEvent}
        />
      )}
    </div>
  );
};

export default TemplatesView;