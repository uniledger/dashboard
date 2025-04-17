import React from 'react';
import { formatBalance, formatAccountCode, getAccountType } from '../../../utils/formatters/index';

/**
 * Reusable accounts table component for displaying a list of accounts
 * 
 * @param {Object} props Component props
 * @param {Array} props.accounts List of accounts to display
 * @param {Function} props.onViewAccount Function to handle viewing an account
 * @param {Function} props.onViewLedger Function to handle viewing a ledger
 * @param {Function} props.onViewEntity Function to handle viewing an entity
 * @param {Function} props.onViewJson Function to handle viewing JSON data
 * @param {Object} props.currency Optional currency object for formatting balances
 * @param {string} props.emptyMessage Message to display when no accounts are found
 * @param {boolean} props.showLedger Whether to show the ledger column
 * @param {boolean} props.showEntity Whether to show the entity column
 */
const AccountsTable = ({ 
  accounts = [], 
  onViewAccount,
  onViewLedger,
  onViewEntity,
  onViewJson,
  currency,
  emptyMessage = "No accounts found",
  showLedger = true,
  showEntity = true
}) => {
  // Helper function for account codes
  const getAccountCodeDisplay = (account) => {
    return formatAccountCode(account.account_code || account.code);
  };
  
  // Helper function to find entity for an account
  const getEntityForAccount = (account) => {
    // Get entity from any available source
    return account.entity || 
      account.enriched_entity || 
      (account.enriched_ledger && account.enriched_ledger.entity);
  };
  
  // Helper function to get ledger for an account
  const getLedgerForAccount = (account) => {
    return account.ledger || account.enriched_ledger;
  };
  
  // Sort accounts by account code
  const sortedAccounts = [...accounts].sort((a, b) => {
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
  });
  
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Code</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            {showEntity && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {showLedger ? 'Owner' : 'Entity'}
              </th>
            )}
            {showLedger && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ledger</th>
            )}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedAccounts && sortedAccounts.length > 0 ? sortedAccounts.map(account => {
            const entity = getEntityForAccount(account);
            const ledger = getLedgerForAccount(account);
            const accountCurrency = currency || 
              (ledger && ledger.r_currency) || 
              account.currency;
            
            return (
              <tr key={account.account_id || account.account_extra_id} className="hover:bg-gray-50">
                <td 
                  className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline"
                  onClick={() => onViewAccount && onViewAccount(account)}
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
                  {getAccountType(account)}
                </td>
                {showEntity && entity && (
                  <td 
                    className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline"
                    onClick={() => onViewEntity && entity.entity_id && onViewEntity(entity.entity_id)}
                  >
                    {entity.name || entity.entity_id || 'N/A'}
                  </td>
                )}
                {showLedger && ledger && (
                  <td 
                    className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline"
                    onClick={() => onViewLedger && ledger.ledger_id && onViewLedger(ledger.ledger_id)}
                  >
                    {ledger.name || ledger.ledger_id || 'N/A'}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                  {typeof account.balance === 'number' ? (
                    <span className={account.balance < 0 ? 'text-red-600' : 'text-gray-900'}>
                      {formatBalance(account.balance, accountCurrency, true)}
                    </span>
                  ) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <button 
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() => onViewJson && onViewJson(account, `Account: ${account.name || 'N/A'}`)}
                  >
                    JSON
                  </button>
                </td>
              </tr>
            );
          }) : (
            <tr>
              <td colSpan={showLedger && showEntity ? 8 : (showLedger || showEntity ? 7 : 6)} className="px-6 py-4 text-center text-sm text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsTable;