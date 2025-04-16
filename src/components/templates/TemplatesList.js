import React, { useState } from 'react';
import { StandardList } from '../common';

/**
 * Component to display a list of templates
 */
const TemplatesList = ({ templates, onSelectTemplate, onViewJson, onRefresh }) => {
  // Define columns for StandardList
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

  return (
    <StandardList
      data={templates}
      columns={columns}
      title="Templates"
      idField="template_id"
      onItemClick={onSelectTemplate}
      onViewJson={onViewJson}
      onRefresh={onRefresh}
      searchPlaceholder="Search templates..."
      emptyMessage="No templates found"
    />
  );
};

export default TemplatesList;