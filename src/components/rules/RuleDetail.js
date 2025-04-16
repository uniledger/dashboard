import React from 'react';
import { DetailCard, ActionButton } from '../common';

/**
 * Component to display detailed rule information using the common DetailCard
 */
const RuleDetail = ({ rule, onBack, onViewJson }) => {
  if (!rule) return null;

  // Define sections for the detail card - we don't need to include rule ID
  // in the sections since it's already in the subtitle
  const sections = [
    {
      label: 'Rule ID',
      content: rule.rule_id
    },
    {
      label: 'Description',
      content: rule.description
    },
    {
      label: 'Action',
      content: (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          {rule.action}
        </span>
      )
    },
    {
      label: 'Expression',
      content: (
        <div className="bg-gray-50 p-4 rounded font-mono overflow-x-auto">
          {rule.expression}
        </div>
      )
    }
  ];

  // Define actions for the detail card
  const actions = (
    <>
      <ActionButton
        variant="outline"
        onClick={() => onViewJson(rule, `Rule ${rule.rule_id}`)}
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

  // Check if rule has a name field, otherwise use description as the subtitle
  const subtitle = rule.description || `Rule ${rule.rule_id}`;

  return (
    <DetailCard
      title="Rule Details"
      subtitle={subtitle}
      sections={sections}
      actions={actions}
    />
  );
};

export default RuleDetail;