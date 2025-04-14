import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://ledger.dev.ledgerrocket.com';

/**
 * Account Detail component to display detailed information about a single account
 */
const AccountDetail = ({ 
  account, 
  onBack, 
  onViewJson, 
  onRefresh,
  onViewEntity,
  onViewLedger
}) => {
  const [entity, setEntity] = useState(null);
  const [ledger, setLedger] = useState(null);
  
  // Fetch entity and ledger details if needed
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        // Get entity ID either directly or from the ledger
        const entityId = account.entity_id || 
          (account.enriched_ledger && account.enriched_ledger.entity_id);
          
        // Get ledger ID
        const ledgerId = account.ledger_id || 
          (account.enriched_ledger && account.enriched_ledger.ledger_id);
        
        // Fetch entity details if not available
        if (entityId && !account.entity && !account.enriched_entity) {
          const entityResponse = await fetch(`${API_BASE_URL}/api/v1/enriched-entities/${entityId}`);
          const entityData = await entityResponse.json();
          setEntity(entityData);
        }
        
        // Fetch ledger details if not available
        if (ledgerId && !account.ledger && !account.enriched_ledger) {
          const ledgerResponse = await fetch(`${API_BASE_URL}/api/v1/enriched-ledgers/${ledgerId}`);
          const ledgerData = await ledgerResponse.json();
          setLedger(ledgerData);
        }
      } catch (err) {
        console.error('Error fetching reference data:', err);
      }
    };
    
    fetchReferenceData();
  }, [account]);
  
  if (!account) return null;
  
  // Resolve entity from different sources
  const resolvedEntity = account.entity || account.enriched_entity || entity || 
    (account.enriched_ledger && account.enriched_ledger.entity);
  
  // Resolve ledger from different sources
  const resolvedLedger = account.ledger || account.enriched_ledger || ledger;
  
  // Format balance
  const formatBalance = () => {
    if (typeof account.balance !== 'number') return 'N/A';
    
    const currencyCode = 
      (resolvedLedger && resolvedLedger.r_currency && resolvedLedger.r_currency.currency_code) || 
      account.currency_code || 
      '';
    
    const scale = 
      (resolvedLedger && resolvedLedger.r_currency && resolvedLedger.r_currency.scale) || 
      account.scale || 
      2;
    
    const balance = account.balance / Math.pow(10, scale);
    
    // Format negative numbers with parentheses and no decimals
    if (balance < 0) {
      return `(${Math.abs(Math.round(balance))})`;
    } else {
      return `${Math.round(balance)}`;
    }
  };
  
  // Get account code display
  const getAccountCodeDisplay = () => {
    // Handle when account_code is a full object
    if (account.account_code && typeof account.account_code === 'object') {
      return `${account.account_code.account_code} - ${account.account_code.name || ''}`;
    }
    
    // Handle when it's just the code value
    return account.account_code || account.code || 'N/A';
  };
  
  // Get account type
  const getAccountType = () => {
    return account.account_type || 
      (account.account_code && account.account_code.type) || 
      account.type || 
      'N/A';
  };
  
  return (
    <div>
      {/* Account Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-3 text-gray-600 hover:text-gray-800"
          >
            ← Back to Accounts
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {account.name || `Account ${account.account_id || account.account_extra_id}`}
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
            onClick={() => onViewJson(account, `Account: ${account.name || 'Detail'}`)}
          >
            <span>View Full JSON</span>
            <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Account Details Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">ID</p>
            <p className="text-gray-900">{account.account_id || account.account_extra_id || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-gray-900">{account.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Code</p>
            <p className="text-gray-900">{getAccountCodeDisplay()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="text-gray-900">{getAccountType()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Owner</p>
            <p 
              className={`text-gray-900 ${resolvedEntity?.entity_id ? 'text-blue-600 cursor-pointer hover:underline' : ''}`}
              onClick={() => resolvedEntity?.entity_id && onViewEntity && onViewEntity(resolvedEntity.entity_id)}
            >
              {resolvedEntity?.name || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ledger</p>
            <p 
              className={`text-gray-900 ${resolvedLedger?.ledger_id ? 'text-blue-600 cursor-pointer hover:underline' : ''}`}
              onClick={() => resolvedLedger?.ledger_id && onViewLedger && onViewLedger(resolvedLedger.ledger_id)}
            >
              {resolvedLedger?.name || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Balance</p>
            <p className={`text-gray-900 font-medium text-right ${account.balance < 0 ? 'text-red-600' : ''}`}>
              {formatBalance()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Currency</p>
            <p className="text-gray-900">
              {resolvedLedger?.r_currency?.currency_code || account.currency_code || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="text-gray-900">
              {account.created_at 
                ? new Date(account.created_at).toLocaleString()
                : 'N/A'
              }
            </p>
          </div>
        </div>
      </div>
      
      {/* Account Properties */}
      <h3 className="text-lg font-medium text-gray-900 mb-3">Account Properties</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(account)
              .filter(([key]) => !['entity', 'ledger', 'enriched_entity', 'enriched_ledger', 'account_code'].includes(key))
              .filter(([_, value]) => typeof value !== 'object' || value === null)
              .map(([key, value]) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{key}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {typeof value === 'object' 
                      ? (value === null ? 'null' : JSON.stringify(value)) 
                      : String(value)
                    }
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      
      {/* Account Code Details (if available) */}
      {account.account_code && typeof account.account_code === 'object' && (
        <>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Account Code Details</h3>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(account.account_code).map(([key, value]) => (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{key}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {typeof value === 'object' 
                        ? (value === null ? 'null' : JSON.stringify(value)) 
                        : String(value)
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountDetail;