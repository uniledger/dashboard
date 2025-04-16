import React, { useEffect } from 'react';
import { DetailCard, ActionButton } from '../common';
import { getCountryDisplay } from '../../utils/formatters';

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
  onViewAccount,
  onRefresh
}) => {
  // Log a ledger to inspect structure
  useEffect(() => {
    if (entityLedgers && entityLedgers.length > 0) {
      console.log('Full ledger structure:', entityLedgers[0]);
    }
  }, [entityLedgers]);
  
  if (!entity) return null;

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
  
  // Format balance
  const formatBalance = (balance, scale) => {
    const amount = balance / Math.pow(10, scale);
    const roundedAmount = Math.round(amount);
    const formattedAmount = roundedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    if (roundedAmount < 0) {
      return `(${formattedAmount.replace('-', '')})`;
    } else {
      return formattedAmount;
    }
  };
  
  // Define sections for the basic info in the detail card
  const basicInfoSections = [
    {
      label: 'Entity ID',
      content: entity.entity_id
    },
    {
      label: 'Name',
      content: entity.name
    },
    {
      label: 'Type',
      content: entity.type || entity.entity_type || 'N/A'
    },
    {
      label: 'Country',
      content: getCountryDisplay(entity)
    }
  ];
  
  // Define detail card actions
  const detailActions = (
    <>
      <ActionButton
        variant="outline"
        onClick={() => onViewJson && onViewJson(entity, `Entity: ${entity.name}`)}
      >
        View JSON
      </ActionButton>
      <ActionButton
        variant="outline"
        onClick={onRefresh}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        }
      >
        Refresh
      </ActionButton>
      <ActionButton
        variant="secondary"
        onClick={onBack}
      >
        Back
      </ActionButton>
    </>
  );
  
  return (
    <div>
      {/* Entity Details Card using DetailCard component */}
      <DetailCard
        title="Entity Details"
        subtitle={entity.name}
        sections={basicInfoSections}
        actions={detailActions}
      />
      
      {/* Entity's Ledgers */}
      <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">Ledgers Owned</h3>
      <div className="bg-white rounded-lg shadow overflow-x-auto mb-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entityLedgers && entityLedgers.length > 0 ? entityLedgers.map(ledger => (
              <tr key={ledger.ledger_id} className="hover:bg-gray-50">
                <td 
                  className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline"
                  onClick={() => onViewLedger(ledger.ledger_id)}
                >
                  {ledger.ledger_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {ledger.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ledger.r_currency ? `${ledger.r_currency.currency_code} (${ledger.r_currency.type})` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getCountryDisplay(ledger, entity)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
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
      <h3 className="text-lg font-medium text-gray-900 mb-2">Accounts</h3>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ledger</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entityAccounts && entityAccounts.length > 0 ? entityAccounts
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
              .map(account => {
              const ledger = account.enriched_ledger || {};
              const currency = ledger.r_currency || {};
              const scale = currency.scale || 2;
              
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
                    {account.account_type || (account.account_code && account.account_code.type) || 'N/A'}
                  </td>
                  <td 
                    className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline"
                    onClick={() => ledger.ledger_id && onViewLedger && onViewLedger(ledger.ledger_id)}
                  >
                    {ledger.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                    {typeof account.balance === 'number' ? (
                      <span className={account.balance < 0 ? 'text-red-600' : 'text-gray-900'}>
                        {formatBalance(account.balance, scale)}
                      </span>
                    ) : 'N/A'}
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