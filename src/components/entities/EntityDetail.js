import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GenericListView, GenericDetailView, EntityConfig } from '../common';
import { getCountryDisplay, formatAccountCode, formatBalance, getBalanceClass, getCurrencyInfo } from '../../utils/formatters/index';
import useEntities from '../../hooks/useEntities';
import { useDashboard } from '../../context/DashboardContext';
import { accountCodeCellRenderer, accountIDDrillCellRenderer, accountTypeCellRenderer, balanceCellRenderer, ledgerIDDrillCellRenderer, countryCellRenderer, enrichedLedgerDrillCellRenderer, ledgerCurrencyCellRenderer } from '../common/CellRenderers';

/**
 * Entity Detail component using GenericDetailView
 */
const EntityDetail = () => {
  const { entityId } = useParams();
  const navigate = useNavigate();
  const { handleViewJson } = useDashboard();
  
  const {
    selectedEntity: entity,
    entityLedgers,
    entityAccounts,
    loading,
    fetchEntityById,
    fetchEntityLedgers,
    refreshEntityAccounts
  } = useEntities();
  
  // Fetch entity data when component mounts or entityId changes
  useEffect(() => {
    if (entityId) {
      fetchEntityById(entityId);
    }
  }, [entityId, fetchEntityById]);
  
  if (!entity) return null;
  
  // Handle navigation back to entity list
  const handleBack = () => {
    navigate('/entities');
  };
  
  // Handle refresh
  const handleRefresh = () => {
    refreshEntityAccounts(entityId);
  };
  
  // Helper function to format account code
  const getAccountCodeDisplay = (account) => {
    if (!account) return 'N/A';
    return formatAccountCode(account.account_code || account.code);
  };
  
  // Define basic information sections
  const basicSections = EntityConfig.detailSections(entity);
  
  // Define the ledgers table section
  const ledgersTableSection = {
    label: 'Ledgers Owned',
    content: (
      <GenericListView
        data={entityLedgers || []}
        title="Ledgers"
        columns={[
          {
            field: 'ledger_id',
            headerName: 'ID',
            cellRenderer: ledgerIDDrillCellRenderer,
            cellClassName: 'text-blue-600 cursor-pointer hover:underline',
            render: (ledger) => (
              <Link to={`/ledgers/${ledger.ledger_id}`}>
                {ledger.ledger_id}
              </Link>
            )
          },
          {
            field: 'name',
            headerName: 'Name',
          },
          {
            field: 'currency',
            headerName: 'Currency',
            cellRenderer: ledgerCurrencyCellRenderer,
          },
          {
            field: 'country',
            headerName: 'Country',
            cellRenderer: countryCellRenderer,
          },
        ]}
        onRowClick={(ledger) => navigate(`/ledgers/${ledger.ledger_id}`)}
        emptyMessage="No ledgers found for this entity"
        onViewJson={handleViewJson}
        onRefresh={() => fetchEntityLedgers(entityId)}
        loading={loading}
      />
    )
  };
  
  // Define the accounts table section
  const accountsTableSection = {
    label: 'Accounts',
    content: (
      <GenericListView
        data={entityAccounts || []}
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
            field: 'ledger',
            headerName: 'Ledger',
            cellRenderer: enrichedLedgerDrillCellRenderer,
          },
          {
            field: 'balance',
            headerName: 'Balance',
            type: 'rightAligned',
            cellRenderer: balanceCellRenderer,
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
        emptyMessage="No accounts found for this entity"
        onViewJson={handleViewJson}
        onRefresh={() => refreshEntityAccounts(entityId)}
        loading={loading}
      />
    )
  };
  
  return (
    <GenericDetailView
      data={entity}
      title="Entity Detail"
      subtitle={entity.name}
      sections={basicSections}
      childrenSections={[ledgersTableSection, accountsTableSection]}
      onBack={handleBack}
      onRefresh={handleRefresh}
      onViewJson={handleViewJson}
      loading={loading}
    />
  );
};

export default EntityDetail;