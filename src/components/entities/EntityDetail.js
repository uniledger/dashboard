import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GenericListView, GenericDetailView } from '../common';
import useEntities from '../../hooks/useEntities';
import { useDashboard } from '../../context/DashboardContext';
import { EntityListConfig } from './EntityListConfig.js';
import { EntityDetailConfig } from './EntityDetailConfig.js';

/**
 * Renders the entity detail view.
 *
 * Displays detailed information for a specific entity, including its ledgers and accounts. Fetches data using the useEntities hook and useParams for the entity ID. Renders content using GenericDetailView for entity details and GenericListView for related ledgers and accounts.
 *
 * @returns {JSX.Element} The rendered EntityDetail component, or null if no entity data.
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
  const basicSections = EntityDetailConfig.detailSections(entity);

  return (
    <div>
      <GenericDetailView
        data={entity}
        title="Entity Detail"
        subtitle={entity.name}
        sections={basicSections}
        childrenSections={[]}
        onBack={handleBack}
        onRefresh={handleRefresh}
        onViewJson={handleViewJson}
        loading={loading}
      />

      <GenericListView
        data={entityLedgers || []}
        title="Ledgers"
        columns={EntityDetailConfig.ledgersTableSection.columns}
        onRowClick={(ledger) => navigate(`/ledgers/${ledger.ledger_id}`)}
        emptyMessage="No ledgers found for this entity"
        onViewJson={handleViewJson}
        onRefresh={() => fetchEntityLedgers(entityId)}
        loading={loading}
      />

      <GenericListView
        data={entityAccounts || []}
        title="Accounts"
        columns={EntityDetailConfig.accountsTableSection.columns}
        onRowClick={(account) => {
          const id = account.account_id || account.account_extra_id;
          navigate(`/accounts/${id}`);
        }}
        emptyMessage="No accounts found for this entity"
        onViewJson={handleViewJson}
        onRefresh={() => refreshEntityAccounts(entityId)}
        loading={loading}
      />
    </div>
  );
};

export default EntityDetail;