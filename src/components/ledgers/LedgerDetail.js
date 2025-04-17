import React, { useState, useEffect } from 'react';
import { DetailCard, ActionButton } from '../common';
import { formatBalance, getCountryDisplay } from '../../utils/formatters';
import apiService from '../../services/apiService';
import { LEDGER_API_BASE_URL } from '../../config/api';

/**
 * Ledger Detail component to display a single ledger with its accounts
 * using the standard DetailCard component for consistency
 */
const LedgerDetail = ({ 
  ledger,
  ledgerAccounts,
  onBack,
  onViewJson,
  onRefresh,
  onViewEntity,
  onViewAccount
}) => {
  // All hooks must be at the top level
  const [entity, setEntity] = useState(null);
  const [entities, setEntities] = useState([]);
  
  // Use useEffect for fetching entity details
  useEffect(() => {
    // Skip if no ledger or if ledger already has entity data
    if (!ledger || !ledger.entity_id || ledger.r_entity) {
      return;
    }
    
    const fetchEntity = async () => {
      try {
        const response = await fetch(`${LEDGER_API_BASE_URL}/api/v1/enriched-entities/${ledger.entity_id}`);
        const data = await response.json();
        setEntity(data);
      } catch (err) {
        console.error('Error fetching entity details:', err);
      }
    };

    fetchEntity();
  }, [ledger]);
  
  // Fetch all entities for linking accounts to their owners
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await fetch(`${LEDGER_API_BASE_URL}/api/v1/enriched-entities/`);
        const data = await response.json();
        setEntities(data);
      } catch (err) {
        console.error('Error fetching entities:', err);
      }
    };
    
    fetchEntities();
  }, []);

  // Early return if no ledger, but after hooks are declared
  if (!ledger) return null;
  
  // Helper function for account codes
  const getAccountCodeDisplay = (account) => {
    if (!account) return 'N/A';
    
    // Handle when account_code is a full object
    if (account.account_code && typeof account.account_code === 'object') {
      return `${account.account_code.account_code} - ${account.account_code.name || ''}`;
    }
    
    // Handle when it's just the code value
    return account.account_code || 'N/A';
  };
  
  // Helper function to find entity for an account
  const getEntityForAccount = (account) => {
    // Get entity ID from account or its ledger
    const entityId = account.entity_id || 
      (account.enriched_ledger && account.enriched_ledger.entity_id) ||
      (account.entity && account.entity.entity_id);
    
    if (!entityId) {
      return null;
    }
    
    // Find entity in our fetched list
    const foundEntity = entities.find(e => e.entity_id === entityId);
    return foundEntity;
  };
  
  // Get entity from ledger or from separate fetch
  const displayEntity = ledger.r_entity || entity;
  
  // Define sections for the detail card
  const detailSections = [
    {
      label: 'Ledger ID',
      content: ledger.ledger_id
    },
    {
      label: 'Name',
      content: ledger.name
    },
    {
      label: 'Ledger Owner',
      content: displayEntity ? (
        <button 
          className="text-blue-600 hover:text-blue-800 hover:underline"
          onClick={() => displayEntity && onViewEntity && onViewEntity(displayEntity.entity_id)}
        >
          {displayEntity.name}
        </button>
      ) : 'N/A'
    },
    {
      label: 'Currency',
      content: ledger.r_currency 
        ? `${ledger.r_currency.currency_code} (${ledger.r_currency.type})` 
        : 'N/A'
    },
    {
      label: 'Country',
      content: getCountryDisplay(ledger)
    },
    {
      label: 'Description',
      content: ledger.description || 'No description'
    }
  ];
  
  // Define actions for the detail card
  const detailActions = (
    <>
      <ActionButton
        variant="outline"
        onClick={() => onViewJson(ledger, `Ledger: ${ledger.name}`)}
      >
        View JSON
      </ActionButton>
      <ActionButton
        variant="outline"
        onClick={onRefresh}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        }
      >
        Refresh
      </ActionButton>
      <ActionButton
        variant="secondary"
        onClick={onBack}
      >
        Back
      </ActionButton>
    </>
  );
  
  return (
    <div>
      {/* Ledger Details Card using standard DetailCard component */}
      <DetailCard
        title="Ledger Detail"
        subtitle={ledger.name}
        sections={detailSections}
        actions={detailActions}
      />
      
      {/* Ledger's Accounts */}
      <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">Accounts in this Ledger</h3>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Owner</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ledgerAccounts && ledgerAccounts.length > 0 ? ledgerAccounts
              // Sort accounts by account code
              .sort((a, b) => {
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
              })
              .map(account => {
              const accountEntity = getEntityForAccount(account);
              const accountEntityId = accountEntity?.entity_id || account.entity_id || (account.enriched_ledger && account.enriched_ledger.entity_id);
              const balance = account.balance / Math.pow(10, ledger.r_currency?.scale || 2);
              const isNegative = balance < 0;
              
              return (
                <tr key={account.account_id || account.account_extra_id} className="hover:bg-gray-50">
                  <td 
                    className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline"
                    onClick={() => onViewAccount ? onViewAccount(account) : onViewJson(account, `Account: ${account.name || 'N/A'}`)}
                  >
                    {account.account_id || account.account_extra_id || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {account.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getAccountCodeDisplay(account)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.account_type || (account.account_code && account.account_code.type) || 'N/A'}
                  </td>
                  <td 
                    className={`px-6 py-4 whitespace-nowrap text-sm ${accountEntityId ? 'text-blue-600 cursor-pointer hover:underline' : 'text-gray-500'}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent other click handlers from firing
                      if (accountEntityId && onViewEntity) {
                        onViewEntity(accountEntityId);
                      }
                    }}
                  >
                    {accountEntity ? accountEntity.name : (account.entity ? account.entity.name : 'N/A')}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${isNegative ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatBalance(account.balance, ledger.r_currency, true)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <button 
                      className="text-gray-600 hover:text-gray-800"
                      onClick={() => onViewJson(account, `Account: ${account.name || 'N/A'}`)}
                    >
                      JSON
                    </button>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No accounts found for this ledger
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LedgerDetail;