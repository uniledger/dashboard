import React from 'react';
import { GenericDetailView } from '../common';
import { TemplateConfig } from './TemplateConfig.js';

/**
 * Template Detail component using GenericDetailView
 */
const TemplateDetail = ({ template, onBack, onViewJson }) => {
  // Use only basic sections for the detail card
  const baseSections = TemplateConfig.detailSections(template);
  
  // Custom actions for the detail card - icon-only buttons
  const customActions = (
    <div className="flex items-center gap-2">
      {/* View JSON button */}
      <button
        className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
        onClick={() => onViewJson(template, `Template ${template.template_id}`)}
        title="View JSON"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M8 16h8" />
          <path d="M8 12h8" />
        </svg>
      </button>
      
      {/* Back button */}
      <button
        className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
        onClick={onBack}
        title="Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <GenericDetailView
        data={template}
        title="Template Detail"
        subtitle={template?.name}
        sections={baseSections}
        onBack={onBack}
        onRefresh={null} // Templates don't need refreshing
        onViewJson={onViewJson}
        customActions={customActions}
      />
      
      {/* Data tables displayed underneath the main detail card */}
      {template && (
        <div className="space-y-6">
          {TemplateConfig.renderVariablesSection(template)}
          {TemplateConfig.renderValidationsSection(template)}
          {TemplateConfig.renderLegsSection(template)}
        </div>
      )}
    </div>
  );
};

export default TemplateDetail;