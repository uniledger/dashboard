/**
 * Configuration object for displaying account lists, primarily within the `GenericListView` component.
 * It defines properties such as the title, ID fields, display field, and notably, the `listColumns`
 * array which specifies the AG Grid column definitions for accounts, including custom cell renderers
 * and formatters from `../../utils/formatters/`.
 */
import React from 'react';

import { formatBalance, formatAccountCode, getAccountType, getCurrencyInfo } from '../../utils/formatters/index';
import { drillFormatter } from '../../utils/formatters/drillFormatters';

export const AccountListConfig = {
  title: 'Account',
  idField: 'account_id',
  altIdField: 'account_extra_id', // Alternative ID field for accounts
  displayField: 'name',

  // Column definitions for list view
  listColumns: [  
    {
      field: 'account_id',
      headerName: 'ID',
      cellRenderer: props => props.data.account_id || 'N/A',
    },
    {
      field: 'name',
      headerName: 'Account Name',
      cellRenderer: props => props.data.name || 'N/A',
    },
    {
      field: 'account_code',
      headerName: 'Account Code',
      cellRenderer: props => formatAccountCode(props.data.account_code || props.data.code),
    },
    {
      field: 'account_type',
      headerName: 'Type',
      cellRenderer: props => getAccountType(props.data),
    },
    {
      field: 'balance',
      headerName: 'Balance',
      type: 'rightAligned',
      filter: 'agNumberColumnFilter',
      cellRenderer: props => formatBalance(props.data.balance, getCurrencyInfo(props.data), true),
    },
    {
      field: 'entity',
      headerName: 'Account Owner',
      cellRenderer: props => {
        const owner = props.data.r_entity || props.data.enriched_ledger?.r_entity;
        return owner?.entity_id ? drillFormatter('entities', owner.name, owner.entity_id) : 'N/A';
      },
      context: {
        suppressRowClickSelection: true
      }
    },
    {
      field: 'ledger',
      headerName: 'Ledger',
      cellRenderer: props => {
        const ledger = props.data.r_ledger || props.data.enriched_ledger;
        return ledger?.ledger_id ? drillFormatter('ledgers', ledger.name, ledger.ledger_id) : 'N/A';
      },
      context: {
        suppressRowClickSelection: true
      }
    },
    {
      field: 'currency',
      headerName: 'Currency',
      cellRenderer: props => {
        return (props.data.enriched_ledger && props.data.enriched_ledger.r_currency && props.data.enriched_ledger.r_currency.currency_code) || 
          props.data.currency_code || 
          'N/A';
      }
    }
  ]
};
