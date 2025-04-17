import React from 'react';
import { GenericListView, EntityConfig } from '../common';

/**
 * Entity List component using GenericListView
 */
const EntityList = ({ 
  entities,
  onViewDetails,
  onViewJson,
  onRefresh
}) => {
  // Define the columns for the entity list
  const columns = [...EntityConfig.listColumns];
  
  return (
    <GenericListView
      data={entities}
      columns={columns}
      title="Entities"
      idField={EntityConfig.idField}
      onItemClick={onViewDetails}
      onViewJson={onViewJson}
      onRefresh={onRefresh}
      searchPlaceholder="Search entities..."
      emptyMessage="No entities found"
    />
  );
};

export default EntityList;