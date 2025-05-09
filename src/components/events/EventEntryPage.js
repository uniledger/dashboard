import React, { useState, useEffect } from 'react';
import useTransactions from '../../hooks/useTransactions';
import useAccounts from '../../hooks/useAccounts';
import useLedgers from '../../hooks/useLedgers';
import apiService from '../../services/apiService';
import EventForm from '../templates/EventForm';
import { LoadingSpinner } from '../common';
import { GenericListView } from '../common'
import { EventEntryPageConfig } from './EventEntryPageConfig';

/**
 * Renders the event entry page.
 *
 * Allows users to create new events directly from the navbar. Integrates templates, accounts, and ledgers selection, and handles event submission.
 */
const EventEntryPage = ({ onViewJson }) => {
  console.log('EventEntryPage received onViewJson:', onViewJson);
  const { 
    templates,
    selectedTemplate,
    fetchTemplates,
    submitEvent,
    clearSelectedTemplate,
    selectTemplate,
    loading
  } = useTransactions();

  const {
    accounts,
    fetchAccounts
  } = useAccounts();

  const { 
    ledgers,
    fetchLedgers,
    loading: loadingLedgers
  } = useLedgers();

  const [templateSelectionActive, setTemplateSelectionActive] = useState(true);

  // Fetch data when component mounts
  useEffect(() => {
    fetchTemplates();
    fetchLedgers();
    fetchAccounts();
  }, [fetchTemplates, fetchAccounts, fetchLedgers]);

  const handleSelectTemplate = (template) => {
    selectTemplate(template);
    setTemplateSelectionActive(false);
  };

  const handleBackToTemplateSelection = () => {
    clearSelectedTemplate();
    setTemplateSelectionActive(true);
  };

  // Show loading state if data is still loading
  if (loading.templates || loadingLedgers) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading data..." />
      </div>
    );
  }

  // Define columns for the template selection list
  const columns = EventEntryPageConfig.templateSelectionColumns;

  // Show template selection if no template is selected yet
  if (templateSelectionActive) {
    return (
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Create a New Event
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Select a template to create a new event
          </p>
          
          <GenericListView
            data={templates}
            columns={columns}
            title="Templates"
            idField="template_id"
            onRowClick={handleSelectTemplate}
            onViewJson={onViewJson}
            onRefresh={fetchTemplates}
            searchPlaceholder="Search templates..."
            emptyMessage="No templates found"
          />
        </div>
      </div>
    );
  }

  // Show the event form if a template is selected
  return (
    <EventForm 
      template={selectedTemplate}
      ledgers={ledgers}
      accounts={accounts}
      onBack={handleBackToTemplateSelection}
      onViewJson={onViewJson}
      onSubmitEvent={submitEvent}
    />
  );
};

export default EventEntryPage;