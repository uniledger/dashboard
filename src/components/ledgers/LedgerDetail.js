import React from 'react';

/**
 * Ledger Detail component to display a single ledger with its accounts
 */
const LedgerDetail = ({ 
  ledger,
  entities,
  ledgerAccounts,
  onBack,
  onViewJson
}) => {
  if (!ledger) return null;
  
  // Find associated entity
  const entity = entities.find(e => e.entity_id === ledger.entity_id);
  
  return (
    <div>
      {/* Ledger Header with back button */}
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-3 text-gray-600 hover:text-gray-800"
        >
          ← Back to Ledgers
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          {ledger.name}
        </h2>
        <button 
          className="ml-3 text-blue-600 hover:text-blue-800 text-sm"
          onClick={() => onViewJson(ledger, `Ledger: ${ledger.name}`)}
        >
          View JSON
        </button>
      </div>
      
      {/* Ledger Details Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
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
            <p className="text-sm text-gray-500">Entity</p>
            <p className="text-gray-900">{entity?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Currency</p>
            <p className="text-gray-900">{ledger.r_currency?.currency_code || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Country</p>
            <p className="text-gray-900">{ledger.country || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-gray-900">{ledger.description || 'N/A'}</p>
          </div>
        </div>
      </div>
      
      {/* Ledger's Accounts */}
      <h3 className="text-lg font-medium text-gray-900 mb-3">Accounts in this Ledger</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ledgerAccounts.length > 0 ? ledgerAccounts.map(account => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {ledger.r_currency?.currency_code || ''} {' '}
                  {typeof account.balance === 'number' 
                    ? (account.balance / Math.pow(10, ledger.r_currency?.scale || 2)).toLocaleString()
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
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
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