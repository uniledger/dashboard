import React from 'react';
import { GenericDetailView, ActionButton, RuleConfig } from '../common';

/**
 * Component to display detailed rule information using GenericDetailView
 */
const RuleDetail = ({ rule, onBack, onViewJson }) => {
  // Define custom sections for the rule detail
  const sections = [
    {
      label: 'Rule ID',
      content: rule?.rule_id
    },
    {
      label: 'Description',
      content: rule?.description
    },
    {
      label: 'Action',
      content: rule?.action && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          {rule.action}
        </span>
      )
    },
    {
      label: 'Status',
      content: rule?.status && (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          rule.status === 'ACTIVE' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {rule.status}
        </span>
      )
    },
    {
      label: 'Expression',
      content: rule?.expression && (
        <div className="bg-gray-50 p-4 rounded font-mono overflow-x-auto">
          {rule.expression}
        </div>
      )
    }
  ];

  // Define custom actions
  const customActions = (
    <>
      <ActionButton
        variant="outline"
        onClick={() => onViewJson(rule, `Rule ${rule?.rule_id}`)}
      >
        View JSON
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
      data={rule}
      title="Rule Detail"
      subtitle={rule?.name || `Rule ${rule?.rule_id}`}
      sections={sections}
      onBack={onBack}
      onViewJson={onViewJson}
      customActions={customActions}
    />
  );
};

export default RuleDetail;