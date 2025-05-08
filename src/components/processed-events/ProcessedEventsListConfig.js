/**
 * ProcessedEvent model configuration
 */
import React from 'react';
import { formatDate } from '../../utils/formatters/dateFormatters.js';

export const processedEventsListViewColumns = [
  {
    field: 'event_id',
    headerName: 'ID',
  },
  {
    field: 'status',
    headerName: 'Status',
    cellClassName: (item) => {
      return item.status === 'COMPLETED'
        ? 'text-green-600 font-medium'
        : item.status === 'FAILED'
          ? 'text-red-600 font-medium'
          : 'text-yellow-600 font-medium';
    }
  },
  {
    field: 'template_id',
    headerName: 'Template',
      },
  {
    field: 'timestamp',
    headerName: 'Timestamp',
  },
  {
    field: 'amount',
    headerName: 'Amount',
    type: 'rightAligned',
  },
  {
    field: 'from_account_id',
    headerName: 'From Account',
  },
  {
    field: 'ledger',
    headerName: 'Ledger',
  }
];

export const ProcessedEventsListConfig = {
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

};
