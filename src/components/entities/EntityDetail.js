import React from 'react';
import PageHeader from '../shared/PageHeader';

/**
 * Entity Detail component to display a single entity with its ledgers and accounts
 * with enhanced JSON display and proper nested data handling
 */
const EntityDetail = ({ 
  entity,
  entityLedgers,
  entityAccounts,
  onBack,
  onViewJson,
  onViewLedger,
  onRefresh
}) => {
  if (!entity) return null;
  
  // Helper function for country display
  const getCountryDisplay = (entity) => {
    if (!entity) return 'N/A';
    
    // Handle when r_country is available
    if (entity.r_country) {
      return `${entity.r_country.name} (${entity.r_country.country_code})`;
    }
    
    // Fallback to just country code
    return entity.country_code || 'N/A';
  };

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
  
  return (
    <div>
      {/* Entity Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-3 text-gray-600 hover:text-gray-800"
          >
            ← Back to Entities
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {entity.name}
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
            onClick={() => onViewJson(entity, `Entity: ${entity.name}`)}
          >
            <span>View Full JSON</span>
            <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Entity Details Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">ID</p>
            <p className="text-gray-900">{entity.entity_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-gray-900">{entity.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Country</p>
            <p className="text-gray-900">{getCountryDisplay(entity)}</p>
          </div>
          {/* Additional properties can be added here if available in the API */}
        </div>
      </div>
      
      {/* Entity's Ledgers */}
      <h3 className="text-lg font-medium text-gray-900 mb-3">Ledgers</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entityLedgers && entityLedgers.length > 0 ? entityLedgers.map(ledger => (
              <tr key={ledger.ledger_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ledger.ledger_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ledger.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ledger.r_currency ? `${ledger.r_currency.currency_code} (${ledger.r_currency.type})` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getCountryDisplay(ledger)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => onViewLedger(ledger.ledger_id)}
                  >
                    View
                  </button>
                  <button 
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() => onViewJson(ledger, `Ledger: ${ledger.name}`)}
                  >
                    JSON
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No ledgers found for this entity
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Entity's Accounts */}
      <h3 className="text-lg font-medium text-gray-900 mb-3">Accounts</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ledger</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entityAccounts && entityAccounts.length > 0 ? entityAccounts.map(account => {
              const ledger = account.enriched_ledger || {};
              const currency = ledger.r_currency || {};
              const scale = currency.scale || 2;
              
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
                    {account.account_type || (account.account_code && account.account_code.type) || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ledger.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {currency.currency_code || ''} {' '}
                    {typeof account.balance === 'number' 
                      ? (account.balance / Math.pow(10, scale)).toLocaleString()
                      : 'N/A'}
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
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No accounts found for this entity
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EntityDetail;