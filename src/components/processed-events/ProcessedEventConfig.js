/**
 * ProcessedEvent model configuration
 */
import React from 'react';
import { formatDate } from '../../utils/formatters/dateFormatters';
import { processedEventDrillCellRenderer, eventTemplateDrillCellRenderer } from './ProcessedEventRenderers.js';

export const ProcessedEventConfig = {
  title: 'Processed Event',
  idField: 'event_id',
  displayField: 'event_id',
  
  // Column definitions for list view
  listColumns: [
    {
      key: 'event_id',
      header: 'Event ID',
      cellClassName: (item) => {
        return item.status === 'ERROR' ? 'text-red-600' : '';
      }
    },
    {
      key: 'template_id',
      header: 'Template',
      render: (item) => {
        return item.r_template ? item.r_template.name : 'N/A';
      }
    },
    {
      key: 'created_date',
      header: 'Created',
      render: (item) => {
        return formatDate(item.created_date, true);
      }
    },
    {
      key: 'completed_date',
      header: 'Completed',
      render: (item) => {
        return item.completed_date ? formatDate(item.completed_date, true) : 'Pending';
      }
    }
  ],
  
  // Basic section fields for detail view
  detailSections: (item) => [
    {
      label: 'Event ID',
      content: item.event_id
    },
    {
      label: 'Template',
      content: item.r_template ? item.r_template.name : 'N/A'
    },
    {
      label: 'Status',
      content: item.status
    },
    {
      label: 'Created Date',
      content: formatDate(item.created_date, true)
    },
    {
      label: 'Completed Date',
      content: item.completed_date ? formatDate(item.completed_date, true) : 'Pending'
    }
  ]
};
