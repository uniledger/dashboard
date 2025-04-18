/**
 * Model configuration for the application
 * Centralizes common definitions for different model types
 */
import React from 'react';
import { formatBalance, formatAccountCode, getCountryDisplay, getAccountType, getBalanceClass, getCurrencyInfo } from '../../../utils/formatters/index';
import DataTableSection from '../DataTableSection';

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
      key: 'entity_id',
      header: 'ID',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
    },
    {
      key: 'name',
      header: 'Name',
      cellClassName: 'font-medium text-gray-900',
    },
    {
      key: 'type',
      header: 'Type',
      render: (entity) => entity.type || entity.entity_type || 'N/A'
    },
    {
      key: 'country',
      header: 'Country',
      render: (entity) => getCountryDisplay(entity)
    },
    {
      key: 'kyc_status',
      header: 'KYC Status',
      render: (entity) => entity.kyc_status || 'N/A'
    }
  ],
  
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
      key: 'ledger_id',
      header: 'ID',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
    },
    {
      key: 'name',
      header: 'Name',
      cellClassName: 'font-medium text-gray-900',
    },
    {
      key: 'entity',
      header: 'Owner',
      // Use a more explicit render function that includes the entity ID in a data attribute
      render: (ledger) => {
        // Just return the name - clicking will be handled by the column's onClick handler
        return ledger.r_entity ? ledger.r_entity.name : (ledger.entity ? ledger.entity.name : 'N/A');
      }
    },
    {
      key: 'currency',
      header: 'Currency',
      render: (ledger) => ledger.r_currency ? `${ledger.r_currency.currency_code}` : (ledger.currency_code || 'N/A')
    },
    {
      key: 'country',
      header: 'Country',
      render: (ledger) => getCountryDisplay(ledger)
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
      key: 'account_id',
      header: 'ID',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
      render: (account) => account.account_id || account.account_extra_id || 'N/A'
    },
    {
      key: 'name',
      header: 'Account Name',
      cellClassName: 'font-medium text-gray-900',
    },
    {
      key: 'account_code',
      header: 'Account Code',
      render: (account) => formatAccountCode(account.account_code || account.code)
    },
    {
      key: 'account_type',
      header: 'Type',
      render: (account) => getAccountType(account)
    },
    {
      key: 'balance',
      header: 'Balance',
      align: 'right',
      cellClassName: (account) => getBalanceClass(account.balance),
      render: (account) => {
        const currency = getCurrencyInfo(account);
        return formatBalance(account.balance, currency, true);
      }
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
      content: (
        <div className="text-right">
          <span className={getBalanceClass(account.balance)}>
            {formatBalance(account.balance, getCurrencyInfo(account), true)}
          </span>
        </div>
      )
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
      key: 'template_id',
      header: 'ID',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
    },
    {
      key: 'name',
      header: 'Template Name',
      cellClassName: 'font-medium text-gray-900',
    },
    {
      key: 'product',
      header: 'Type',
      cellClassName: 'text-gray-500',
    },
    {
      key: 'description',
      header: 'Description',
      cellClassName: 'text-gray-500',
      render: (item) => {
        return item.description.length > 100 
          ? `${item.description.substring(0, 100)}...` 
          : item.description;
      }
    },
    {
      key: 'created_date',
      header: 'Created',
      cellClassName: 'text-gray-500',
      render: (item) => {
        return new Date(item.created_date * 1000).toLocaleDateString();
      }
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
      key: 'name',
      header: 'Name',
      render: (variable) => TemplateConfig.formatFieldName(variable.name),
      cellClassName: 'font-medium text-gray-900'
    },
    {
      key: 'value',
      header: 'Value',
      cellClassName: 'text-gray-500'
    }
  ],
  
  // Validations columns definition
  validationsColumns: [
    {
      key: 'name',
      header: 'Name',
      render: (validation) => TemplateConfig.formatFieldName(validation.name),
      cellClassName: 'font-medium text-gray-900'
    },
    {
      key: 'expression',
      header: 'Expression',
      cellClassName: 'text-gray-500'
    },
    {
      key: 'description',
      header: 'Description',
      cellClassName: 'text-gray-500'
    }
  ],
  
  // Legs columns definition
  legsColumns: [
    {
      key: 'leg_number',
      header: 'Leg Number',
      cellClassName: 'font-medium text-gray-900'
    },
    {
      key: 'debit_account',
      header: 'Debit Account',
      cellClassName: 'text-gray-500'
    },
    {
      key: 'credit_account',
      header: 'Credit Account',
      cellClassName: 'text-gray-500'
    },
    {
      key: 'code',
      header: 'Code',
      cellClassName: 'text-gray-500'
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      cellClassName: 'text-gray-500'
    }
  ],
  
  // Helper to render variable section
  renderVariablesSection: (template) => {
    return (
      <DataTableSection
        data={template.variables || []}
        columns={TemplateConfig.variablesColumns}
        title="Variables"
        emptyMessage="No variables defined"
      />
    );
  },
  
  // Helper to render validations section
  renderValidationsSection: (template) => {
    return (
      <DataTableSection
        data={template.validations || []}
        columns={TemplateConfig.validationsColumns}
        title="Validations"
        emptyMessage="No validations defined"
      />
    );
  },
  
  // Helper to render legs section
  renderLegsSection: (template) => {
    return (
      <DataTableSection
        data={template.legs || []}
        columns={TemplateConfig.legsColumns}
        title="Template Legs"
        emptyMessage="No legs defined"
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
export const formatDetailContent = (content, fieldName) => {
  // If it's a number and the field name doesn't contain 'id', format with decimal places
  if (typeof content === 'number' && !fieldName.toLowerCase().includes('id')) {
    return (
      <div className="text-right">
        {content.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      </div>
    );
  }
  
  // If it's a string but represents a numeric field, right-align it
  if (typeof content === 'string' && isNumericField(fieldName)) {
    return <div className="text-right">{content}</div>;
  }
  
  // Otherwise return as-is
  return content;
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
  isNumericField,
  formatDetailContent
};export default modelConfigs;