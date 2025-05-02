import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GenericDetailView, LedgerConfig, GenericListView } from '../common';
import { formatBalance, formatAccountCode, getBalanceClass, getCurrencyInfo } from '../../utils/formatters/index';
import apiService from '../../services/apiService'; // Assuming apiService is defined elsewhere
import useLedgers from '../../hooks/useLedgers';
import { useDashboard } from '../../context/DashboardContext';
import { accountCodeCellRenderer, accountIDDrillCellRenderer, accountTypeCellRenderer, enrichedEntityDrillCellRenderer } from '../common/CellRenderers';

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
  
  // Debug: log ledgerAccounts shape to inspect entity field name
  console.log('LedgerDetail ledgerAccounts sample:', ledgerAccounts[0]);
  
  // All hooks must be at the top level
  const [entity, setEntity] = useState(null);
  
  // Fetch ledger data when component mounts or ledgerId changes
    useEffect(() => {
    if (ledgerId) {
      fetchLedgerById(ledgerId);
    }
  }, [ledgerId, fetchLedgerById]);
  
  // Fetch raw ledger accounts data to inspect exact field names
  useEffect(() => {
    if (ledger && ledger.ledger_id) {
      apiService.ledger.getLedgerAccounts(ledger.ledger_id)
        .then(data => console.log('API ledgerAccounts raw:', data));
    }
  }, [ledger]);
  
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
      <GenericListView
        data={ledgerAccounts || []}
        title="Accounts"
        columns={[
          {
            field: 'account_id',
            headerName: 'ID',
            cellRenderer: accountIDDrillCellRenderer,
          },
          {
            field: 'name',
            headerName: 'Name',
          },
          {
            field: 'account_code',
            headerName: 'Account Code',
            cellRenderer: accountCodeCellRenderer,
          },
          {
            field: 'type',
            headerName: 'Type',
            cellRenderer: accountTypeCellRenderer,
          },
          {
            field: 'enriched_entity',
            headerName: 'Account Owner',
            cellRenderer: enrichedEntityDrillCellRenderer,
          },
          {
            field: 'balance',
            headerName: 'Balance',
            align: 'right',
            cellClassName: (account) => getBalanceClass(account.balance),
            render: (account) => {
              // Use the ledger's currency as the reference for all accounts in this view
              const currency = ledger.r_currency || getCurrencyInfo(account);
              return formatBalance(account.balance, currency, true);
            }
          },
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
        onViewJson={handleViewJson}
        onRefresh={() => refreshLedgerAccounts(ledgerId)}
        loading={loading}
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
      onViewJson={handleViewJson}
      loading={loading}
    />
  );
};

export default LedgerDetail;