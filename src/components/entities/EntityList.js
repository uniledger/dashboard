import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericListView } from '../common';
import { EntityListConfig } from './EntityListConfig.js';
import useEntities from '../../hooks/useEntities';

/**
 * Renders a list of entities using the `GenericListView` component.
 * It utilizes the `useEntities` hook to fetch and manage entity data and
 * handles navigation to the detailed view of an entity when a row is clicked.
 * The list configuration (columns, etc.) is sourced from `EntityListConfig`.
 * This component does not take any direct props.
 * 
 * @returns {JSX.Element} The rendered EntityList component.
 */
const EntityList = () => {
  const navigate = useNavigate();
  const { entities, loading, fetchEntities } = useEntities();
  
  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);
  
  /**
   * Handles the navigation to an entity's detail view.
   *
   * @param {Object|string} entity - The entity object or entity ID.
   */
  const handleViewDetails = (entity) => {
    // Extract the ID from the entity object
    const id = typeof entity === 'object' ? entity.entity_id : entity;
    navigate(`/entities/${id}`);
  };
  
  // Define the columns for the entity list
  const columns = [...EntityListConfig.listColumns];
  
  return (
    <GenericListView
      data={entities}
      columns={columns}
      title="Entities"
      idField={EntityListConfig.idField}
      onRowClick={handleViewDetails}
      onRefresh={fetchEntities}
      searchPlaceholder="Search entities..."
      emptyMessage="No entities found"
      loading={loading}
    />
  );
};

export default EntityList;