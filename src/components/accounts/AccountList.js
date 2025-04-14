import React from 'react';
import PageHeader from '../shared/PageHeader';

/**
 * Account List component to display all accounts
 */
const AccountList = ({ accounts, entities = [], onViewJson }) => {
  return (
    <div>
      <PageHeader 
        title="Accounts Overview" 
        buttonText="+ New Account" 
        onButtonClick={() => console.log('Create new account')} 
      />
      
      <div className="bg-white shadow overflow-hidden rounded-lg">
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
              // Find entity from ledger or direct relationship
              const entityId = account.entity_id || 
                (account.enriched_ledger && account.enriched_ledger.entity_id);
              const entity = entities.find(e => e.entity_id === entityId);
              
              return (
                <tr key={account.account_extra_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.account_extra_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {account.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.account_code?.code || account.code || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.account_code?.type || account.type || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entity ? entity.name : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.enriched_ledger?.name || account.ledger_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {account.enriched_ledger?.r_currency?.currency_code || account.currency_code || ''} {' '}
                    {typeof account.balance === 'number' 
                      ? (account.balance / Math.pow(10, account.enriched_ledger?.r_currency?.scale || account.scale || 2)).toLocaleString()
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      View
                    </button>
                    <button 
                      className="text-gray-600 hover:text-gray-800"
                      onClick={() => onViewJson(account, `Account: ${account.name}`)}
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
      </div>
    </div>
  );
};

export default AccountList;