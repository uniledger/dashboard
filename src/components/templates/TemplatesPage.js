import React, { useState, useEffect } from 'react';
import useTransactions from '../../hooks/useTransactions';
import useAccounts from '../../hooks/useAccounts';
import useLedgers from '../../hooks/useLedgers';
import TemplatesList from './TemplatesList';
import TemplateDetail from './TemplateDetail';
import EventForm from './EventForm';

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

  const {
    ledgers,
    fetchLedgers
  } = useLedgers();

  const [view, setView] = useState('list'); // 'list', 'detail', or 'event-form'

  // Update the view when selectedTemplate changes
  useEffect(() => {
    if (selectedTemplate && view === 'list') {
      setView('detail');
    } else if (!selectedTemplate && view !== 'list') {
      setView('list');
    }
  }, [selectedTemplate, view]);

  // Fetch accounts and ledgers when needed
  useEffect(() => {
    if (view === 'event-form') {
      fetchAccounts();
      fetchLedgers();
    }
  }, [view, fetchAccounts, fetchLedgers]);

  const handleViewJson = (data, title) => {
    if (onViewJson) {
      onViewJson(data, title);
    }
  };

  // Removed handleUseTemplate functionality

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

  // We no longer use the event-form view since "Use this template" button was removed

  if ((view === 'detail' || selectedTemplate) && view !== 'event-form') {
    return (
      <TemplateDetail 
        template={selectedTemplate}
        onViewJson={handleViewJson}
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