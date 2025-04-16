import React, { useState, useEffect } from 'react';
import useTransactions from '../../hooks/useTransactions';
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

  const [view, setView] = useState('list'); // 'list', 'detail', or 'event-form'

  // Update the view when selectedTemplate changes
  useEffect(() => {
    if (selectedTemplate && view === 'list') {
      setView('detail');
    } else if (!selectedTemplate && view !== 'list') {
      setView('list');
    }
  }, [selectedTemplate, view]);

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
        onBack={handleBackToDetail}
        onViewJson={handleViewJson}
        onSubmitEvent={submitEvent}
      />
    );
  }

  if ((view === 'detail' || selectedTemplate) && view !== 'event-form') {
    return (
      <TemplateDetail 
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