/**
 * Account model configuration
 */
import React from 'react';

import { formatBalance, formatAccountCode, getAccountType, getCurrencyInfo } from '../../utils/formatters/index';
import { drillFormatter } from '../../utils/formatters/drillFormatters';

export const AccountConfig = {
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
      suppressRowClickSelection: true
    },
    {
      field: 'ledger',
      headerName: 'Ledger',
      cellRenderer: props => {
        const ledger = props.data.r_ledger || props.data.enriched_ledger;
        return ledger?.ledger_id ? drillFormatter('ledgers', ledger.name, ledger.ledger_id) : 'N/A';
      },
      suppressRowClickSelection: true
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
  ],
  
  // Basic section fields for detail view
  detailSections: (account, entity, ledger) => [
    {
      label: 'Account ID',
      content: account.account_id || 'N/A'
    },
    {
      label: 'Name',
      content: account.name
    },
    {
      label: 'Created',
      skipSection: !account.date_created,
      content: account.date_created ? new Date(account.date_created).toLocaleString() : 'N/A'
    },
    {
      label: 'Account Type',
      content: getAccountType(account)
    },
    {
      label: 'Entity',
      skipSection: !entity,
      content: entity ? drillFormatter('entities', entity.name, entity.entity_id) : 'N/A'
    },
    {
      label: 'Ledger',
      skipSection: !ledger,
      content: ledger ? drillFormatter('ledgers', ledger.name, ledger.ledger_id) : 'N/A'
    },
    {
      label: 'Account Code',
      content: formatAccountCode(account.account_code || account.code)
    },
    {
      label: 'Currency',
      content: (ledger && ledger.r_currency && ledger.r_currency.currency_code) || 
               account.currency_code || 
               'N/A'
    },
    {
      label: 'Current Balance',
      content: formatBalance(account.balance, getCurrencyInfo(account), true)
    }
  ]
};
