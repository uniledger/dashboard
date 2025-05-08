/**
 * Ledger model configuration
 */
import React from 'react';
import { drillFormatter } from '../../utils/formatters/drillFormatters.js';
import { getCountryDisplay } from '../../utils/formatters/index.js';

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
    },
    {
      field: 'entity',
      headerName: 'Owner',
      context: {
        suppressRowClickSelection: true
      },
      cellRenderer: props => props.data.r_entity ? drillFormatter('entities', props.data.r_entity.name, props.data.r_entity.entity_id) : (props.data.entity ? drillFormatter('entities', props.data.entity.name, props.data.entity.entity_id) : 'N/A'),
    },
    {
      field: 'currency',
      headerName: 'Currency',
      cellRenderer: props => props.data.r_currency ? `${props.data.r_currency.currency_code} (${props.data.r_currency.type})` : 'N/A',
    },
    {
      field: 'country',
      headerName: 'Country',
      cellRenderer: props => getCountryDisplay(props.data),
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
      content: entity ? drillFormatter('entities', entity.name, entity.entity_id) : (ledger.r_entity ? drillFormatter('entities', ledger.r_entity.name, ledger.r_entity.entity_id) : 'N/A')
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
