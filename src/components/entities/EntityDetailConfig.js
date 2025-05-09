/**
 * Entity Detail configuration for ledgers and accounts
 */
import { drillFormatter } from '../../utils/formatters/drillFormatters.js';
import { formatAccountCode } from '../../utils/formatters/index';
import { getAccountType } from '../../utils/formatters/accountFormatters.js';
import { getCurrencyInfo } from '../../utils/formatters/index';
import { formatBalance } from '../../utils/formatters/index';
import { getCountryDisplay } from '../../utils/formatters/index';

export const EntityDetailConfig = {
  // Basic section fields for detail view
  detailSections: (entity) => [
    {
      label: 'Entity ID',
      content: entity.entity_id
    },
    {
      label: 'Name',
      content: entity.name
    },
    {
      label: 'Type',
      content: entity.type || entity.entity_type || 'N/A'
    },
    {
      label: 'Country',
      content: getCountryDisplay(entity)
    },
    {
      label: 'KYC Status',
      content: entity.kyc_status || 'N/A'
    }
  ],

  // Define the ledgers list columns
  ledgersTableSection: {
    columns: [
      {
        field: 'ledger_id',
        headerName: 'ID',
      },
      {
        field: 'name',
        headerName: 'Name',
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
      },
    ]
  },

  // Define the accounts table columns
  accountsTableSection: {
    columns: [
      {
        field: 'account_id',
        headerName: 'ID',
      },
      {
        field: 'name',
        headerName: 'Name',
      },
      {
        field: 'account_code',
        headerName: 'Account Code',
        cellRenderer: props => formatAccountCode(props.data.account_code || props.data.code),
      },
      {
        field: 'type',
        headerName: 'Type',
        cellRenderer: props => getAccountType(props.data),
      },
      {
        field: 'ledger',
        headerName: 'Ledger',
        suppressRowClickSelection: true,
        cellRenderer: props => drillFormatter('ledgers', props.data.enriched_ledger?.name, props.data.enriched_ledger?.ledger_id),
      },
      {
        field: 'balance',
        headerName: 'Balance',
        type: 'rightAligned',
        cellRenderer: props => formatBalance(props.data.balance, getCurrencyInfo(props.data), true),
      },
    ]
  }
};
