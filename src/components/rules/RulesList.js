import React from 'react';
import { GenericListView, RuleConfig } from '../common';

/**
 * Component to display a list of rules using GenericListView
 */
const RulesList = ({ rules, onSelectRule, onViewJson, onRefresh, loading }) => {
  // Define columns for the rules list
  const columns = [
    ...RuleConfig.listColumns,
    {
      key: 'description',
      header: 'Description',
      cellClassName: 'text-gray-500',
      render: (rule) => rule.description && rule.description.length > 60
        ? `${rule.description.substring(0, 60)}...`
        : rule.description || 'No description'
    },
    {
      key: 'expression',
      header: 'Expression',
      cellClassName: 'text-gray-500 font-mono',
      render: (rule) => rule.expression && rule.expression.length > 60
        ? `${rule.expression.substring(0, 60)}...`
        : rule.expression || 'N/A'
    },
    {
      key: 'action',
      header: 'Action',
      cellClassName: 'text-gray-500',
      render: (rule) => rule.action || 'N/A'
    }
  ];

  return (
    <GenericListView
      data={rules}
      columns={columns}
      title="Rules"
      idField={RuleConfig.idField}
      loading={loading}
      onItemClick={onSelectRule}
      onViewJson={onViewJson}
      onRefresh={onRefresh}
      searchPlaceholder="Search rules..."
      emptyMessage="No rules found"
    />
  );
};

export default RulesList;