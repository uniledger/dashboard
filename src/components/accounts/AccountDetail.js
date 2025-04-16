import React, { useEffect } from 'react';
import { 
  DetailCard, 
  ActionButton, 
  ErrorAlert, 
  LoadingSpinner 
} from '../common';
import useAccounts from '../../hooks/useAccounts';
import { formatBalance, formatAccountCode, getAccountType } from '../../utils/formatters';

/**
 * Account Detail component to display detailed information about a single account
 */
const AccountDetail = ({ 
  account, 
  onViewJson, 
  onBack, 
  onRefresh, 
  onViewEntity, 
  onViewLedger 
}) => {
  const { loading, error } = useAccounts();
  
  if (loading && !account) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading account details..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="mb-6">
        <ErrorAlert error={error} onRetry={onRefresh} />
        <div className="mt-4">
          <ActionButton
            variant="primary"
            onClick={onBack}
          >
            Back to Accounts List
          </ActionButton>
        </div>
      </div>
    );
  }
  
  if (!account) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No account selected.</p>
        <div className="mt-4">
          <ActionButton
            variant="primary"
            onClick={onBack}
          >
            Back to Accounts List
          </ActionButton>
        </div>
      </div>
    );
  }
  
  // Extract entity and ledger information
  const entity = account.entity || account.enriched_entity || 
    (account.enriched_ledger && account.enriched_ledger.entity);
    
  const ledger = account.ledger || account.enriched_ledger;
  
  // Extract currency information
  const currency = (ledger && ledger.r_currency) || account.currency;
  
  // Handle viewing entity
  const handleViewEntity = () => {
    if (entity && entity.entity_id && onViewEntity) {
      onViewEntity(entity.entity_id);
    }
  };
  
  // Handle viewing ledger
  const handleViewLedger = () => {
    if (ledger && ledger.ledger_id && onViewLedger) {
      onViewLedger(ledger.ledger_id);
    }
  };
  
  // Define sections for the basic info in the detail card
  const basicInfoSections = [
    {
      label: 'Account ID',
      content: account.account_id || account.account_extra_id || 'N/A'
    },
    {
      label: 'Account Type',
      content: getAccountType(account)
    },
    {
      label: 'Account Code',
      content: formatAccountCode(account.account_code || account.code)
    },
    {
      label: 'Entity',
      content: entity ? (
        <button 
          className="text-blue-600 hover:text-blue-800 hover:underline"
          onClick={handleViewEntity}
        >
          {entity.name || entity.entity_id}
        </button>
      ) : 'N/A'
    },
    {
      label: 'Ledger',
      content: ledger ? (
        <button 
          className="text-blue-600 hover:text-blue-800 hover:underline"
          onClick={handleViewLedger}
        >
          {ledger.name || ledger.ledger_id}
        </button>
      ) : 'N/A'
    },
    {
      label: 'Currency',
      content: (currency && currency.currency_code) || 
        account.currency_code || 
        (ledger && ledger.currency_code) || 
        'N/A'
    },
    {
      label: 'Current Balance',
      content: (
        <span className={typeof account.balance === 'number' && account.balance < 0 ? 'text-red-600 font-medium' : 'font-medium'}>
          {formatBalance(account.balance, currency, true)}
        </span>
      )
    }
  ];
  
  // Add creation info if available
  if (account.date_created) {
    basicInfoSections.push({
      label: 'Created',
      content: new Date(account.date_created).toLocaleString()
    });
  }
  
  // Define detail card actions
  const detailActions = (
    <>
      <ActionButton
        variant="outline"
        onClick={() => onViewJson && onViewJson(account, `Account: ${account.name || account.account_id}`)}
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
      <DetailCard
        title="Account Details"
        subtitle={account.name}
        sections={basicInfoSections}
        actions={detailActions}
      />
    </div>
  );
};

export default AccountDetail;