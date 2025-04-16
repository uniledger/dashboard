import React, { useState, useEffect } from 'react';
import { StandardList, FilterBadge } from '../common';
import { formatBalance, formatAccountCode } from '../../utils/formatters';

const API_BASE_URL = 'https://ledger.dev.ledgerrocket.com';

/**
 * Account List component using StandardList for consistent behavior
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
    // Get entity ID from account or its ledger
    const entityId = account.entity_id || 
      (account.enriched_ledger && account.enriched_ledger.entity_id) ||
      (account.entity && account.entity.entity_id);
    
    if (!entityId) {
      return null;
    }
    
    // Find entity in our fetched list
    const foundEntity = entities.find(e => e.entity_id === entityId);
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

  // Define columns for the DataTable
  const columns = [
    {
      key: 'account_id',
      header: 'ID',
      cellClassName: 'text-blue-600 hover:underline cursor-pointer font-medium',
      render: (account) => account.account_id || account.account_extra_id || 'N/A'
    },
    {
      key: 'name',
      header: 'Account Name',
      cellClassName: 'font-medium text-gray-900',
      render: (account) => account.name || 'N/A'
    },
    {
      key: 'account_code',
      header: 'Account Code',
      render: (account) => getAccountCodeDisplay(account)
    },
    {
      key: 'account_type',
      header: 'Type',
      render: (account) => account.account_type || (account.account_code && account.account_code.type) || account.type || 'N/A'
    },
    {
      key: 'entity',
      header: 'Account Owner',
      render: (account) => {
        const entity = getEntityForAccount(account);
        const entityId = entity?.entity_id || account.entity_id || (account.enriched_ledger && account.enriched_ledger.entity_id) || (account.entity && account.entity.entity_id);
        
        return {
          value: entity ? entity.name : (account.entity ? account.entity.name : 'N/A'),
          entityId,
          className: entityId ? 'text-blue-600 cursor-pointer hover:underline' : 'text-gray-500'
        };
      },
      cellClassName: (item, rendered) => rendered.className || 'text-gray-500',
      onClick: (item, rendered) => {
        if (rendered.entityId && onViewEntity) {
          onViewEntity(rendered.entityId);
          return true; // Prevent other click handlers
        }
        return false;
      },
      preventRowClick: true
    },
    {
      key: 'ledger',
      header: 'Ledger',
      render: (account) => {
        const ledger = getLedgerForAccount(account);
        const ledgerId = ledger?.ledger_id || account.ledger_id || (account.enriched_ledger && account.enriched_ledger.ledger_id);
        
        return {
          value: ledger ? ledger.name : (account.enriched_ledger?.name || account.ledger?.name || account.ledger_name || 'N/A'),
          ledgerId,
          className: ledgerId ? 'text-blue-600 cursor-pointer hover:underline' : 'text-gray-500'
        };
      },
      cellClassName: (item, rendered) => rendered.className || 'text-gray-500',
      onClick: (item, rendered) => {
        if (rendered.ledgerId && onViewLedger) {
          onViewLedger(rendered.ledgerId);
          return true; // Prevent other click handlers
        }
        return false;
      },
      preventRowClick: true
    },
    {
      key: 'currency',
      header: 'Currency',
      render: (account) => getCurrencyCode(account)
    },
    {
      key: 'balance',
      header: 'Balance',
      cellClassName: (account) => account.balance < 0 ? 'text-red-600 text-right font-medium' : 'text-gray-900 text-right font-medium',
      render: (account) => getFormattedBalance(account)
    }
  ];

  // Custom header component with filter badge if filtering is active
  const customHeader = accountTypeFilter ? (
    <div className="mb-4">
      <FilterBadge
        label={`Account Type: ${accountTypeFilter}`}
        onClear={onClearFilter}
        count={accounts.length}
        entityName="account"
      />
    </div>
  ) : null;

  return (
    <div>
      {customHeader}
      <StandardList
        data={accounts}
        columns={columns}
        title="Accounts"
        idField="account_id"
        onItemClick={(item) => onViewAccount ? onViewAccount(item) : null}
        onViewJson={onViewJson}
        onRefresh={onRefresh}
        searchPlaceholder="Search accounts..."
        emptyMessage="No accounts found"
      />
    </div>
  );
};

export default AccountList;