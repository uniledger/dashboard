import React, { useState, useEffect } from 'react';
import useTransactions from '../../hooks/useTransactions';
import useAccounts from '../../hooks/useAccounts';
import apiService from '../../services/apiService';
import EventForm from '../templates/EventForm';
import { StandardList, LoadingSpinner } from '../common';

/**
 * Event Entry page component
 * Allows users to create new events directly from the navbar
 */
const EventEntryPage = ({ onViewJson }) => {
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

  const [ledgers, setLedgers] = useState([]);
  const [loadingLedgers, setLoadingLedgers] = useState(false);
  const [templateSelectionActive, setTemplateSelectionActive] = useState(true);

  // Fetch data when component mounts
  useEffect(() => {
    fetchTemplates();
    fetchLedgers();
    fetchAccounts();
  }, [fetchTemplates, fetchAccounts]);

  const fetchLedgers = async () => {
    setLoadingLedgers(true);
    try {
      const data = await apiService.ledger.getLedgers();
      setLedgers(data);
    } catch (error) {
      console.error('Error fetching ledgers:', error);
    } finally {
      setLoadingLedgers(false);
    }
  };

  const handleSelectTemplate = (template) => {
    selectTemplate(template);
    setTemplateSelectionActive(false);
  };

  const handleBackToTemplateSelection = () => {
    clearSelectedTemplate();
    setTemplateSelectionActive(true);
  };

  // Show loading state if data is still loading
  if ((loading.templates || loadingLedgers) && !templates.length) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading templates and ledgers..." />
      </div>
    );
  }

  // Define columns for the template selection list
  const columns = [
    {
      key: 'template_id',
      header: 'ID',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
    },
    {
      key: 'name',
      header: 'Template Name',
      cellClassName: 'font-medium text-gray-900',
    },
    {
      key: 'product',
      header: 'Type',
      cellClassName: 'text-gray-500',
    },
    {
      key: 'description',
      header: 'Description',
      cellClassName: 'text-gray-500',
      render: (item) => {
        return item.description.length > 100 
          ? `${item.description.substring(0, 100)}...` 
          : item.description;
      }
    },
    {
      key: 'created_date',
      header: 'Created',
      cellClassName: 'text-gray-500',
      render: (item) => {
        return new Date(item.created_date * 1000).toLocaleDateString();
      }
    }
  ];

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
          
          <StandardList
            data={templates}
            columns={columns}
            title="Templates"
            idField="template_id"
            onItemClick={handleSelectTemplate}
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