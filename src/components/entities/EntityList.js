import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericListView } from '../common';
import { EntityConfig } from './EntityConfig.js';
import useEntities from '../../hooks/useEntities';

/**
 * Entity List component using GenericListView
 */
const EntityList = () => {
  const navigate = useNavigate();
  const { entities, loading, fetchEntities } = useEntities();
  
  // Fetch entities when component mounts
  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);
  
  // Navigate to entity detail view when entity is clicked
  const handleViewDetails = (entity) => {
    // Extract the ID from the entity object
    const id = typeof entity === 'object' ? entity.entity_id : entity;
    navigate(`/entities/${id}`);
  };
  
  // Define the columns for the entity list
  const columns = [...EntityConfig.listColumns];
  
  return (
    <GenericListView
      data={entities}
      columns={columns}
      title="Entities"
      idField={EntityConfig.idField}
      onRowClick={handleViewDetails}
      onRefresh={fetchEntities}
      searchPlaceholder="Search entities..."
      emptyMessage="No entities found"
      loading={loading}
    />
  );
};

export default EntityList;