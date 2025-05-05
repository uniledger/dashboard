/**
 * Ledger model configuration
 */
import React from 'react';
import { ledgerCurrencyCellRenderer } from './LedgerRenderers.js';
import { entityOwnerCellRenderer, countryCellRenderer } from '../common/CellRenderers.js';
import { getCountryDisplay } from '../../utils/formatters';

export const LedgerConfig = {
  title: 'Ledger',
  idField: 'ledger_id',
  displayField: 'name',
  
  // Column definitions for list view
  listColumns: [
    {
      field: 'ledger_id',
      headerName: 'ID',
    },
    {
      field: 'name',
      headerName: 'Name',
      cellClassName: 'font-medium text-gray-900',
    },
    {
      field: 'entity',
      headerName: 'Owner',
      cellRenderer: entityOwnerCellRenderer,
    },
    {
      field: 'currency',
      headerName: 'Currency',
      cellRenderer: ledgerCurrencyCellRenderer,
    },
    {
      field: 'country',
      headerName: 'Country',
      cellRenderer: countryCellRenderer,
    }
  ],
  
  // Basic section fields for detail view
  detailSections: (ledger, entity) => [
    {
      label: 'Ledger ID',
      content: ledger.ledger_id
    },
    {
      label: 'Name',
      content: ledger.name
    },
    {
      label: 'Owner',
      content: entity ? entity.name : (ledger.r_entity ? ledger.r_entity.name : 'N/A')
    },
    {
      label: 'Currency',
      content: ledger.r_currency ? `${ledger.r_currency.currency_code} (${ledger.r_currency.type})` : 'N/A'
    },
    {
      label: 'Country',
      content: getCountryDisplay(ledger)
    },
    {
      label: 'Description',
      content: ledger.description || 'No description'
    }
  ]
};
