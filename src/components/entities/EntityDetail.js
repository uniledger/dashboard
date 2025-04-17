import React from 'react';
import { GenericDetailView, DataTableSection, EntityConfig } from '../common';
import { getCountryDisplay, formatAccountCode, formatBalance, getBalanceClass, getCurrencyInfo } from '../../utils/formatters';

/**
 * Entity Detail component using GenericDetailView
 */
const EntityDetail = ({ 
  entity,
  entityLedgers,
  entityAccounts,
  onBack,
  onViewJson,
  onViewLedger,
  onViewAccount,
  onRefresh
}) => {
  if (!entity) return null;

  // Helper function to format account code
  const getAccountCodeDisplay = (account) => {
    if (!account) return 'N/A';
    return formatAccountCode(account.account_code || account.code);
  };
  
  // Define basic information sections
  const basicSections = EntityConfig.detailSections(entity);
  
  // Define the ledgers table section
  const ledgersTableSection = {
    label: 'Ledgers Owned',
    content: (
      <DataTableSection
        data={entityLedgers || []}
        title="Ledgers"
        columns={[
          {
            key: 'ledger_id',
            header: 'ID',
            cellClassName: 'text-blue-600 cursor-pointer hover:underline',
            onClick: (ledger) => {
              onViewLedger(ledger.ledger_id);
              return true; // Prevent row click propagation
            }
          },
          {
            key: 'name',
            header: 'Name',
            cellClassName: 'font-medium text-gray-900'
          },
          {
            key: 'currency',
            header: 'Currency',
            render: (ledger) => ledger.r_currency ? `${ledger.r_currency.currency_code} (${ledger.r_currency.type})` : 'N/A'
          },
          {
            key: 'country',
            header: 'Country',
            render: (ledger) => getCountryDisplay(ledger, entity)
          },
          {
            key: 'actions',
            header: 'Actions',
            align: 'center',
            render: (ledger) => (
              <button 
                className="text-gray-600 hover:text-gray-800"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewJson(ledger, `Ledger: ${ledger.name}`);
                }}
              >
                JSON
              </button>
            )
          }
        ]}
        onRowClick={(ledger) => onViewLedger(ledger.ledger_id)}
        emptyMessage="No ledgers found for this entity"
      />
    )
  };
  
  // Define the accounts table section
  const accountsTableSection = {
    label: 'Accounts',
    content: (
      <DataTableSection
        data={entityAccounts || []}
        title="Accounts"
        columns={[
          {
            key: 'account_id',
            header: 'ID',
            cellClassName: 'text-blue-600 cursor-pointer hover:underline',
            render: (account) => account.account_id || account.account_extra_id || 'N/A',
            onClick: (account) => {
              onViewAccount(account);
              return true; // Prevent row click propagation
            }
          },
          {
            key: 'name',
            header: 'Name',
            cellClassName: 'font-medium text-gray-900',
            render: (account) => account.name || 'N/A'
          },
          {
            key: 'account_code',
            header: 'Account Code',
            render: (account) => getAccountCodeDisplay(account)
          },
          {
            key: 'type',
            header: 'Type',
            render: (account) => account.account_type || (account.account_code && account.account_code.type) || 'N/A'
          },
          {
            key: 'ledger',
            header: 'Ledger',
            cellClassName: (account) => account.enriched_ledger ? 'text-blue-600 cursor-pointer hover:underline' : 'text-gray-500',
            render: (account) => account.enriched_ledger ? account.enriched_ledger.name : 'N/A',
            onClick: (account) => {
              if (account.enriched_ledger) {
                onViewLedger(account.enriched_ledger.ledger_id);
                return true; // Prevent row click propagation
              }
              return false;
            }
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
          },
          {
            key: 'actions',
            header: 'Actions',
            align: 'center',
            render: (account) => (
              <button 
                className="text-gray-600 hover:text-gray-800"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewJson(account, `Account: ${account.name || 'N/A'}`);
                }}
              >
                JSON
              </button>
            )
          }
        ]}
        sortFunction={(a, b) => {
          // Extract account code from account_code or name
          const getCode = (account) => {
            if (account.account_code && typeof account.account_code === 'object') {
              return String(account.account_code.account_code || '');
            } else if (typeof account.account_code === 'string') {
              return account.account_code;
            } else if (account.name && account.name.includes('-')) {
              return account.name.split('-')[0].trim();
            }
            return '';
          };
          const codeA = getCode(a);
          const codeB = getCode(b);
          return (codeA || '').toString().localeCompare((codeB || '').toString());
        }}
        onRowClick={(account) => onViewAccount(account)}
        emptyMessage="No accounts found for this entity"
      />
    )
  };
  
  return (
    <GenericDetailView
      data={entity}
      title="Entity Detail"
      subtitle={entity.name}
      sections={basicSections}
      childrenSections={[ledgersTableSection, accountsTableSection]}
      onBack={onBack}
      onRefresh={onRefresh}
      onViewJson={onViewJson}
    />
  );
};

export default EntityDetail;