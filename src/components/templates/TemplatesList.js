import React from 'react';
import { GenericListView } from '../common';
import { TemplateConfig } from './TemplateConfig.js';

/**
 * Templates list component using GenericListView
 */
const TemplatesList = ({ templates, onSelectTemplate, onViewJson, onRefresh, loading }) => {
  return (
    <GenericListView
      data={templates}
      columns={TemplateConfig.listColumns}
      title="Templates"
      idField={TemplateConfig.idField}
      loading={loading}
      onRowClick={onSelectTemplate}
      onViewJson={onViewJson}
      onRefresh={onRefresh}
      searchPlaceholder="Search templates..."
      emptyMessage="No templates found"
    />
  );
};

export default TemplatesList;