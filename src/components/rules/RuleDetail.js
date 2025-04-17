import React from 'react';
import { GenericDetailView, ActionButton } from '../common';

/**
 * Component to display detailed rule information using GenericDetailView
 */
const RuleDetail = ({ rule, onBack, onViewJson }) => {
  // Define custom sections for the rule detail
  const sections = [
    {
      label: 'Rule ID',
      content: rule?.rule_id || 'N/A'
    },
    {
      label: 'Description',
      content: rule?.description || 'No description available'
    },
    {
      label: 'Action',
      content: rule?.action ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          {rule.action}
        </span>
      ) : 'N/A'
    },
    {
      label: 'Expression',
      content: rule?.expression ? (
        <div className="bg-gray-50 p-4 rounded font-mono overflow-x-auto">
          {rule.expression}
        </div>
      ) : 'No expression defined'
    }
  ];

  // Define custom actions
  const customActions = (
    <>
      {onViewJson && (
        <ActionButton
          variant="outline"
          onClick={() => onViewJson(rule, `Rule ${rule?.rule_id}`)}
        >
          View JSON
        </ActionButton>
      )}
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