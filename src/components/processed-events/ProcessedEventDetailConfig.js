

import { drillFormatter } from '../../utils/formatters/drillFormatters.js';
import { getAccountType } from '../../utils/formatters/accountFormatters.js';

export const ProcessedEventDetailConfig = {
      // Define basic sections for the detail view
  
    basicSections: (event) => [   
    {
      label: 'Event ID',
      content: event.event_id
    },
    {
      label: 'Template ID',
      content: event.template_id
    },
    {
      label: 'Amount',
      content: event.amount
    },
    {
      label: 'Timestamp',
      content: event.timestamp 
        ? new Date(event.timestamp * 1000).toLocaleString() 
        : 'N/A'
    },
    {
      label: 'Ledger',
      content: () => {
        const enrichedLedger = event.accounts?.from?.enriched_ledger;
    
        // If enrichedLedger exists, display its core info. Otherwise 'N/A'.
        return enrichedLedger ? (
          <div>
            {/* Assume ID and Name are present if enrichedLedger is */}
            <p><span className="font-medium">ID:</span> {enrichedLedger.ledger_id}</p>
            <p><span className="font-medium">Name:</span> {enrichedLedger.name}</p>
    
            {/* Still check for optional description */}
            {enrichedLedger.description && (
              <p><span className="font-medium">Description:</span> {enrichedLedger.description}</p>
            )}
    
            {/* Still need to check for r_currency before accessing its properties */}
            {enrichedLedger.r_currency && (
              <p>
                <span className="font-medium">Currency:</span> {enrichedLedger.r_currency.currency_code}
                (Scale: {enrichedLedger.r_currency.scale})
              </p>
            )}
          </div>
        ) : 'N/A'; // Fallback if enrichedLedger is null/undefined
      }
    }
  ],

  transferColumns: [
    {
      field: 'debit_account_id',
      headerName: 'From Account',
      cellRenderer: props => drillFormatter('accounts', props.data.debit_account_id, props.data.debit_account_id),
    },
    {
      field: 'credit_account_id',
      headerName: 'To Account',
      cellRenderer: props => drillFormatter('accounts', props.data.credit_account_id, props.data.credit_account_id),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      cellClassName: 'text-right font-medium',
      cellRenderer: props => props.data.amount
    }
  ],

  accountsColumns: [    
    {
      field: 'role',
      headerName: 'Role',
      cellClassName: 'font-medium text-gray-900',
      cellRenderer: props => props.data.role
    },
    {
      field: 'name',
      headerName: 'Account',
      cellRenderer: (props) => `${props.data.name} (ID: ${props.data.account_extra_id})`,
    },
    {
      field: 'account_code',
      headerName: 'Type',
      cellRenderer: props => getAccountType(props.data),
    },
    {
      field: 'entity',
      headerName: 'Entity',
      cellRenderer: props => {
        const entity = props.data.entity ? props.data.entity : props.data.r_entity;
        return entity ? drillFormatter('entities', entity.entity_id, entity.entity_id) : 'N/A';
      },
    }
  ],
  metadataColumns: [
    {
      field: 'key',
      headerName: 'Key',
    },
    {
      field: 'value',
      headerName: 'Value',
      cellRenderer: props => props.data.value.toString()
    }
  ]
};

    // // Basic section fields for detail view
    // detailSections: (item) => [
    //     {
    //         label: 'Event ID',
    //         content: item.event_id
    //     },
    //     {
    //         label: 'Template',
    //         content: item.r_template ? item.r_template.name : 'N/A'
    //     },
    //     {
    //         label: 'Status',
    //         content: item.status
    //     },
    //     {
    //         label: 'Created Date',
    //         content: formatDate(item.created_date, true)
    //     },
    //     {
    //         label: 'Completed Date',
    //         content: item.completed_date ? formatDate(item.completed_date, true) : 'Pending'
    //     }
    // ]
    