import React from 'react';
import PageHeader from '../shared/PageHeader';

/**
 * Component to display accounts filtered by their type (Asset, Liability, etc.)
 */
const AccountsByTypeView = ({ accountType, accounts, onBack, onViewAccount }) => {
  // Format the account type for display
  const formattedType = accountType.charAt(0) + accountType.slice(1).toLowerCase() + 's';
  
  // Format the balance with commas and handle negative values
  const formatBalance = (balance) => {
    const formatted = Math.abs(balance).toLocaleString();
    return balance < 0 ? `(${formatted})` : formatted;
  };

  return (
    <div>
      <PageHeader 
        title={`${formattedType} Accounts`}
        backButton={true}
        onBack={onBack}
      />
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {formattedType} Accounts ({accounts.length})
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Showing all accounts of type {accountType.toLowerCase()}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.length > 0 ? (
                accounts.map((account) => (
                  <tr key={account.account_extra_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {account.name || 'Unnamed Account'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.account_extra_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.account_code?.account_code || 'N/A'} 
                      {account.account_code?.type && `(${account.account_code.type})`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.entity?.name || 'N/A'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${account.balance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatBalance(account.balance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onViewAccount(account)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No accounts found for this type.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountsByTypeView;