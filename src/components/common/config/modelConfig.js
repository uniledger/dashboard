/**
 * Model configuration for the application
 * Centralizes common definitions for different model types
 */
import React from 'react';
import { formatBalance, formatAccountCode, getCountryDisplay, getAccountType, getCurrencyInfo } from '../../../utils/formatters/index';
import { formatDate } from '../../../utils/formatters/dateFormatters';
import GenericListView from '../GenericDetailView.js';
import { accountIDCellRenderer, accountCodeCellRenderer, accountTypeCellRenderer, balanceCellRenderer, entityTypeCellRenderer, countryCellRenderer, kycStatusCellRenderer, entityOwnerCellRenderer, ledgerCurrencyCellRenderer } from '../../common/CellRenderers.js';

/**
 * Entity model configuration
 */
export const EntityConfig = {
  title: 'Entity',
  idField: 'entity_id',
  displayField: 'name',
  
  // Column definitions for list view
  listColumns: [
    {
      field: 'entity_id',
      headerName: 'ID',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
    },
    {
      field: 'name',
      headerName: 'Name',
      cellClassName: 'font-medium text-gray-900',
    },
    {
      field: 'type',
      headerName: 'Type',
      cellRenderer: entityTypeCellRenderer
    },
    {
      field: 'country',
      headerName: 'Country',
      cellRenderer: countryCellRenderer
    },
    {
      field: 'kyc_status',
      headerName: 'KYC Status',
      cellRenderer: kycStatusCellRenderer
    }
  ],
  
  // Basic section fields for detail view
  detailSections: (entity) => [
    {
      headerName: 'Entity ID',
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
  ]
};

/**
 * Ledger model configuration
 */
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

/**
 * Account model configuration
 */
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

/**
 * Template model configuration
 */
export const TemplateConfig = {
  title: 'Template',
  idField: 'template_id',
  displayField: 'name',
  
  // Column definitions for list view
  listColumns: [
    {
      field: 'template_id',
      headerName: 'ID',
    },
    {
      field: 'name',
      headerName: 'Template Name',
    },
    {
      field: 'product',
      headerName: 'Type',
    },
    {
      field: 'description',
      headerName: 'Description',
      // render: (item) => {
      //   return item.description.length > 100 
      //     ? `${item.description.substring(0, 100)}...` 
      //     : item.description;
      // }
    },
    {
      field: 'created_date',
      headerName: 'Created',
      // render: (item) => {
      //   return new Date(item.created_date * 1000).toLocaleDateString();
      // }
    }
  ],
  
  // Format field names by removing underscores and capitalizing each word
  formatFieldName: (fieldName) => {
    return fieldName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },
  
  // Variables columns definition
  variablesColumns: [
    {
      field: 'name',
      headerName: 'Name',
      cellRenderer: (params) => TemplateConfig.formatFieldName(params.data.name),
      //cellClassName: 'font-medium text-gray-900'
    },
    {
      field: 'value',
      headerName: 'Value',
      //cellClassName: 'text-gray-500'
    }
  ],
  
  // Validations columns definition
  validationsColumns: [
    {
      field: 'name',
      headerName: 'Name',
      cellRenderer: (params) => TemplateConfig.formatFieldName(params.data.name),
      //cellClassName: 'font-medium text-gray-900'
    },
    {
      field: 'expression',
      headerName: 'Expression',
      //cellClassName: 'text-gray-500'
    },
    {
      field: 'description',
      headerName: 'Description',
      //cellClassName: 'text-gray-500'
    }
  ],
  
  // Legs columns definition
  legsColumns: [
    {
      field: 'leg_number',
      headerName: 'Leg Number',
      //cellClassName: 'font-medium text-gray-900'
    },
    {
      field: 'debit_account',
      headerName: 'Debit Account',
      //cellClassName: 'text-gray-500'
    },
    {
      field: 'credit_account',
      headerName: 'Credit Account',
      //cellClassName: 'text-gray-500'
    },
    {
      field: 'code',
      headerName: 'Code',
      //cellClassName: 'text-gray-500'
    },
    {
      field: 'amount',
      headerName: 'Amount',
      align: 'right',
      //cellClassName: 'text-gray-500'
    }
  ],
  
  // Helper to render variable section
  renderVariablesSection: (template) => {
    console.log('Template variables:', template?.variables);
    console.log('Variables columns:', TemplateConfig.variablesColumns);
    
    return (
      <GenericListView
        data={template.variables || []}
        columns={TemplateConfig.variablesColumns}
        idField="name"
        title="Variables"
        emptyMessage="No variables defined"
        onViewJson={null} // Will be injected by parent component
        onRefresh={null} // Will be injected by parent component
        loading={false}
      />
    );
  },
  
  // Helper to render validations section
  renderValidationsSection: (template) => {
    return (
      <GenericListView
        data={template.validations || []}
        columns={TemplateConfig.validationsColumns}
        title="Validations"
        emptyMessage="No validations defined"
        onViewJson={null} // Will be injected by parent component
        onRefresh={null} // Will be injected by parent component
        loading={false}
      />
    );
  },
  
  // Helper to render legs section
  renderLegsSection: (template) => {
    return (
      <GenericListView
        data={template.legs || []}
        columns={TemplateConfig.legsColumns}
        title="Template Legs"
        emptyMessage="No legs defined"
        onViewJson={null} // Will be injected by parent component
        onRefresh={null} // Will be injected by parent component
        loading={false}
      />
    );
  },
  
  // Basic section fields for detail view
  detailSections: (template) => {
    if (!template) return [];
    
    return [
      {
        label: 'Template ID',
        content: template.template_id
      },
      {
        label: 'Name',
        content: template.name
      },
      {
        label: 'Description',
        content: template.description
      },
      {
        label: 'Product Type',
        content: template.product
      },
      {
        label: 'Created',
        content: `${new Date(template.created_date * 1000).toLocaleString()} by ${template.created_by}`
      }
    ];
  },
  
  // This method is deprecated - we now display tables separately
  getAllSections: (template) => {
    // Return just the basic sections for backward compatibility
    return TemplateConfig.detailSections(template);
  }
};

/**
 * ProcessedEvent model configuration
 */
export const ProcessedEventConfig = {
  title: 'Processed Event',
  idField: 'processed_event_id',
  displayField: 'description',
  
  // Column definitions for list view
  listColumns: [
    {
      key: 'processed_event_id',
      header: 'ID',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
    },
    {
      key: 'status',
      header: 'Status',
      cellClassName: (item) => {
        return item.status === 'COMPLETED' 
          ? 'text-green-600 font-medium' 
          : item.status === 'FAILED' 
            ? 'text-red-600 font-medium' 
            : 'text-yellow-600 font-medium';
      }
    },
    {
      key: 'template_id',
      header: 'Template',
      render: (item) => item.template ? item.template.name : item.template_id
    },
    {
      key: 'created_date',
      header: 'Created',
      render: (item) => new Date(item.created_date * 1000).toLocaleString()
    },
    {
      key: 'completed_date',
      header: 'Completed',
      render: (item) => item.completed_date ? new Date(item.completed_date * 1000).toLocaleString() : 'N/A'
    }
  ]
};

/**
 * Rule model configuration
 */
export const RuleConfig = {
  title: 'Rule',
  idField: 'rule_id',
  displayField: 'rule_id',
  
  // Column definitions for list view
  listColumns: [
    {
      key: 'rule_id',
      header: 'ID',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
    }
  ]
};

/**
 * Helper utility to determine if a field is numeric and needs right-alignment
 * @param {string} fieldName - The field name to check
 * @returns {boolean} - Whether this is a numeric field
 */
export const isNumericField = (fieldName) => {
  if (!fieldName) return false;
  
  const lowerName = fieldName.toLowerCase();
  
  // First check exclusions - IDs and codes are not numeric fields even if they contain numbers
  if (
    lowerName.includes('id') || 
    lowerName.includes('code') ||
    lowerName.includes('reference')
  ) {
    return false;
  }
  
  // Then check inclusions
  return (
    lowerName === 'balance' ||
    lowerName === 'amount' ||
    lowerName === 'value' ||
    lowerName.includes('total') ||
    lowerName.includes('price') ||
    lowerName.includes('cost') ||
    lowerName.includes('fee') ||
    lowerName.includes('quantity') ||
    lowerName.includes('ratio')
  );
};

/**
 * Helper to format content for detail cards, applying correct styling for numeric values
 * @param {*} content - The content to format
 * @param {string} fieldName - The field name for context
 * @returns {*} - Formatted content
 */
// export const formatDetailContent = (content, fieldName) => {
//   // If it's a number and the field name doesn't contain 'id', format with decimal places
//   if (typeof content === 'number' && !fieldName.toLowerCase().includes('id')) {
//     return (
//       <div className="text-right">
//         {content.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//       </div>
//     );
//   }
  
//   // If it's a string but represents a numeric field, right-align it
//   if (typeof content === 'string' && isNumericField(fieldName)) {
//     return <div className="text-right">{content}</div>;
//   }
  
//   // Otherwise return as-is
//   return content;
// };

/**
 * Transfer model configuration
 */
export const TransferConfig = {
  title: 'Transfer',
  idField: 'transfer_id',
  displayField: 'transfer_id',
  
  // Column definitions for list view
  listColumns: [
    {
      field: 'transfer_id',
      headerName: 'ID',
    },
    {
      field: 'account_id',
      headerName: 'From Account',
      render: (transfer) => transfer.account_id || 'N/A'
    },
    {
      field: 'to_account_id',
      headerName: 'To Account',
      render: (transfer) => transfer.to_account_id || 'N/A'
    },
    {
      field: 'amount',
      headerName: 'Amount',
      render: (transfer) => formatBalance(transfer.amount, { currency_code: transfer.currency_code })
    },
    {
      field: 'timestamp',
      headerName: 'Date',

      render: (transfer) => formatDate(transfer.timestamp, true)
    },
    {
      field: 'ledger_id',
      headerName: 'Ledger',
      render: (transfer) => transfer.ledger_id || 'N/A'
    }
  ],
  
  // Basic section fields for detail view
  detailSections: (transfer) => [
    {
      label: 'Transfer ID',
      content: transfer.transfer_id
    },
    {
      label: 'From Account',
      content: transfer.account_id
    },
    {
      label: 'To Account',
      content: transfer.to_account_id
    },
    {
      label: 'Amount',
      content: (
        <div className="text-right">
          <span /*className={getBalanceClass(transfer.amount)}*/>
            {formatBalance(transfer.amount, { currency_code: transfer.currency_code })}
          </span>
        </div>
      )
    },
    {
      label: 'Timestamp',
      content: formatDate(transfer.timestamp, true)
    },
    {
      label: 'Ledger ID',
      content: transfer.ledger_id
    },
    {
      label: 'Event ID',
      content: transfer.event_id || 'N/A'
    }
  ]
};

/**
 * Export all configurations
 */
const modelConfigs = {
  EntityConfig,
  LedgerConfig,
  AccountConfig,
  TemplateConfig,
  ProcessedEventConfig,
  RuleConfig,
  TransferConfig,
  isNumericField,
};export default modelConfigs;