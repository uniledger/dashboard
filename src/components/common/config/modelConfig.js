/**
 * Model configuration for the application
 * Centralizes common definitions for different model types
 */
import { formatBalance, formatAccountCode, getCountryDisplay, getAccountType, getBalanceClass, getCurrencyInfo } from '../../../utils/formatters';

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
      key: 'ledger_count',
      header: 'Ledgers',
      render: (entity) => entity.ledger_count || (entity.ledgers && entity.ledgers.length) || 0
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
      label: 'Description',
      content: entity.description || 'No description'
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
        <span className={getBalanceClass(account.balance)}>
          {formatBalance(account.balance, getCurrencyInfo(account), true)}
        </span>
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
  
  // Helper to render variable section
  renderVariablesSection: (template) => {
    return {
      label: 'Variables',
      content: (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {template.variables.map((variable, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {TemplateConfig.formatFieldName(variable.name)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variable.value}</td>
                </tr>
              ))}
              {template.variables.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No variables defined</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )
    };
  },
  
  // Helper to render validations section
  renderValidationsSection: (template) => {
    return {
      label: 'Validations',
      content: (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expression</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {template.validations.map((validation, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {TemplateConfig.formatFieldName(validation.name)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{validation.expression}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{validation.description}</td>
                </tr>
              ))}
              {template.validations.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No validations defined</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )
    };
  },
  
  // Helper to render legs section
  renderLegsSection: (template) => {
    return {
      label: 'Template Legs',
      content: (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leg Number</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit Account</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Account</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {template.legs.map((leg, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{leg.leg_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leg.debit_account}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leg.credit_account}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leg.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leg.amount}</td>
                </tr>
              ))}
              {template.legs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No legs defined</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )
    };
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
  
  // Get all sections including tables
  getAllSections: (template) => {
    if (!template) return [];
    
    return [
      ...TemplateConfig.detailSections(template),
      TemplateConfig.renderVariablesSection(template),
      TemplateConfig.renderValidationsSection(template),
      TemplateConfig.renderLegsSection(template)
    ];
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
  displayField: 'name',
  
  // Column definitions for list view
  listColumns: [
    {
      key: 'rule_id',
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
      cellClassName: 'text-gray-500',
    },
    {
      key: 'status',
      header: 'Status',
      cellClassName: (item) => {
        return item.status === 'ACTIVE' 
          ? 'text-green-600 font-medium' 
          : 'text-gray-500';
      }
    },
    {
      key: 'created_date',
      header: 'Created',
      render: (item) => new Date(item.created_date * 1000).toLocaleString()
    }
  ]
};

// Export all configurations
export default {
  EntityConfig,
  LedgerConfig,
  AccountConfig,
  TemplateConfig,
  ProcessedEventConfig,
  RuleConfig
};