import React, { useState, useEffect } from 'react';
import useTransactions from '../../hooks/useTransactions';
import useAccounts from '../../hooks/useAccounts';
import apiService from '../../services/apiService';
import EventForm from '../templates/EventForm';
import { LoadingSpinner } from '../common';
import { GenericListView } from '../common'

/**
 * Event Entry page component
 * Allows users to create new events directly from the navbar
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
      const response = await apiService.ledger.getLedgers();
      console.log('EventEntryPage ledgers response:', response);
      
      // Extract data from the response object
      if (response.ok && response.data) {
        const ledgersData = response.data;
        console.log('Setting ledgers:', ledgersData.length, 'items');
        setLedgers(ledgersData);
      } else {
        console.error('Failed to fetch ledgers:', response.error);
        setLedgers([]);
      }
    } catch (error) {
      console.error('Error fetching ledgers:', error);
      setLedgers([]);
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
  if (loading.templates || loadingLedgers) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading data..." />
      </div>
    );
  }

  // Define columns for the template selection list
  const columns = [
    {
      field: 'template_id',
      headerName: 'ID',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
    },
    {
      field: 'name',
      headerName: 'Template Name',
      cellClassName: 'font-medium text-gray-900',
    },
    {
      field: 'product',
      headerName: 'Type',
      cellClassName: 'text-gray-500',
    },
    {
      field: 'description',
      headerName: 'Description',
      cellClassName: 'text-gray-500',
      render: (item) => {
        return item.description.length > 100 
          ? `${item.description.substring(0, 100)}...` 
          : item.description;
      }
    },
    {
      field: 'created_date',
      headerName: 'Created',
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
          
          <GenericListView
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