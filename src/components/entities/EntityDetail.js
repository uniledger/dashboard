import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GenericListView, GenericDetailView } from '../common';
import useEntities from '../../hooks/useEntities';
import { useDashboard } from '../../context/DashboardContext';
import { EntityConfig } from './EntityConfig.js';
import { drillFormatter } from '../../utils/formatters/drillFormatters.js';
import { formatAccountCode } from '../../utils/formatters/index';
import { getAccountType } from '../../utils/formatters/accountFormatters.js';
import { getCurrencyInfo } from '../../utils/formatters/index'; 
import { formatBalance } from '../../utils/formatters/index';
import { getCountryDisplay } from '../../utils/formatters/index';

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
          },
          {
            field: 'name',
            headerName: 'Name',
          },
          {
            field: 'currency',
            headerName: 'Currency',
            cellRenderer: props => props.data.r_currency ? `${props.data.r_currency.currency_code} (${props.data.r_currency.type})` : 'N/A',
          },
          {
            field: 'country',
            headerName: 'Country',
            cellRenderer: props => getCountryDisplay(props.data),
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
          },
          {
            field: 'name',
            headerName: 'Name',
          },
          {
            field: 'account_code',
            headerName: 'Account Code',
            cellRenderer: props => formatAccountCode(props.data.account_code || props.data.code),
          },
          {
            field: 'type',
            headerName: 'Type',
            cellRenderer: props => getAccountType(props.data),
          },
          {
            field: 'ledger',
            headerName: 'Ledger',
            suppressRowClickSelection: true,
            cellRenderer: props => drillFormatter('ledgers', props.data.enriched_ledger?.name, props.data.enriched_ledger?.ledger_id),
          },
          {
            field: 'balance',
            headerName: 'Balance',
            type: 'rightAligned',
            cellRenderer: props => formatBalance(props.data.balance, getCurrencyInfo(props.data), true),
          },
        ]}
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