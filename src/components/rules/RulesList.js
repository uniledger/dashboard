import React from 'react';
import { GenericListView } from '../common';
import { RuleConfig } from './RuleConfig.js';

/**
 * Renders a list of rules.
 *
 * Uses GenericListView to display a list of rules with columns for description, expression, and action. Supports selection, JSON view, refresh, and loading state.
 *
 * @param {Object} props - Component props.
 * @param {Array} props.rules - Array of rule objects to display.
 * @param {Function} props.onSelectRule - Handler for selecting a rule.
 * @param {Function} props.onViewJson - Handler for viewing rule JSON.
 * @param {Function} props.onRefresh - Handler to refresh rules.
 * @param {boolean} props.loading - Whether the list is loading.
 * @returns {JSX.Element} The rendered RulesList component.
 */
const RulesList = ({ rules, onSelectRule, onViewJson, onRefresh, loading }) => {
  // Define columns for the rules list
  const columns = [
    ...RuleConfig.listColumns,
    {
      field: 'description',
      headerName: 'Description',
      cellClassName: 'text-gray-500',
      render: (rule) => rule.description && rule.description.length > 60
        ? `${rule.description.substring(0, 60)}...`
        : rule.description || 'No description'
    },
    {
      field: 'expression',
      headerName: 'Expression',
      cellClassName: 'text-gray-500 font-mono',
      render: (rule) => rule.expression && rule.expression.length > 60
        ? `${rule.expression.substring(0, 60)}...`
        : rule.expression || 'N/A'
    },
    {
      field: 'action',
      headerName: 'Action',
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