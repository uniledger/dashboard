import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GenericDetailView, DataTableSection, LedgerConfig } from '../common';
import { formatBalance, formatAccountCode, getBalanceClass, getCurrencyInfo } from '../../utils/formatters/index';
import apiService from '../../services/apiService'; // Assuming apiService is defined elsewhere
import useLedgers from '../../hooks/useLedgers';
import { useDashboard } from '../../context/DashboardContext';

/**
 * Ledger Detail component using GenericDetailView
 */
const LedgerDetail = () => {
  // Destructure the object returned by useParams
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
  
  // We don't need to fetch entities anymore

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
  
  // Helper function to get entity information from account object directly
  const getEntityInfo = (account) => {
    return {
      name: account.entity?.name || account.enriched_ledger?.entity?.name || 'N/A',
      entity_id: account.entity_id || 
                 (account.enriched_ledger && account.enriched_ledger.entity_id) ||
                 (account.entity && account.entity.entity_id)
    };
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
              const entityInfo = getEntityInfo(account);
              return entityInfo.entity_id ? 'text-blue-600 cursor-pointer hover:underline' : 'text-gray-500';
            },
            render: (account) => {
              const entityInfo = getEntityInfo(account);
              
              return entityInfo.entity_id ? (
                <Link to={`/entities/${entityInfo.entity_id}`}>{entityInfo.name}</Link>
              ) : entityInfo.name;
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