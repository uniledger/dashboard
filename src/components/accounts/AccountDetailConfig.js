/**
 * Account detail model configuration
 */

import { formatBalance, formatAccountCode, getAccountType, getCurrencyInfo } from '../../utils/formatters/index';
import { drillFormatter } from '../../utils/formatters/drillFormatters';

export const AccountDetailConfig = {
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
  ],

    // const accountContext  = { accountId };
    // accountContext.accountId = accountId;
  
    
    transferColumns: [
      // Transfer ID (using 'id' field from response)
      {
        field: 'id',
        headerName: 'ID',
      },
      // From/To Account with drill link (using correct field names)
      {
        field: 'related_account',
        headerName: 'Related Account',
        cellRenderer: props => {
          const currentAccountId = parseInt(props.context.accountId, 10);
              // Determine which account ID is the related one
          let relatedAccountId;
          
          // If this account is the debit account, show the credit account as related
          if (currentAccountId === props.data.debit_account_id) {
              relatedAccountId = props.data.credit_account_id;
          } 
          // If this account is the credit account, show the debit account as related
          else if (currentAccountId === props.data.credit_account_id) {
              relatedAccountId = props.data.debit_account_id;
          }
      
      // Return the related account ID
      return drillFormatter('accounts', relatedAccountId, relatedAccountId);
        }
      },
      // Amount with formatting, showing negative for debits and positive for credits
      {
        field: 'amount',
        headerName: 'Amount',
        type: 'rightAligned',
        cellRenderer: props => formatBalance(props.data.amount, {}),
      },
      // Timestamp 
      {
        field: 'timestamp',
        headerName: 'Timestamp',
        width: 180
      },
      // Ledger with drill link (using correct 'ledger' field)
      {
        field: 'ledger',
        headerName: 'Ledger',
        cellRenderer: props => drillFormatter('ledgers', props.data.ledger, props.data.ledger),
      }
    ]
};
