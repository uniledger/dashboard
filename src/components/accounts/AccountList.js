import React, { useState, useEffect } from 'react';
import PageHeader from '../shared/PageHeader';
import { formatBalance, formatAccountCode } from '../../utils/formatters';

const API_BASE_URL = 'https://ledger.dev.ledgerrocket.com';

/**
 * Account List component to display all accounts
 * with proper nested data handling and API-based filtering
 */
const AccountList = ({ accounts, accountTypeFilter, onViewJson, onRefresh, onViewEntity, onViewLedger, onViewAccount, onClearFilter }) => {
  const [entities, setEntities] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch entity and ledger data for display and drilldown
  useEffect(() => {
    const fetchReferenceData = async () => {
      setLoading(true);
      try {
        // Fetch entities
        const entitiesResponse = await fetch(`${API_BASE_URL}/api/v1/enriched-entities/`);
        const entitiesData = await entitiesResponse.json();
        setEntities(entitiesData);
        
        // Fetch ledgers
        const ledgersResponse = await fetch(`${API_BASE_URL}/api/v1/enriched-ledgers/`);
        const ledgersData = await ledgersResponse.json();
        setLedgers(ledgersData);
      } catch (err) {
        console.error('Error fetching reference data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferenceData();
  }, []);

  // Helper functions for data display
  const getAccountCodeDisplay = (account) => {
    if (!account) return 'N/A';
    
    return formatAccountCode(account.account_code || account.code);
  };

  // Helper function to find entity for an account with improved debugging
  const getEntityForAccount = (account) => {
    // Debug the input account structure
    console.log("Account entity resolution (AccountList):", {
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
  
  const getLedgerForAccount = (account) => {
    // Get ledger ID directly
    const ledgerId = account.ledger_id || 
      (account.enriched_ledger && account.enriched_ledger.ledger_id);
    
    if (!ledgerId) return null;
    
    // Find ledger in our fetched list
    return ledgers.find(l => l.ledger_id === ledgerId);
  };

  const getFormattedBalance = (account) => {
    if (typeof account.balance !== 'number') return 'N/A';
    
    // Get the currency from the account's ledger
    const ledger = getLedgerForAccount(account);
    const currency = (ledger && ledger.r_currency) || 
                    (account.enriched_ledger && account.enriched_ledger.r_currency);
    
    return formatBalance(account.balance, currency, true);
  };

  const getCurrencyCode = (account) => {
    return (account.enriched_ledger && account.enriched_ledger.r_currency && account.enriched_ledger.r_currency.currency_code) || 
      account.currency_code || 
      'N/A';
  };

  return (
    <div>
      <PageHeader 
        title={accountTypeFilter ? `${accountTypeFilter.charAt(0) + accountTypeFilter.slice(1).toLowerCase()} Accounts` : "Accounts Overview"} 
        buttonText="+ New Account" 
        onButtonClick={() => console.log('Create new account')}
        refreshButton={true}
        onRefresh={onRefresh}
      />
      
      {/* Filter Banner */}
      {accountTypeFilter && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4 flex justify-between items-center">
          <div>
            <p className="text-blue-700 font-medium">Filtered by account type: <span className="font-bold">{accountTypeFilter}</span></p>
            <p className="text-sm text-blue-600">Showing {accounts.length} {accountTypeFilter.toLowerCase()} accounts</p>
          </div>
          <button 
            onClick={onClearFilter}
            className="px-3 py-1 bg-white border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50 text-sm"
          >
            Clear Filter
          </button>
        </div>
      )}
      
      <div className="bg-white shadow overflow-x-auto rounded-lg">
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
                  Account Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ledger
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Currency
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts && accounts.length > 0 ? accounts
                // Sort accounts by account code (prefix of account name)
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
                .map((account) => {
                const entity = getEntityForAccount(account);
                const ledger = getLedgerForAccount(account);
                const entityId = entity?.entity_id || account.entity_id || (account.enriched_ledger && account.enriched_ledger.entity_id) || (account.entity && account.entity.entity_id);
                const ledgerId = ledger?.ledger_id || account.ledger_id || (account.enriched_ledger && account.enriched_ledger.ledger_id);
                const balance = account.balance / Math.pow(10, 2); // Using default scale 2
                const isNegative = balance < 0;
                const currencyCode = getCurrencyCode(account);
                
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
                      {account.account_type || (account.account_code && account.account_code.type) || account.type || 'N/A'}
                    </td>
                    <td 
                      className={`px-6 py-4 whitespace-nowrap text-sm ${entityId ? 'text-blue-600 cursor-pointer hover:underline' : 'text-gray-500'}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent other click handlers from firing
                        if (entityId && onViewEntity) {
                          console.log("Clicking entity owner in AccountList:", entityId);
                          onViewEntity(entityId);
                        }
                      }}
                    >
                      {entity ? entity.name : (account.entity ? account.entity.name : 'N/A')}
                    </td>
                    <td 
                      className={`px-6 py-4 whitespace-nowrap text-sm ${ledgerId ? 'text-blue-600 cursor-pointer hover:underline' : 'text-gray-500'}`}
                      onClick={() => ledgerId && onViewLedger && onViewLedger(ledgerId)}
                    >
                      {ledger ? ledger.name : (account.enriched_ledger?.name || account.ledger?.name || account.ledger_name || 'N/A')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {currencyCode}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${isNegative ? 'text-red-600' : 'text-gray-900'}`}>
                      {getFormattedBalance(account)}
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
                  <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
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