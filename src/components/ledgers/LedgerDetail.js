import React, { useState, useEffect } from 'react';
import { formatBalance, getCountryDisplay } from '../../utils/formatters';

const API_BASE_URL = 'https://ledger.dev.ledgerrocket.com';

/**
 * Ledger Detail component to display a single ledger with its accounts
 * with proper nested data handling
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
  console.log('LedgerDetail mounted with ledger:', ledger?.ledger_id);
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
        const response = await fetch(`${API_BASE_URL}/api/v1/enriched-entities/${ledger.entity_id}`);
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
        const response = await fetch(`${API_BASE_URL}/api/v1/enriched-entities/`);
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
  
  // Helper function to find entity for an account with improved debugging
  const getEntityForAccount = (account) => {
    // Debug the input account structure
    console.log("Account entity resolution:", {
      account_name: account.name,
      account_id: account.account_id,
      entity_id: account.entity_id,
      enriched_ledger_entity_id: account.enriched_ledger?.entity_id
    });
    
    // Get entity ID from account or its ledger
    const entityId = account.entity_id || 
      (account.enriched_ledger && account.enriched_ledger.entity_id) ||
      (account.entity && account.entity.entity_id);
    
    if (!entityId) {
      console.log("No entity ID found for account:", account.name);
      return null;
    }
    
    // Find entity in our fetched list
    const foundEntity = entities.find(e => e.entity_id === entityId);
    console.log("Entity lookup result:", foundEntity ? foundEntity.name : "Not found");
    return foundEntity;
  };
  
  // Get entity from ledger or from separate fetch
  const displayEntity = ledger.r_entity || entity;
  
  return (
    <div>
      {/* Ledger Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => {
              console.log('Back to ledger list clicked');
              onBack();
            }}
            className="mr-3 text-gray-600 hover:text-gray-800"
          >
            ← Back to Ledgers
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {ledger.name}
          </h2>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={onRefresh}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            title="Refresh data"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button 
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
            onClick={() => onViewJson(ledger, `Ledger: ${ledger.name}`)}
          >
            <span>View Full JSON</span>
            <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Ledger Details Card */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">ID</p>
            <p className="text-gray-900">{ledger.ledger_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-gray-900">{ledger.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ledger Owner</p>
            <p 
              className={`${displayEntity ? 'text-blue-600 cursor-pointer hover:underline' : 'text-gray-900'}`}
              onClick={() => displayEntity && onViewEntity && onViewEntity(displayEntity.entity_id)}
            >
              {displayEntity?.name || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Currency</p>
            <p className="text-gray-900">
              {ledger.r_currency 
                ? `${ledger.r_currency.currency_code} (${ledger.r_currency.type})` 
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Country</p>
            <p className="text-gray-900">{getCountryDisplay(ledger)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-gray-900">{ledger.description || 'N/A'}</p>
          </div>
        </div>
      </div>
      
      {/* Ledger's Accounts */}
      <h3 className="text-lg font-medium text-gray-900 mb-2">Accounts in this Ledger</h3>
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
              // Debug the entity ID
              console.log("Account:", account.name, "Entity ID:", account.entity_id, "Entity from lookup:", accountEntity);
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
                        console.log("Clicking entity owner:", accountEntityId);
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