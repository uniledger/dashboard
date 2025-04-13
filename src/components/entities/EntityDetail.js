import React from 'react';

/**
 * Entity Detail component to display a single entity with its ledgers and accounts
 */
const EntityDetail = ({ 
  entity,
  entityLedgers,
  entityAccounts,
  onBack,
  onViewJson,
  onViewLedger
}) => {
  if (!entity) return null;
  
  return (
    <div>
      {/* Entity Header with back button */}
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-3 text-gray-600 hover:text-gray-800"
        >
          ← Back to Entities
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          {entity.name}
        </h2>
        <button 
          className="ml-3 text-blue-600 hover:text-blue-800 text-sm"
          onClick={() => onViewJson(entity, `Entity: ${entity.name}`)}
        >
          View JSON
        </button>
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
            <p className="text-gray-900">{entity.country || 'N/A'}</p>
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
            {entityLedgers.length > 0 ? entityLedgers.map(ledger => (
              <tr key={ledger.ledger_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ledger.ledger_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ledger.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ledger.r_currency?.currency_code || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ledger.country || 'N/A'}
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
            {entityAccounts.length > 0 ? entityAccounts.map(account => (
              <tr key={account.account_extra_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {account.account_extra_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {account.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {account.account_code?.code || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {account.account_code?.type || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {account.enriched_ledger?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {account.enriched_ledger?.r_currency?.currency_code || ''} {' '}
                  {typeof account.balance === 'number' 
                    ? (account.balance / Math.pow(10, account.enriched_ledger?.r_currency?.scale || 2)).toLocaleString()
                    : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() => onViewJson(account, `Account: ${account.name}`)}
                  >
                    JSON
                  </button>
                </td>
              </tr>
            )) : (
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