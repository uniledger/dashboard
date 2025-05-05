/**
 * Account model configuration
 */
import React from 'react';
import { formatBalance, formatAccountCode, getAccountType, getCurrencyInfo } from '../../utils/formatters/index';
import { accountIDCellRenderer, accountCodeCellRenderer, accountTypeCellRenderer, balanceCellRenderer } from './AccountRenderers.js';

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
      cellRenderer: accountIDCellRenderer,
    },
    {
      field: 'name',
      headerName: 'Account Name',
    },
    {
      field: 'account_code',
      headerName: 'Account Code',
      cellRenderer: accountCodeCellRenderer,
    },
    {
      field: 'account_type',
      headerName: 'Type',
      cellRenderer: accountTypeCellRenderer,
    },
    {
      field: 'balance',
      headerName: 'Balance',
      type: 'rightAligned',
      filter: 'agNumberColumnFilter',
      cellRenderer: balanceCellRenderer,
    }
  ],
  
  // Basic section fields for detail view
  detailSections: (account, entity, ledger) => [
    {
      label: 'Account ID',
      content: account.account_id || account.account_extra_id || 'N/A'
    },
    {
      label: 'Name',
      content: account.name
    },
    {
      label: 'Account Type',
      content: getAccountType(account)
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
