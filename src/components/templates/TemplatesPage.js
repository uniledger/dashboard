import React, { useState, useEffect } from 'react';
import useTransactions from '../../hooks/useTransactions';
import useAccounts from '../../hooks/useAccounts';
import TemplatesList from './TemplatesList';
import TemplateDetail from './TemplateDetail';
import EventForm from './EventForm';
import apiService from '../../services/apiService';

/**
 * Main Templates page component
 * Manages whether to show the list, detail, or event form view
 */
const TemplatesPage = ({ onViewJson }) => {
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

  const [view, setView] = useState('list'); // 'list', 'detail', or 'event-form'
  const [ledgers, setLedgers] = useState([]);
  const [setLoadingLedgers] = useState(false);

  // Update the view when selectedTemplate changes
  useEffect(() => {
    if (selectedTemplate && view === 'list') {
      setView('detail');
    } else if (!selectedTemplate && view !== 'list') {
      setView('list');
    }
  }, [selectedTemplate, view]);

  // Fetch ledgers when needed

  useEffect(() => {
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
    if (view === 'event-form') {
      fetchLedgers();
      fetchAccounts();
    }
  }, [view, fetchAccounts, setLoadingLedgers]);

  const handleViewJson = (data, title) => {
    if (onViewJson) {
      onViewJson(data, title);
    }
  };

  const handleUseTemplate = () => {
    setView('event-form');
  };

  const handleBackToList = () => {
    clearSelectedTemplate();
    setView('list');
  };

  const handleBackToDetail = () => {
    setView('detail');
  };

  const handleSelectTemplate = (template) => {
    selectTemplate(template);
    setView('detail');
  };

  // Determine which view to show based on state
  if (view === 'event-form' && selectedTemplate) {
    return (
      <EventForm 
        template={selectedTemplate}
        ledgers={ledgers}
        accounts={accounts}
        onBack={handleBackToDetail}
        onViewJson={handleViewJson}
        onSubmitEvent={submitEvent}
      />
    );
  }

  if ((view === 'detail' || selectedTemplate) && view !== 'event-form') {
    return (
      <TemplateDetail 
        template={selectedTemplate}
        onViewJson={handleViewJson}
        onUseTemplate={handleUseTemplate}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <TemplatesList 
      templates={templates}
      onViewJson={handleViewJson}
      onSelectTemplate={handleSelectTemplate}
      onRefresh={fetchTemplates}
      loading={loading.templates}
    />
  );
};

export default TemplatesPage;