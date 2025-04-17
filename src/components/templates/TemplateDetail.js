import React from 'react';
import { GenericDetailView, ActionButton, TemplateConfig } from '../common';

/**
 * Template Detail component using GenericDetailView
 */
const TemplateDetail = ({ template, onBack, onViewJson, onUseTemplate }) => {
  // Get all sections from the template configuration
  const sections = TemplateConfig.getAllSections(template);
  
  // Custom actions for the detail card
  const customActions = (
    <>
      <ActionButton
        variant="outline"
        onClick={() => onViewJson(template, `Template ${template.template_id}`)}
      >
        View JSON
      </ActionButton>
      <ActionButton
        variant="primary"
        onClick={() => onUseTemplate(template)}
      >
        Use This Template
      </ActionButton>
      <ActionButton
        variant="secondary"
        onClick={onBack}
      >
        Back
      </ActionButton>
    </>
  );

  return (
    <GenericDetailView
      data={template}
      title="Template Detail"
      subtitle={template?.name}
      sections={sections}
      onBack={onBack}
      onRefresh={null} // Templates don't need refreshing
      onViewJson={onViewJson}
      customActions={customActions}
    />
  );
};

export default TemplateDetail;