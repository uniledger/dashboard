import React, { useState, useEffect } from 'react';
import useTransactions from '../../hooks/useTransactions';
// Removed unused useAccounts and useLedgers imports
import TemplatesList from './TemplatesList';
import TemplateDetail from './TemplateDetail';
// Removed unused EventForm import

/**
 * Manages the display of transaction templates, allowing users to view a list of templates
 * or the details of a specific template. It utilizes the `useTransactions` hook to manage template data.
 *
 * @param {Object} props - Component props.
 * @param {function} [props.onViewJson] - Callback function to display raw JSON data for an item.
 * @returns {JSX.Element} The rendered TemplatesPage component, showing either `TemplatesList` or `TemplateDetail`.
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

  /**
   * Invokes the `onViewJson` prop, if provided, to display raw JSON data.
   *
   * @param {Object} data - The data object to be displayed as JSON.
   * @param {string} title - The title for the JSON view modal.
   */
  const handleViewJson = (data, title) => {
    if (onViewJson) {
      onViewJson(data, title);
    }
  };

  // Removed handleUseTemplate functionality

  /**
   * Clears the selected template and switches the view back to the templates list.
   */
  const handleBackToList = () => {
    clearSelectedTemplate();
    setView('list');
  };

  // Removed unused handleBackToDetail

  /**
   * Selects a template and switches the view to show the template details.
   *
   * @param {Object} template - The template object to be selected.
   */
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