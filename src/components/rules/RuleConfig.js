/**
 * Rule model configuration
 */
import React from 'react';

export const RuleConfig = {
  title: 'Rule',
  idField: 'rule_id',
  displayField: 'name',

  // Column definitions for list view
  listColumns: [
    {
      field: 'rule_id',
      headerName: 'ID',
    },
    {
      field: 'name',
      headerName: 'Name',
    },
    {
      field: 'description',
      headerName: 'Description',
    },
    {
      field: 'expression',
      headerName: 'Expression',
    },
    {
      field: 'priority',
      headerName: 'Priority',
      type: 'rightAligned',
    },
    {
      field: 'status',
      headerName: 'Status',
    }
  ],

  // Basic section fields for detail view
  detailSections: (rule) => [
    {
      label: 'Rule ID',
      content: rule.rule_id
    },
    {
      label: 'Name',
      content: rule.name
    },
    {
      label: 'Description',
      content: rule.description
    },
    {
      label: 'Expression',
      content: rule.expression
    },
    {
      label: 'Priority',
      content: rule.priority
    },
    {
      label: 'Status',
      content: rule.status
    }
  ]
};
