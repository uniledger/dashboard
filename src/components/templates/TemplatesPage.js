import React, { useState, useEffect } from 'react';
import useTransactions from '../../hooks/useTransactions';
// Removed unused useAccounts and useLedgers imports
import TemplatesList from './TemplatesList';
import TemplateDetail from './TemplateDetail';
// Removed unused EventForm import

/**
 * Main Templates page component
 * Manages whether to show the list or detail view
 */
const TemplatesPage = ({ onViewJson }) => {
  const { 
    templates,
    selectedTemplate,
    fetchTemplates,
    clearSelectedTemplate,
    selectTemplate,
    loading
  } = useTransactions();

  // Removed unused accounts hook

  // Removed unused ledgers hook

  const [view, setView] = useState('list'); // 'list', 'detail', or 'event-form'

  // Update the view when selectedTemplate changes
  useEffect(() => {
    if (selectedTemplate && view === 'list') {
      setView('detail');
    } else if (!selectedTemplate && view !== 'list') {
      setView('list');
    }
  }, [selectedTemplate, view]);

  // Removed unused event-form fetch logic

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

  // Removed unused handleBackToDetail

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