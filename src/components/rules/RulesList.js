import React from 'react';
import { StandardList } from '../common';

/**
 * Component to display a list of rules using StandardList
 */
const RulesList = ({ rules, onSelectRule, onViewJson, onRefresh }) => {
  // Define columns for the DataTable
  const columns = [
    {
      key: 'rule_id',
      header: 'ID',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
      // Display the ID directly, consistent with other list views
    },
    {
      key: 'action',
      header: 'Action',
      cellClassName: 'text-gray-500',
    },
    {
      key: 'description',
      header: 'Description',
      cellClassName: 'text-gray-500',
    },
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
    <StandardList
      data={rules}
      columns={columns}
      title="Rules"
      idField="rule_id"
      onItemClick={onSelectRule}
      onViewJson={onViewJson}
      onRefresh={onRefresh}
      searchPlaceholder="Search rules..."
      emptyMessage="No rules found"
    />
  );
};

export default RulesList;