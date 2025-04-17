import React, { useState, useEffect } from 'react';
import { GenericListView, AccountConfig, FilterBadge } from '../common';
import { formatBalance, formatAccountCode, getBalanceClass, getCurrencyInfo } from '../../utils/formatters';
import apiService from '../../services/apiService';

/**
 * Account List component using GenericListView
 */
const AccountList = ({ 
  accounts, 
  accountTypeFilter, 
  onViewJson, 
  onRefresh, 
  onViewEntity, 
  onViewLedger, 
  onViewAccount, 
  onClearFilter 
}) => {
  const [entities, setEntities] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch entity and ledger data for display and drilldown
  useEffect(() => {
    const fetchReferenceData = async () => {
      setLoading(true);
      try {
        // Fetch entities
        const entitiesData = await apiService.entity.getEntities();
        setEntities(entitiesData);
        
        // Fetch ledgers
        const ledgersData = await apiService.ledger.getLedgers();
        setLedgers(ledgersData);
      } catch (err) {
        console.error('Error fetching reference data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferenceData();
  }, []);

  // Helper function to find entity for an account
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

  const getCurrencyCode = (account) => {
    return (account.enriched_ledger && account.enriched_ledger.r_currency && account.enriched_ledger.r_currency.currency_code) || 
      account.currency_code || 
      'N/A';
  };

  // Define columns for the DataTable - start with the base AccountConfig columns
  const columns = [...AccountConfig.listColumns];
  
  // Add entity column
  columns.push({
    key: 'entity',
    header: 'Account Owner',
    render: (account) => {
      const entity = getEntityForAccount(account);
      return entity ? entity.name : (account.entity ? account.entity.name : 'N/A');
    },
    cellClassName: (account) => {
      const entityId = getEntityForAccount(account)?.entity_id || 
                       account.entity_id || 
                       (account.enriched_ledger && account.enriched_ledger.entity_id) || 
                       (account.entity && account.entity.entity_id);
      return entityId ? 'text-blue-600 cursor-pointer hover:underline' : 'text-gray-500';
    },
    onClick: (account) => {
      const entityId = getEntityForAccount(account)?.entity_id || 
                       account.entity_id || 
                       (account.enriched_ledger && account.enriched_ledger.entity_id) || 
                       (account.entity && account.entity.entity_id);
      if (entityId && onViewEntity) {
        onViewEntity(entityId);
        return true; // Prevent other click handlers
      }
      return false;
    },
    preventRowClick: true
  });

  // Add ledger column
  columns.push({
    key: 'ledger',
    header: 'Ledger',
    render: (account) => {
      const ledger = getLedgerForAccount(account);
      return ledger ? ledger.name : (account.enriched_ledger?.name || account.ledger?.name || account.ledger_name || 'N/A');
    },
    cellClassName: (account) => {
      const ledgerId = getLedgerForAccount(account)?.ledger_id || 
                       account.ledger_id || 
                       (account.enriched_ledger && account.enriched_ledger.ledger_id);
      return ledgerId ? 'text-blue-600 cursor-pointer hover:underline' : 'text-gray-500';
    },
    onClick: (account) => {
      const ledgerId = getLedgerForAccount(account)?.ledger_id || 
                       account.ledger_id || 
                       (account.enriched_ledger && account.enriched_ledger.ledger_id);
      if (ledgerId && onViewLedger) {
        onViewLedger(ledgerId);
        return true; // Prevent other click handlers
      }
      return false;
    },
    preventRowClick: true
  });

  // Add currency column
  columns.push({
    key: 'currency',
    header: 'Currency',
    render: (account) => getCurrencyCode(account)
  });

  // Make sure balance column is using consistent formatting
  const balanceColumnIndex = columns.findIndex(col => col.key === 'balance');
  if (balanceColumnIndex !== -1) {
    columns[balanceColumnIndex] = {
      ...columns[balanceColumnIndex],
      cellClassName: (account) => getBalanceClass(account.balance),
      render: (account) => {
        const currency = getCurrencyInfo(account);
        return formatBalance(account.balance, currency, true);
      }
    };
  }

  // Create filter object for GenericListView if filtering by account type
  const filter = accountTypeFilter ? {
    field: 'account_type',
    value: accountTypeFilter,
    label: 'Account Type'
  } : null;

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
    <GenericListView
      data={accounts}
      columns={columns}
      title="Accounts"
      idField="account_id"
      loading={loading}
      onItemClick={(item) => onViewAccount ? onViewAccount(item) : null}
      onViewJson={onViewJson}
      onRefresh={onRefresh}
      filter={filter}
      onClearFilter={onClearFilter}
      searchPlaceholder="Search accounts..."
      emptyMessage="No accounts found"
      customHeader={customHeader}
    />
  );
};

export default AccountList;