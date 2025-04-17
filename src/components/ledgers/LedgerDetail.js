import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GenericDetailView, DataTableSection, LedgerConfig } from '../common';
import { formatBalance, getCountryDisplay, formatAccountCode, getBalanceClass, getCurrencyInfo } from '../../utils/formatters';
import apiService from '../../services/apiService';
import useLedgers from '../../hooks/useLedgers';
import { useDashboard } from '../../context/DashboardContext';

/**
 * Ledger Detail component using GenericDetailView
 */
const LedgerDetail = () => {
  const { ledgerId } = useParams();
  const navigate = useNavigate();
  const { handleViewJson } = useDashboard();
  
  const {
    selectedLedger: ledger,
    ledgerAccounts,
    loading,
    fetchLedgerById,
    refreshLedgerAccounts
  } = useLedgers();
  
  // All hooks must be at the top level
  const [entity, setEntity] = useState(null);
  const [entities, setEntities] = useState([]);
  
  // Fetch ledger data when component mounts or ledgerId changes
  useEffect(() => {
    if (ledgerId) {
      fetchLedgerById(ledgerId);
    }
  }, [ledgerId, fetchLedgerById]);
  
  // Use useEffect for fetching entity details
  useEffect(() => {
    // Skip if no ledger or if ledger already has entity data
    if (!ledger || !ledger.entity_id || ledger.r_entity) {
      return;
    }
    
    const fetchEntity = async () => {
      try {
        const data = await apiService.entity.getEntityById(ledger.entity_id);
        setEntity(data);
      } catch (err) {
        console.error('Error fetching entity details:', err);
      }
    };

    fetchEntity();
  }, [ledger]);
  
  // Fetch all entities for linking accounts to their owners
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const data = await apiService.entity.getEntities();
        setEntities(data);
      } catch (err) {
        console.error('Error fetching entities:', err);
      }
    };
    
    fetchEntities();
  }, []);

  // Early return if no ledger, but after hooks are declared
  if (!ledger) return null;
  
  // Handle navigation back to ledger list
  const handleBack = () => {
    navigate('/ledgers');
  };
  
  // Handle refresh
  const handleRefresh = () => {
    refreshLedgerAccounts(ledgerId);
  };
  
  // Helper function for account codes
  const getAccountCodeDisplay = (account) => {
    if (!account) return 'N/A';
    return formatAccountCode(account.account_code || account.code);
  };
  
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
  
  // Get entity from ledger or from separate fetch
  const displayEntity = ledger.r_entity || entity;
  
  // Add entity information to basic sections
  const basicSections = LedgerConfig.detailSections(ledger, displayEntity);
  
  // Add an entity link if entity is available
  if (displayEntity) {
    // Find the index of the Owner field
    const ownerIndex = basicSections.findIndex(section => section.label === 'Owner');
    
    if (ownerIndex !== -1) {
      // Replace owner section with clickable link
      basicSections[ownerIndex] = {
        label: 'Owner',
        content: (
          <Link 
            to={`/entities/${displayEntity.entity_id}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {displayEntity.name}
          </Link>
        )
      };
    }
  }
  
  // Define the accounts table section
  const accountsTableSection = {
    label: 'Accounts in this Ledger',
    content: (
      <DataTableSection
        data={ledgerAccounts || []}
        title="Accounts"
        columns={[
          {
            key: 'account_id',
            header: 'ID',
            cellClassName: 'text-blue-600 cursor-pointer hover:underline',
            render: (account) => {
              const id = account.account_id || account.account_extra_id || 'N/A';
              return <Link to={`/accounts/${id}`}>{id}</Link>;
            }
          },
          {
            key: 'name',
            header: 'Name',
            cellClassName: 'font-medium text-gray-900',
            render: (account) => account.name || 'N/A'
          },
          {
            key: 'account_code',
            header: 'Account Code',
            render: (account) => getAccountCodeDisplay(account)
          },
          {
            key: 'type',
            header: 'Type',
            render: (account) => account.account_type || (account.account_code && account.account_code.type) || 'N/A'
          },
          {
            key: 'entity',
            header: 'Account Owner',
            cellClassName: (account) => {
              const accountEntity = getEntityForAccount(account);
              const accountEntityId = accountEntity?.entity_id || account.entity_id;
              return accountEntityId ? 'text-blue-600 cursor-pointer hover:underline' : 'text-gray-500';
            },
            render: (account) => {
              const accountEntity = getEntityForAccount(account);
              const entityName = accountEntity ? accountEntity.name : (account.entity ? account.entity.name : 'N/A');
              const entityId = accountEntity?.entity_id || account.entity_id || (account.entity && account.entity.entity_id);
              
              return entityId ? (
                <Link to={`/entities/${entityId}`}>{entityName}</Link>
              ) : entityName;
            }
          },
          {
            key: 'balance',
            header: 'Balance',
            align: 'right',
            cellClassName: (account) => getBalanceClass(account.balance),
            render: (account) => {
              // Use the ledger's currency as the reference for all accounts in this view
              const currency = ledger.r_currency || getCurrencyInfo(account);
              return formatBalance(account.balance, currency, true);
            }
          },
          {
            key: 'actions',
            header: 'Actions',
            align: 'center',
            render: (account) => (
              <button 
                className="text-gray-600 hover:text-gray-800"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewJson(account, `Account: ${account.name || 'N/A'}`);
                }}
              >
                JSON
              </button>
            )
          }
        ]}
        sortFunction={(a, b) => {
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
        }}
        onRowClick={(account) => {
          const id = account.account_id || account.account_extra_id;
          navigate(`/accounts/${id}`);
        }}
        emptyMessage="No accounts found for this ledger"
      />
    )
  };
  
  return (
    <GenericDetailView
      data={ledger}
      title="Ledger Detail"
      subtitle={ledger.name}
      sections={basicSections}
      childrenSections={[accountsTableSection]}
      onBack={handleBack}
      onRefresh={handleRefresh}
      onViewJson={handleViewJson}
      loading={loading}
    />
  );
};

export default LedgerDetail;