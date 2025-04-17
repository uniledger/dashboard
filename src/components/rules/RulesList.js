import React from 'react';
import { GenericListView, RuleConfig } from '../common';

/**
 * Component to display a list of rules using GenericListView
 */
const RulesList = ({ rules, onSelectRule, onViewJson, onRefresh, loading }) => {
  // Define additional columns to include with the base configuration
  const columns = [
    ...RuleConfig.listColumns,
    {
      key: 'expression',
      header: 'Expression',
      cellClassName: 'text-gray-500 font-mono',
      render: (rule) => rule.expression && rule.expression.length > 80
        ? `${rule.expression.substring(0, 80)}...`
        : rule.expression
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