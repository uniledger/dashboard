import React, { useState, useEffect } from 'react';
import PageHeader from '../shared/PageHeader';

const API_BASE_URL = 'https://ledger.dev.ledgerrocket.com';

/**
 * Account List component to display all accounts
 * with proper nested data handling and API-based filtering
 */
const AccountList = ({ accounts, onViewJson, onRefresh }) => {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch entity data for display
  useEffect(() => {
    const fetchEntities = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/enriched-entities/`);
        const data = await response.json();
        setEntities(data);
      } catch (err) {
        console.error('Error fetching entities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, []);

  // Helper functions for data display
  const getAccountCodeDisplay = (account) => {
    if (!account) return 'N/A';
    
    // Handle when account_code is a full object
    if (account.account_code && typeof account.account_code === 'object') {
      return `${account.account_code.account_code} - ${account.account_code.name || ''}`;
    }
    
    // Handle when it's just the code value
    return account.account_code || account.code || 'N/A';
  };

  const getEntityForAccount = (account) => {
    // Get entity ID from account or its ledger
    const entityId = account.entity_id || 
      (account.enriched_ledger && account.enriched_ledger.entity_id);
    
    if (!entityId) return null;
    
    // Find entity in our fetched list
    return entities.find(e => e.entity_id === entityId);
  };

  const getFormattedBalance = (account) => {
    if (typeof account.balance !== 'number') return 'N/A';
    
    const currencyCode = 
      (account.enriched_ledger && account.enriched_ledger.r_currency && account.enriched_ledger.r_currency.currency_code) || 
      account.currency_code || 
      '';
    
    const scale = 
      (account.enriched_ledger && account.enriched_ledger.r_currency && account.enriched_ledger.r_currency.scale) || 
      account.scale || 
      2;
    
    return `${currencyCode} ${(account.balance / Math.pow(10, scale)).toLocaleString()}`;
  };

  return (
    <div>
      <PageHeader 
        title="Accounts Overview" 
        buttonText="+ New Account" 
        onButtonClick={() => console.log('Create new account')}
        refreshButton={true}
        onRefresh={onRefresh}
      />
      
      <div className="bg-white shadow overflow-hidden rounded-lg">
        {loading ? (
          <div className="px-6 py-4 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading accounts...</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ledger
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts && accounts.length > 0 ? accounts.map((account) => {
                const entity = getEntityForAccount(account);
                
                return (
                  <tr key={account.account_id || account.account_extra_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.account_id || account.account_extra_id || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {account.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getAccountCodeDisplay(account)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.account_type || (account.account_code && account.account_code.type) || account.type || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entity ? entity.name : (account.entity ? account.entity.name : 'N/A')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.enriched_ledger?.name || account.ledger?.name || account.ledger_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {getFormattedBalance(account)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    No accounts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AccountList;